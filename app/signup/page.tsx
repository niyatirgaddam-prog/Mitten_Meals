'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteShell from '../components/SiteShell';
import { signUpUser } from '../lib/auth';

const roleOptions = [
  {
    id: 'business',
    title: 'Community member',
    description: 'Individuals, families, and local businesses can connect with nearby food support or trusted partners.',
  },
  {
    id: 'organization',
    title: 'Food bank or partner',
    description: 'Pantries, shelters, community kitchens, and nonprofits can coordinate community support.',
  },
  {
    id: 'family',
    title: 'Family or neighborhood group',
    description: 'Neighbors who want to share extra groceries, produce, or pantry items can help keep food moving.',
  },
  {
    id: 'seeker',
    title: 'Looking for food',
    description: 'Families and individuals who want nearby food options can be matched with the best local support.',
  },
] as const;

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<'business' | 'organization' | 'family' | 'seeker'>('business');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [seekerProfile, setSeekerProfile] = useState({
    householdSize: '',
    dietaryNeeds: '',
    accessibilityNeeds: '',
    notes: '',
  });
  const [message, setMessage] = useState('');

  const selectedRole = useMemo(() => roleOptions.find((option) => option.id === role) ?? roleOptions[0], [role]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (role === 'seeker') {
      const hasRequiredSeekerInfo = seekerProfile.householdSize && seekerProfile.dietaryNeeds;
      if (!hasRequiredSeekerInfo) {
        setMessage('Please answer the matching questions so we can suggest the best nearby partners.');
        return;
      }
    }

    const result = signUpUser({
      name: form.name,
      email: form.email,
      password: form.password,
      role,
      organization: role === 'organization' ? 'Community partner' : 'Local community member',
      seekerProfile: role === 'seeker' ? seekerProfile : undefined,
    });

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    router.push('/login?signup=success');
  };

  return (
    <SiteShell title="Create an account" intro="Choose the role that fits your work or your food needs, then add a few details so the experience feels personal and useful.">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-sky-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Pick your role</h2>
            <div className="mt-5 space-y-3">
              {roleOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setRole(option.id as 'business' | 'organization' | 'family' | 'seeker')}
                  className={`w-full rounded-[1.3rem] border p-4 text-left transition ${role === option.id ? 'border-blue-700 bg-blue-50 text-blue-800 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300'}`}
                >
                  <p className="font-semibold">{option.title}</p>
                  <p className="mt-1 text-sm leading-7">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-200 bg-[#0b2d5f] p-6 text-white shadow-sm">
            <h2 className="text-2xl font-semibold">Account details</h2>
            <p className="mt-3 text-sm leading-8 text-slate-300">{selectedRole.description}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                placeholder="Your full name"
                required
              />
              <input
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                type="email"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                placeholder="Email address"
                required
              />
              <input
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                type="password"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                placeholder="Create a password"
                required
              />
              {role === 'seeker' ? (
                <div className="mt-4 space-y-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">Help us match you with the right food support</p>
                  <input
                    value={seekerProfile.householdSize}
                    onChange={(event) => setSeekerProfile({ ...seekerProfile, householdSize: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                    placeholder="Household size"
                    required
                  />
                  <input
                    value={seekerProfile.dietaryNeeds}
                    onChange={(event) => setSeekerProfile({ ...seekerProfile, dietaryNeeds: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                    placeholder="Dietary needs or preferred foods"
                    required
                  />
                  <input
                    value={seekerProfile.accessibilityNeeds}
                    onChange={(event) => setSeekerProfile({ ...seekerProfile, accessibilityNeeds: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                    placeholder="Accessibility needs"
                  />
                  <textarea
                    value={seekerProfile.notes}
                    onChange={(event) => setSeekerProfile({ ...seekerProfile, notes: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                    placeholder="Anything else we should know?"
                    rows={3}
                  />
                </div>
              ) : null}

              <button type="submit" className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                Create account
              </button>
              {message ? <p className="text-sm text-sky-300">{message}</p> : null}
            </form>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
