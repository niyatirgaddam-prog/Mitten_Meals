'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteShell from '../components/SiteShell';
import FoodSupportChat from '../components/FoodSupportChat';
import {
  DonationItem,
  NeedItem,
  calculateDonationPoints,
  getCurrentUser,
  getDonorLevel,
  getStoredUsers,
  signOutUser,
  updateUserProfile,
  type UserProfile,
} from '../lib/auth';
import { getDonorLeaderboard } from '../lib/leaderboard';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [needForm, setNeedForm] = useState({ title: '', quantity: '', notes: '' });
  const [donationForm, setDonationForm] = useState({ title: '', category: 'Produce', quantity: '', estimatedPounds: '', quality: 'Good', address: '', notes: '' });
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [favoritePlaces, setFavoritePlaces] = useState<{ name: string; address: string; url: string }[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady && !user) {
      router.replace('/login');
    }
  }, [isReady, router, user]);

  const profileName = user?.name ?? 'Guest';
  const isSeeker = user?.role === 'seeker';
  const isDonorFlow = user?.role === 'business' || user?.role === 'family';
  const donorPoints = user?.donorPoints ?? 0;
  const donorLevel = getDonorLevel(donorPoints);
  const leaderboardSummary = useMemo(() => {
    if (!isReady) {
      return { topThree: [], currentUserPlacementLabel: '', isTopThree: false };
    }

    return getDonorLeaderboard(getStoredUsers(), user?.id);
  }, [isReady, user?.id]);
  const leaderboard = leaderboardSummary.topThree;
  const userRankLabel = leaderboardSummary.currentUserPlacementLabel;
  const isUserInTopThree = leaderboardSummary.isTopThree;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const saved = JSON.parse(window.localStorage.getItem('mittenmeals-favorites') || '[]') as Array<{ name: string; address: string; url: string }>;
    setFavoritePlaces(saved);
  }, [user?.id]);

  const roleLabel = useMemo(() => {
    switch (user?.role) {
      case 'organization':
        return 'Food Bank / Organization';
      case 'family':
        return 'Family / Individual';
      case 'seeker':
        return 'Food Seeker';
      default:
        return 'Community member';
    }
  }, [user?.role]);

  const seekerRecommendations = [
    {
      name: 'Gleaners Community Food Bank',
      type: 'Local food bank',
      url: 'https://www.gleaners.org/',
      description: 'Fresh produce, pantry staples, and emergency food support for families in southeast Michigan.',
    },
    {
      name: 'Food Gatherers',
      type: 'Regional partner',
      url: 'https://www.foodgatherers.org/',
      description: 'Food access programs, pantry support, and neighborhood meal assistance in the Ann Arbor area.',
    },
    {
      name: 'Feeding America West Michigan',
      type: 'Regional food network',
      url: 'https://feedingwestmichigan.org/',
      description: 'Resources and partner food programs for households and local organizations across West Michigan.',
    },
    {
      name: '211 Michigan',
      type: 'Help hotline',
      url: 'https://www.211.org/',
      description: 'Call or search for food, utility, rent, and family support help near you.',
    },
    {
      name: 'Michigan Department of Health & Human Services',
      type: 'Public support portal',
      url: 'https://www.michigan.gov/mdhhs/',
      description: 'Benefits, services, and local program information for households needing extra support.',
    },
    {
      name: 'Capuchin Soup Kitchen',
      type: 'Meal assistance',
      url: 'https://www.capuchinsoupkitchen.org/',
      description: 'Hot meals and emergency food support for neighbors facing food insecurity in Detroit.',
    },
  ];

  if (!isReady || !user) {
    return null;
  }

  const addNeed = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!needForm.title || isSeeker) {
      return;
    }

    const nextNeed: NeedItem = {
      id: `need-${Date.now()}`,
      title: needForm.title,
      quantity: needForm.quantity,
      notes: needForm.notes,
      createdAt: new Date().toISOString(),
    };

    const nextUser = { ...user, needs: [nextNeed, ...user.needs] };
    updateUserProfile(nextUser);
    setUser(nextUser);
    setNeedForm({ title: '', quantity: '', notes: '' });
  };

  const addDonation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!donationForm.title || !donationForm.address || !isDonorFlow) {
      return;
    }

    const pointsAwarded = calculateDonationPoints({
      title: donationForm.title,
      quantity: donationForm.quantity,
      category: donationForm.category,
      quality: donationForm.quality,
      estimatedPounds: donationForm.estimatedPounds,
    });

    const nextDonation: DonationItem = {
      id: `don-${Date.now()}`,
      title: donationForm.title,
      quantity: donationForm.quantity,
      notes: donationForm.notes,
      category: donationForm.category,
      quality: donationForm.quality,
      estimatedPounds: donationForm.estimatedPounds,
      donorPointsAwarded: pointsAwarded,
      address: donationForm.address,
      createdAt: new Date().toISOString(),
    };

    const nextDonorPoints = (user.donorPoints ?? 0) + pointsAwarded;
    const nextUser = {
      ...user,
      donorPoints: nextDonorPoints,
      donorLevel: getDonorLevel(nextDonorPoints).name,
      donations: [nextDonation, ...user.donations],
    };

    updateUserProfile(nextUser);
    setUser(nextUser);
    setDonationForm({ title: '', category: 'Produce', quantity: '', estimatedPounds: '', quality: 'Good', address: '', notes: '' });
    setShowDonationForm(false);
  };

  return (
    <SiteShell title="Your dashboard" intro={isSeeker ? 'Find the best local food support for your household and browse nearby community partners.' : 'Your account is set up to connect extra food with trusted nearby organizations and community partners.'}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-blue-50 p-6 shadow-[0_20px_70px_-25px_rgba(10,77,155,0.28)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Your profile</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">Welcome back, {profileName}</h1>
              <p className="mt-2 text-lg text-slate-700">{roleLabel} • {user.organization || 'Community partner'}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/map" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-blue-700">
                View map
              </Link>
              <button
                type="button"
                onClick={() => {
                  signOutUser();
                  router.replace('/');
                }}
                className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-sky-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Account overview</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-2 font-semibold text-slate-900">{user.email}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm text-slate-500">Role</p>
                <p className="mt-2 font-semibold text-slate-900">{roleLabel}</p>
              </div>
              {!isSeeker ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:col-span-2">
                  <p className="text-sm text-slate-500">Donations saved</p>
                  <p className="mt-2 font-semibold text-slate-900">{user.donations.length}</p>
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[2rem] border border-sky-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">What you can do</h2>
            <p className="mt-2 text-slate-700">{isSeeker ? 'Use your profile to find the best nearby pantry, food bank, or community partner for your household.' : 'Connect with a trusted food bank near you so your extra food can be dropped off safely and efficiently.'}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
              <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1">📍 Nearby partners</span>
              <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1">📦 Easy drop-off</span>
              <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1">🌟 Clear next steps</span>
            </div>

            {isSeeker ? (
              <div className="mt-5 rounded-[1.4rem] border border-sky-200 bg-sky-50/80 p-4">
                <p className="font-semibold text-sky-800">Quick access</p>
                <p className="mt-2 text-sm text-sky-700">Open the map to find nearby food banks, community pantries, and meal support near you.</p>
                <Link href="/map" className="mt-4 inline-flex rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800">
                  Open food map
                </Link>
              </div>
            ) : (
              <div className="mt-5 rounded-[1.4rem] border border-sky-200 bg-sky-50/80 p-4">
                <p className="font-semibold text-sky-800">Trusted donation partners</p>
                <p className="mt-2 text-sm text-sky-700">Post a donation and we can match it with the nearest best-fit community partner.</p>
                <button
                  type="button"
                  onClick={() => setShowDonationForm((current) => !current)}
                  className="mt-4 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  {showDonationForm ? 'Close form' : 'New donation'}
                </button>
              </div>
            )}
          </section>
        </div>

        {isSeeker ? (
          <>
            <section className="rounded-[2rem] border border-sky-100 bg-white/90 p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">Favorites</h2>
              <div className="mt-5 space-y-3">
                {favoritePlaces.length === 0 ? (
                  <p className="text-sm text-slate-600">No favorites yet. Save places from the map to keep them here for easy access.</p>
                ) : (
                  favoritePlaces.map((place) => (
                    <a
                      key={`${place.name}-${place.address}`}
                      href={place.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-[1.2rem] border border-slate-200 bg-slate-50/80 p-4 transition hover:border-sky-300 hover:bg-sky-50/80"
                    >
                      <p className="font-semibold text-slate-900">{place.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{place.address}</p>
                    </a>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-sky-100 bg-white/90 p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">Recommendations</h2>
              {user.seekerProfile?.dietaryNeeds ? (
                <p className="mt-2 text-sm text-slate-600">
                  Recommendations can take your dietary needs into account: <span className="font-semibold text-slate-800">{user.seekerProfile.dietaryNeeds}</span>. Contact providers to confirm current options.
                </p>
              ) : null}
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {seekerRecommendations.map((resource) => (
                  <a
                    key={resource.name}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 text-left transition hover:border-sky-300 hover:bg-sky-50/80"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-700">{resource.type}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{resource.name}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{resource.description}</p>
                    <span className="mt-3 inline-flex text-sm font-semibold text-blue-700 underline-offset-2 hover:underline">Visit website</span>
                  </a>
                ))}
              </div>
            </section>
            <FoodSupportChat profile={user.seekerProfile} />
          </>
        ) : null}

        {isDonorFlow ? (
          <>
            {showDonationForm ? (
              <section className="rounded-[2rem] border border-sky-100 bg-white/90 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-950">Add a new donation</h2>
                <form onSubmit={addDonation} className="mt-5 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={donationForm.title}
                      onChange={(event) => setDonationForm({ ...donationForm, title: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm outline-none"
                      placeholder="Food item or donation type"
                      required
                    />
                    <select
                      value={donationForm.category}
                      onChange={(event) => setDonationForm({ ...donationForm, category: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm outline-none"
                    >
                      <option value="Produce">Produce</option>
                      <option value="Pantry">Pantry</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Meals">Meals</option>
                      <option value="Bakery">Bakery</option>
                    </select>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      value={donationForm.quantity}
                      onChange={(event) => setDonationForm({ ...donationForm, quantity: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm outline-none"
                      placeholder="Quantity"
                    />
                    <input
                      value={donationForm.estimatedPounds}
                      onChange={(event) => setDonationForm({ ...donationForm, estimatedPounds: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm outline-none"
                      placeholder="Estimated lbs"
                    />
                    <select
                      value={donationForm.quality}
                      onChange={(event) => setDonationForm({ ...donationForm, quality: event.target.value })}
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm outline-none"
                    >
                      <option value="Good">Good</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>
                  <input
                    value={donationForm.address}
                    onChange={(event) => setDonationForm({ ...donationForm, address: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm outline-none"
                    placeholder="Pickup address or drop-off location"
                    required
                  />
                  <textarea
                    value={donationForm.notes}
                    onChange={(event) => setDonationForm({ ...donationForm, notes: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm outline-none"
                    placeholder="Notes about the food, freshness, or storage needs"
                    rows={3}
                  />
                  <button type="submit" className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800">
                    Save donation
                  </button>
                </form>
              </section>
            ) : null}

            <section className="rounded-[2rem] border border-sky-100 bg-white/90 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-slate-950">Your donor status</h2>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                  {donorLevel.name}
                </span>
              </div>

              <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                  <span>{donorPoints} points</span>
                  <span>{Math.round(donorLevel.progress)}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-600" style={{ width: `${donorLevel.progress}%` }} />
                </div>
                <p className="mt-3 text-sm text-slate-600">Next level: {donorLevel.nextLevel}</p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-sky-100 bg-white/90 p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">Top donor leaderboard</h2>
              <div className="mt-5 space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between rounded-[1.25rem] border p-3 ${entry.id === user?.id ? 'border-emerald-300 bg-emerald-50/80' : 'border-slate-200 bg-slate-50/80'}`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">#{index + 1} {entry.name}</p>
                      <p className="text-xs text-slate-500">{entry.donorLevel ?? 'Starter'}</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">{entry.donorPoints ?? 0} pts</span>
                  </div>
                ))}
              </div>

              {!isUserInTopThree && userRankLabel ? (
                <div className="mt-4 rounded-[1.2rem] border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">
                  {userRankLabel}
                </div>
              ) : null}
            </section>

          </>
        ) : null}

        {isSeeker ? null : (
          <section className="rounded-[2rem] border border-sky-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Your donations</h2>
            <div className="mt-4 space-y-3">
              {user.donations.length === 0 ? (
                <p className="text-sm text-slate-600">No donations yet.</p>
              ) : (
                user.donations.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.quantity || 'Quantity not set'} • {item.address || 'Address not listed'}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.notes || 'No notes yet'}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      {item.donorPointsAwarded ?? 0} pts awarded
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

      </div>
    </SiteShell>
  );
}
