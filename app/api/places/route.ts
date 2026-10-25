import { searchFoodPlaces } from '../../lib/foodPlaces';

export async function POST(request: Request) {
  let zipCode: unknown;
  try {
    const body: unknown = await request.json();
    zipCode = typeof body === 'object' && body !== null && 'zipCode' in body
      ? body.zipCode
      : undefined;
  } catch {
    return Response.json({ error: 'Enter a valid 5-digit ZIP code to search.' }, { status: 400 });
  }

  if (typeof zipCode !== 'string' || !/^\d{5}$/.test(zipCode.trim())) {
    return Response.json({ error: 'Enter a valid 5-digit ZIP code to search.' }, { status: 400 });
  }

  const result = await searchFoodPlaces(zipCode.trim());
  if (!result.ok) {
    return Response.json(
      {
        error: result.reason === 'not_configured'
          ? 'Nearby place search is not configured yet. Add a Google Maps API key with Places API enabled.'
          : 'Nearby place search is temporarily unavailable. Check the Google Maps API key and try again.',
      },
      { status: result.reason === 'not_configured' ? 503 : 502 },
    );
  }

  return Response.json({ places: result.places });
}
