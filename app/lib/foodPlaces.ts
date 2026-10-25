export interface FoodPlace {
  name: string;
  address: string;
  mapUrl: string;
  websiteUrl?: string;
}

interface GooglePlace {
  displayName?: { text?: string };
  formattedAddress?: string;
  googleMapsUri?: string;
  websiteUri?: string;
}

interface GooglePlacesResponse {
  places?: GooglePlace[];
}

type FoodPlaceSearchResult =
  | { ok: true; places: FoodPlace[] }
  | { ok: false; reason: 'not_configured' | 'unavailable' };

export async function searchFoodPlaces(zipCode: string): Promise<FoodPlaceSearchResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: 'not_configured' };
  }

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.googleMapsUri,places.websiteUri',
      },
      body: JSON.stringify({
        textQuery: `food pantry food bank community food assistance near ${zipCode}, United States`,
        maxResultCount: 6,
        regionCode: 'US',
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error('Google Places search failed.', { status: response.status });
      return { ok: false, reason: 'unavailable' };
    }

    const data = (await response.json()) as GooglePlacesResponse;
    const places = (data.places ?? [])
      .filter((place) => place.displayName?.text && place.formattedAddress)
      .map((place) => {
        const name = place.displayName?.text ?? 'Food assistance provider';
        const address = place.formattedAddress ?? '';
        return {
          name,
          address,
          mapUrl: place.googleMapsUri
            ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`,
          websiteUrl: place.websiteUri,
        };
      });

    return { ok: true, places };
  } catch (error: unknown) {
    console.error('Unable to complete Google Places search.', error);
    return { ok: false, reason: 'unavailable' };
  }
}
