'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DonationItem, NeedItem, getCurrentUser, updateUserProfile } from '../lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(getCurrentUser());
  const [donationForm, setDonationForm] = useState({ title: '', quantity: '', notes: '' });
  const [needForm, setNeedForm] = useState({ title: '', quantity: '', notes: '' });

  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/');
    }
  }, []);

  const profileName = user?.name ?? 'Guest';
  const roleLabel = useMemo(() => {
    switch (user?.role) {
      case 'organization':
        return 'Food Bank / Organization';
      case 'family':
        return 'Family / Individual';
      default:
        return 'Business';
    }
  }, [user?.role]);

  if (!user) {
    return null;
  }

  const addDonation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!donationForm.title) {
      return;
    }

    const nextDonation: DonationItem = {
      id: `don-${Date.now()}`,
      title: donationForm.title,
      quantity: donationForm.quantity,
      notes: donationForm.notes,
      createdAt: new Date().toISOString(),
    };

    const nextUser = { ...user, donations: [nextDonation, ...user.donations] };
    updateUserProfile(nextUser);
    setUser(nextUser);
    setDonationForm({ title: '', quantity: '', notes: '' });
  };

  const addNeed = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!needForm.title) {
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

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f8fff9_0%,_#f7fbff_100%)] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[2rem] border border-emerald-100 bg-white/90 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Your profile</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">Welcome back, {profileName}</h1>
              <p className="mt-2 text-lg text-slate-700">{roleLabel} • {user.organization || 'Community partner'}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
                Back to home
              </a>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('harvestlink-current-user');
                  router.replace('/');
                }}
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-emerald-100 bg-white/90 p-6 shadow-sm">
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
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm text-slate-500">Donations listed</p>
                <p className="mt-2 font-semibold text-slate-900">{user.donations.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm text-slate-500">Needs posted</p>
                <p className="mt-2 font-semibold text-slate-900">{user.needs.length}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-emerald-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">What you’re sharing</h2>
            <p className="mt-2 text-slate-700">Add donations or requests so the app can start looking like a real community hub.</p>

            <form onSubmit={addDonation} className="mt-5 rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4">
              <h3 className="font-semibold text-slate-900">Add a donation</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  value={donationForm.title}
                  onChange={(event) => setDonationForm({ ...donationForm, title: event.target.value })}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="Food item"
                  required
                />
                <input
                  value={donationForm.quantity}
                  onChange={(event) => setDonationForm({ ...donationForm, quantity: event.target.value })}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="Quantity"
                />
              </div>
              <textarea
                value={donationForm.notes}
                onChange={(event) => setDonationForm({ ...donationForm, notes: event.target.value })}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                placeholder="Notes"
                rows={3}
              />
              <button type="submit" className="mt-3 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                Save donation
              </button>
            </form>

            <form onSubmit={addNeed} className="mt-4 rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4">
              <h3 className="font-semibold text-slate-900">Add a need</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  value={needForm.title}
                  onChange={(event) => setNeedForm({ ...needForm, title: event.target.value })}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="Need"
                  required
                />
                <input
                  value={needForm.quantity}
                  onChange={(event) => setNeedForm({ ...needForm, quantity: event.target.value })}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="Quantity"
                />
              </div>
              <textarea
                value={needForm.notes}
                onChange={(event) => setNeedForm({ ...needForm, notes: event.target.value })}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                placeholder="Notes"
                rows={3}
              />
              <button type="submit" className="mt-3 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
                Save need
              </button>
            </form>
          </section>
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-emerald-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Your donations</h2>
            <div className="mt-4 space-y-3">
              {user.donations.length === 0 ? (
                <p className="text-sm text-slate-600">No donations yet.</p>
              ) : (
                user.donations.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.quantity || 'Quantity not set'} • {item.notes || 'No notes yet'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Your needs</h2>
            <div className="mt-4 space-y-3">
              {user.needs.length === 0 ? (
                <p className="text-sm text-slate-600">No needs yet.</p>
              ) : (
                user.needs.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.quantity || 'Quantity not set'} • {item.notes || 'No notes yet'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
