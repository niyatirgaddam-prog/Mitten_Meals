'use client';

import { useEffect, useMemo, useState } from 'react';
import SiteShell from '../components/SiteShell';

type Marker = {
  name: string;
  type: string;
  color: string;
  address: string;
  available: string;
  website?: string;
  openHours: string;
  support: string;
  lat?: number;
  lng?: number;
};

type Coordinates = { lat: number; lng: number };

type MarkerResult = Marker & { distanceMiles: number };

const defaultLocation: Coordinates = { lat: 42.3314, lng: -83.0458 };

const zipCoordinates: Record<string, Coordinates> = {
  '48201': { lat: 42.3314, lng: -83.0458 },
  '48207': { lat: 42.3314, lng: -83.0458 },
  '48197': { lat: 42.2776, lng: -83.7409 },
  '48502': { lat: 43.0111, lng: -83.6878 },
  '49503': { lat: 42.9634, lng: -85.6713 },
  '49007': { lat: 42.2928, lng: -85.5872 },
  '48823': { lat: 42.7369, lng: -84.5531 },
  '49014': { lat: 42.3212, lng: -85.1797 },
  '49011': { lat: 42.2796, lng: -85.1797 },
  '49017': { lat: 42.3386, lng: -85.1836 },
  '49423': { lat: 42.9618, lng: -85.7307 },
};

