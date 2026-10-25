import { searchFoodPlaces, type FoodPlace } from '../../../lib/foodPlaces';

interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

interface SeekerPreferences {
  householdSize?: string;
  dietaryNeeds?: string;
  accessibilityNeeds?: string;
  notes?: string;
}

interface ChatRequest {
  message?: unknown;
  history?: unknown;
  profile?: unknown;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizePreferences(value: unknown): SeekerPreferences {
  if (!isRecord(value)) {
    return {};
  }

  const fields = ['householdSize', 'dietaryNeeds', 'accessibilityNeeds', 'notes'] as const;
  const preferences: SeekerPreferences = {};
  for (const field of fields) {
    const entry = value[field];
    if (typeof entry === 'string') {
      preferences[field] = entry.trim().slice(0, 300);
    }
  }
  return preferences;
}

function isChatHistory(value: unknown): value is ChatTurn[] {
  return Array.isArray(value) && value.length <= 12 && value.every((turn) =>
    isRecord(turn)
    && (turn.role === 'user' || turn.role === 'assistant')
    && typeof turn.content === 'string'
    && turn.content.length <= 500,
  );
}

function extractZipCode(message: string) {
  return message.match(/\b(\d{5})(?:-\d{4})?\b/)?.[1];
}

function buildSystemPrompt(preferences: SeekerPreferences, places?: FoodPlace[]) {
  const preferenceLines = [
    preferences.householdSize ? `Household size: ${preferences.householdSize}` : '',
    preferences.dietaryNeeds ? `Dietary needs/preferences: ${preferences.dietaryNeeds}` : '',
    preferences.accessibilityNeeds ? `Accessibility or transportation needs: ${preferences.accessibilityNeeds}` : '',
    preferences.notes ? `Other notes the user chose to share: ${preferences.notes}` : '',
  ].filter(Boolean);

  return [
    'You are Foodie, a warm, practical food-support assistant for people seeking food in Michigan.',
    'Answer the user’s actual question directly and vary your response to the conversation. Give concrete next steps and ask at most one focused follow-up question when important information is missing.',
    'Use the user-provided preferences below to personalize suggestions. Never repeat private notes unnecessarily. Do not ask for a full street address, passwords, payment information, or other sensitive data; a city or ZIP code is enough.',
    'Be careful and honest: you do not know live pantry inventory, opening hours, eligibility decisions, or dietary/allergen safety. Tell users to confirm those details with a provider. Never guarantee that a provider can meet a dietary or accessibility need.',
    'When Google Places search results are included, recommend only places from that list and use their exact names and addresses. Do not invent providers, URLs, hours, eligibility, or services. Mention that users should call ahead.',
    'If a user needs food urgently, provide calm immediate steps and suggest contacting local emergency/community resources; do not imply that you are an emergency service.',
    'Use clear, respectful language, avoid judgment, and keep the answer concise but genuinely useful.',
    preferenceLines.length ? `User preferences:\n${preferenceLines.join('\n')}` : 'The user has not provided any saved food-support preferences.',
    places?.length
      ? `Verified Google Places results for the ZIP code in the user’s message:\n${JSON.stringify(places)}`
      : 'No live Google Places results are available for this message. Do not claim that a live nearby-place search was performed.',
  ].join('\n\n');
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'Foodie AI is not configured yet. Add a Gemini API key to harvestlink-app/.env.local and restart the dev server.' },
      { status: 503 },
    );
  }

  let body: ChatRequest;
  try {
    const parsed: unknown = await request.json();
    if (!isRecord(parsed)) {
      return Response.json({ error: 'Invalid chat request.' }, { status: 400 });
    }
    body = parsed;
  } catch {
    return Response.json({ error: 'Invalid chat request.' }, { status: 400 });
  }

  if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 500) {
    return Response.json({ error: 'Enter a question of 1 to 500 characters.' }, { status: 400 });
  }
  if (body.history !== undefined && !isChatHistory(body.history)) {
    return Response.json({ error: 'Chat history is invalid. Please start a new message.' }, { status: 400 });
  }

  const message = body.message.trim();
  const zipCode = extractZipCode(message);
  let places: FoodPlace[] | undefined;
  let placesUnavailable = false;

  if (zipCode && process.env.GOOGLE_MAPS_API_KEY) {
    const searchResult = await searchFoodPlaces(zipCode);
    if (searchResult.ok) {
      places = searchResult.places;
    } else {
      placesUnavailable = true;
    }
  } else if (zipCode) {
    placesUnavailable = true;
  }

  const history = body.history as ChatTurn[] | undefined;
  let geminiResponse: Response;
  try {
    geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: buildSystemPrompt(sanitizePreferences(body.profile), places) }],
          },
          contents: [
            ...(history ?? []).slice(-10).map((turn) => ({
              role: turn.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: turn.content }],
            })),
            { role: 'user', parts: [{ text: message }] },
          ],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.6,
          },
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(20000),
      },
    );
  } catch (error: unknown) {
    console.error('Foodie Gemini request failed.', error);
    return Response.json({ error: 'Foodie could not reach the AI service. Please try again.' }, { status: 502 });
  }

  if (!geminiResponse.ok) {
    console.error('Foodie Gemini response was unsuccessful.', { status: geminiResponse.status });
    if (geminiResponse.status === 429) {
      return Response.json(
        { error: 'Foodie has reached the Gemini API usage limit for now. Please wait a little and try again.' },
        { status: 429 },
      );
    }
    return Response.json(
      { error: 'Foodie could not get an AI response. Check the Gemini API key and model access, then try again.' },
      { status: 502 },
    );
  }

  let result: GeminiResponse;
  try {
    result = (await geminiResponse.json()) as GeminiResponse;
  } catch (error: unknown) {
    console.error('Foodie received an invalid Gemini response.', error);
    return Response.json({ error: 'Foodie received an invalid response. Please try again.' }, { status: 502 });
  }

  const answer = result.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim();
  if (!answer) {
    return Response.json({ error: 'Foodie did not receive a usable answer. Please try again.' }, { status: 502 });
  }

  return Response.json({
    answer,
    places,
    placesUnavailable,
  });
}