const staticMarkers: Marker[] = [
  {
    name: 'Gleaners Community Food Bank',
    type: 'Food bank',
    color: 'bg-emerald-600',
    address: '2131 W. Lafayette Blvd, Detroit, MI',
    available: 'Fresh produce, pantry staples, and family support',
    website: 'https://www.gleaners.org/',
    openHours: 'Mon–Sat · 9:00 AM–5:00 PM',
    support: 'Fresh produce, pantry staples, and family food support',
    lat: 42.3314,
    lng: -83.0458,
  },
  {
    name: 'Capuchin Soup Kitchen',
    type: 'Community kitchen',
    color: 'bg-sky-600',
    address: '3198 E. Jefferson Ave, Detroit, MI',
    available: 'Prepared meals and hot food support',
    website: 'https://www.capuchinsoupkitchen.org/',
    openHours: 'Tue–Sun · 8:30 AM–4:30 PM',
    support: 'Hot meals, ready-to-eat meals, and emergency food assistance',
    lat: 42.3515,
    lng: -82.9861,
  },
  {
    name: 'Food Bank of Eastern Michigan',
    type: 'Regional partner',
    color: 'bg-amber-600',
    address: '2309 N. Saginaw St, Flint, MI',
    available: 'Food distribution and emergency pantry access',
    website: 'https://fbem.org/',
    openHours: 'Mon–Fri · 8:30 AM–4:30 PM',
    support: 'Pantry distribution, fresh produce, and emergency food access',
    lat: 43.0171,
    lng: -83.6938,
  },
  {
    name: 'Detroit Rescue Mission Ministries',
    type: 'Shelter and pantry',
    color: 'bg-emerald-600',
    address: '1300 Martin Luther King Jr Blvd, Detroit, MI',
    available: 'Meal support, pantry access, and emergency resources',
    website: 'https://www.detroitrescuemission.org/',
    openHours: 'Daily · 8:00 AM–6:00 PM',
    support: 'Shelter support, meal programs, and pantry access',
    lat: 42.3338,
    lng: -83.0564,
  },
  {
    name: 'Feeding America West Michigan',
    type: 'Regional food network',
    color: 'bg-sky-600',
    address: '1250 28th St SW, Grand Rapids, MI',
    available: 'Fresh food distribution and neighborhood support',
    website: 'https://feedingwestmichigan.org/',
    openHours: 'Mon–Fri · 9:00 AM–5:00 PM',
    support: 'Food donations, produce programs, and distribution partner support',
    lat: 42.9556,
    lng: -85.6681,
  },
  {
    name: 'COTS of Grand Rapids',
    type: 'Community pantry',
    color: 'bg-amber-600',
    address: '1045 28th St SE, Grand Rapids, MI',
    available: 'Meal and pantry resources for families',
    website: 'https://www.cots.org/',
    openHours: 'Mon–Fri · 9:00 AM–4:00 PM',
    support: 'Case management, pantry support, and household essentials',
    lat: 42.9548,
    lng: -85.6346,
  },
  {
    name: 'Berkley Food Pantry',
    type: 'Neighborhood pantry',
    color: 'bg-emerald-600',
    address: '1457 W 12 Mile Rd, Berkley, MI',
    available: 'Groceries and household support for nearby families',
    website: 'https://www.berkleyfoodpantry.org/',
    openHours: 'Thu · 9:00 AM–2:00 PM',
    support: 'Household groceries and pantry staples for nearby families',
    lat: 42.5025,
    lng: -83.2014,
  },
  {
    name: 'Food Gatherers',
    type: 'Food bank',
    color: 'bg-sky-600',
    address: '1 Carrot Way, Ann Arbor, MI',
    available: 'Fresh produce, pantry goods, and community meal support',
    website: 'https://www.foodgatherers.org/',
    openHours: 'Mon–Fri · 8:30 AM–5:00 PM',
    support: 'Fresh produce, groceries, and emergency household food support',
    lat: 42.2796,
    lng: -83.7322,
  },
  {
    name: 'Kalamazoo Loaves & Fishes',
    type: 'Meal support',
    color: 'bg-emerald-600',
    address: '621 W. Main St, Kalamazoo, MI',
    available: 'Meals, groceries, and emergency food distribution',
    website: 'https://www.kzoofishes.org/',
    openHours: 'Mon–Fri · 9:00 AM–4:00 PM',
    support: 'Meals, groceries, and emergency food relief for households',
    lat: 42.2915,
    lng: -85.5881,
  },
  {
    name: 'Salvation Army Detroit Harbor Light',
    type: 'Shelter and pantry',
    color: 'bg-amber-600',
    address: '1300 W. Fort St, Detroit, MI',
    available: 'Meal programs and pantry support',
    website: 'https://salvationarmyusa.org/',
    openHours: 'Daily · 9:00 AM–6:00 PM',
    support: 'Meal support, pantry resources, and housing assistance',
    lat: 42.3232,
    lng: -83.1079,
  },
  {
    name: 'Community Action Agency of South Central Michigan',
    type: 'Regional partner',
    color: 'bg-sky-600',
    address: '101 N. Broadway St, Jackson, MI',
    available: 'Food assistance and community support',
    website: 'https://caascm.org/',
    openHours: 'Mon–Fri · 8:00 AM–5:00 PM',
    support: 'Family food assistance and neighborhood support programs',
    lat: 42.2459,
    lng: -84.4013,
  },
  {
    name: 'Lansing City Market',
    type: 'Food access hub',
    color: 'bg-emerald-600',
    address: '325 E. Michigan Ave, Lansing, MI',
    available: 'Fresh produce and local food assistance',
    website: 'https://www.lansingcitymarket.org/',
    openHours: 'Sat · 8:00 AM–2:00 PM',
    support: 'Local produce, pantry support, and community food access',
    lat: 42.7343,
    lng: -84.5326,
  },
  {
    name: 'Battle Creek Food Pantry',
    type: 'Food pantry',
    color: 'bg-amber-600',
    address: '2100 W. Michigan Ave, Battle Creek, MI',
    available: 'Emergency food and pantry support',
    website: 'https://www.battlecreekmi.gov/',
    openHours: 'Tue–Thu · 10:00 AM–3:00 PM',
    support: 'Emergency grocery boxes and household pantry support',
    lat: 42.3197,
    lng: -85.2026,
  },
  {
    name: 'Catholic Charities of Southeast Michigan',
    type: 'Community support',
    color: 'bg-sky-600',
    address: '29225 Northwestern Hwy, Southfield, MI',
    available: 'Food support and family relief services',
    website: 'https://www.ccsem.org/',
    openHours: 'Mon–Fri · 8:30 AM–4:30 PM',
    support: 'Food support, crisis assistance, and family emergency help',
    lat: 42.4758,
    lng: -83.2757,
  },
  {
    name: 'Muskegon Food Pantry',
    type: 'Food pantry',
    color: 'bg-emerald-600',
    address: '2191 Marquette Ave, Muskegon, MI',
    available: 'Groceries and pantry essentials',
    website: 'https://www.muskegonfoodpantry.org/',
    openHours: 'Tue–Thu · 9:00 AM–4:00 PM',
    support: 'Groceries, pantry basics, and community food support',
    lat: 43.2344,
    lng: -86.2461,
  },
];

function getDistanceMiles(marker: Marker, reference: Coordinates) {
  const latFrom = marker.lat ?? defaultLocation.lat;
  const lngFrom = marker.lng ?? defaultLocation.lng;

  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;

  const dLat = toRadians(reference.lat - latFrom);
  const dLng = toRadians(reference.lng - lngFrom);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(latFrom)) * Math.cos(toRadians(reference.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
}

function formatDistance(distance: number) {
  return `${distance.toFixed(1)} mi away`;
}

export default function MapPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState<number>(10);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [locationMode, setLocationMode] = useState<'prompt' | 'current' | 'zip'>('prompt');
  const [locationMessage, setLocationMessage] = useState('Choose whether to use your current location or a ZIP code.');
  const [zipError, setZipError] = useState('');
  const [favoritePlaces, setFavoritePlaces] = useState<Array<{ name: string; address: string; url: string }>>([]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setFavoritePlaces(JSON.parse(window.localStorage.getItem('mittenmeals-favorites') || '[]'));
  }, []);

  const handleUseCurrentLocation = () => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setLocationMode('zip');
      setLocationMessage('Your browser does not support location services. Please use a ZIP code instead.');
      return;
    }

    setLocationMode('current');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserCoords({ lat: coords.latitude, lng: coords.longitude });
        setZipError('');
        setLocationMessage('Using your current location to find nearby support.');
      },
      () => {
        setUserCoords(null);
        setLocationMode('zip');
        setLocationMessage('We could not access your location. Please enter a ZIP code to view nearby food options.');
      },
    );
  };

  const handleZipSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const normalizedZip = zipCode.trim();
    if (!normalizedZip) {
      setZipError('Please enter a ZIP code.');
      return;
    }

    if (!/^\d{5}$/.test(normalizedZip)) {
      setZipError('Please use a valid 5-digit ZIP code.');
      return;
    }

    setZipError('');
    setLocationMode('zip');
    setUserCoords(null);
    setLocationMessage(`Showing nearby support within ${radius} miles of ${normalizedZip}.`);
  };

  const referenceLocation = useMemo(() => {
    if (locationMode === 'current' && userCoords) {
      return userCoords;
    }

    if (zipCode.trim()) {
      const normalizedZip = zipCode.trim().slice(0, 5);
      return zipCoordinates[normalizedZip] ?? defaultLocation;
    }

    return defaultLocation;
  }, [locationMode, userCoords, zipCode]);

  const filteredMarkers = useMemo<MarkerResult[]>(() => {
    const query = search.trim().toLowerCase();

    let results = staticMarkers;

    if (query) {
      results = staticMarkers.filter((marker) => marker.name.toLowerCase().includes(query));
    }

    return [...results]
      .map((marker) => ({
        ...marker,
        distanceMiles: getDistanceMiles(marker, referenceLocation),
      }))
      .filter((marker) => marker.distanceMiles <= radius)
      .sort((a, b) => a.distanceMiles - b.distanceMiles);
  }, [radius, referenceLocation, search]);

  const safeIndex = selectedIndex >= filteredMarkers.length ? 0 : selectedIndex;
  const selectedMarker = filteredMarkers[safeIndex] ?? filteredMarkers[0] ?? { ...staticMarkers[0], distanceMiles: 0 };
  const mapQuery = useMemo(
    () => encodeURIComponent(`${selectedMarker.name} ${selectedMarker.address}`),
    [selectedMarker],
  );

  const handleToggleFavorite = (marker: Marker) => {
    if (typeof window === 'undefined') {
      return;
    }

    const targetUrl = marker.website || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(marker.address)}`;
    const entry = { name: marker.name, address: marker.address, url: targetUrl };
    const nextFavorites = favoritePlaces.some((item) => item.name === marker.name && item.address === marker.address)
      ? favoritePlaces.filter((item) => !(item.name === marker.name && item.address === marker.address))
      : [entry, ...favoritePlaces];

    setFavoritePlaces(nextFavorites);
    window.localStorage.setItem('mittenmeals-favorites', JSON.stringify(nextFavorites));
  };

  return (
    <SiteShell title="Food map" intro="Find nearby food banks, community kitchens, and pantry partners with a map that stays easy to browse and easy to trust.">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[1.5rem] border border-emerald-100 bg-white/90 p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Location preference</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Find food near you</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${locationMode === 'current' ? 'bg-emerald-600 text-white' : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
              >
                Use my current location
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocationMode('zip');
                  setUserCoords(null);
                  setZipError('');
                  setLocationMessage('Please enter a ZIP code and choose a radius to find nearby support.');
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${locationMode === 'zip' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
              >
                Use ZIP code
              </button>
            </div>

            <form onSubmit={handleZipSubmit} className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
              <div>
                <label htmlFor="zip-search" className="mb-2 block text-sm font-semibold text-slate-700">
                  ZIP code
                </label>
                <input
                  id="zip-search"
                  value={zipCode}
                  onChange={(event) => {
                    setZipCode(event.target.value);
                    setLocationMode('zip');
                    setZipError('');
                    setLocationMessage('Showing nearby support based on your ZIP code.');
                  }}
                  placeholder="e.g. 48207"
                  className="w-full rounded-2xl border border-emerald-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label htmlFor="radius-filter" className="mb-2 block text-sm font-semibold text-slate-700">
                  Radius
                </label>
                <select
                  id="radius-filter"
                  value={radius}
                  onChange={(event) => setRadius(Number(event.target.value))}
                  className="w-full rounded-2xl border border-emerald-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                >
                  {[5, 10, 15, 20, 30, 40, 50].map((option) => (
                    <option key={option} value={option}>{option} miles</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Enter
                </button>
              </div>
            </form>

            {zipError ? <p className="text-sm text-red-600">{zipError}</p> : null}
          </div>

          {locationMessage ? (
            <p className="mt-3 text-sm text-emerald-700">{locationMessage}</p>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-emerald-100 bg-white/90 p-6 shadow-sm">
            <div className="relative h-[420px] overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-slate-100">
              <iframe
                title="Mitten Meals map"
                src={`https://www.google.com/maps?q=${mapQuery}&z=12&output=embed`}
                className="h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute left-6 top-6 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
                Nearby spots
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-100 bg-white/90 p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3 px-2 pt-2">
              <h3 className="text-lg font-semibold text-slate-950">Nearby options</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {filteredMarkers.length} found
              </span>
            </div>

            <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
              {filteredMarkers.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-emerald-200 bg-emerald-50/70 p-5 text-sm text-emerald-800">
                  No matches yet. Try a different ZIP code, wider radius, or a nearby food keyword.
                </div>
              ) : null}

              {filteredMarkers.map((marker, index) => {
                const isSelected = safeIndex === index;
                const markerWebsite = marker.website || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(marker.address)}`;

                return (
                  <div
                    key={`${marker.name}-${marker.address}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedIndex(index)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedIndex(index);
                      }
                    }}
                    className={`w-full rounded-[1.5rem] border p-5 text-left shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-200'
                        : 'border-emerald-100 bg-white/90'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-3.5 w-3.5 rounded-full ${marker.color}`} />
                      <div>
                        <span className="block font-semibold text-slate-900">{marker.name}</span>
                        <p className="text-sm text-slate-600">{marker.type}</p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                      <p className="font-medium text-slate-900">{marker.available}</p>
                      <p className="mt-2 text-slate-600">{marker.support}</p>
                      <p className="mt-2 text-emerald-700">Open: {marker.openHours}</p>
                      <p className="mt-2 text-slate-600">Distance: {formatDistance(marker.distanceMiles)}</p>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-slate-700">{marker.address}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={markerWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Website
                      </a>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleToggleFavorite(marker);
                        }}
                        className="inline-flex rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-200"
                      >
                        {favoritePlaces.some((item) => item.name === marker.name && item.address === marker.address) ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
