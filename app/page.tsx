'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { siteContent } from './data/siteContent';
import { signInUser, signUpUser } from './lib/auth';

export default function Home() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState('business');
  const [selectedFilter, setSelectedFilter] = useState('Today');
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
  });
  const [submittedMessage, setSubmittedMessage] = useState('');

  const selectedRole = useMemo(() => {
    return siteContent.accountTypes.find((role) => role.id === activeRole) ?? siteContent.accountTypes[0];
  }, [activeRole]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === 'signup') {
      const result = signUpUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: activeRole as 'business' | 'organization' | 'family',
        organization: form.organization,
      });

      if (!result.ok) {
        setSubmittedMessage(result.message);
        return;
      }

      setSubmittedMessage(`Welcome, ${result.user.name}! Your account is ready.`);
      router.push('/dashboard');
      return;
    }

    const result = signInUser(form.email, form.password);
    if (!result.ok) {
      setSubmittedMessage(result.message);
      return;
    }

    setSubmittedMessage(`Welcome back, ${result.user.name}!`);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_30%),linear-gradient(135deg,_#f8fff9_0%,_#f7fbff_100%)] text-slate-800">
      <header className="sticky top-0 z-50 border-b border-emerald-100/80 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-bold text-white shadow-lg shadow-emerald-600/20">
              H
            </span>
            HarvestLink
          </a>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 lg:flex">
            {siteContent.navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-emerald-700">
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 sm:inline-flex">
              Login
            </a>
            <a href="#auth" className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700">
              Sign Up
            </a>
          </div>
        </nav>
      </header>

      <main id="home">
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />AI-powered food rescue platform
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Rescue Food. Fight Hunger. Strengthen Communities.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-700 sm:text-xl">
                Connecting surplus food from businesses to food banks, shelters, volunteers, and families through intelligent technology.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#donate-food" className="inline-flex rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-xl shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700">
                  Donate Food
                </a>
                <a href="#find-food" className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700">
                  Find Food
                </a>
                <a href="#auth" className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-6 py-3 font-semibold text-orange-700 transition hover:-translate-y-0.5 hover:border-orange-300">
                  Create an account
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium text-slate-700">
                <span className="rounded-full bg-white/70 px-3 py-2 shadow-sm">Realtime matching</span>
                <span className="rounded-full bg-white/70 px-3 py-2 shadow-sm">Trusted logistics</span>
                <span className="rounded-full bg-white/70 px-3 py-2 shadow-sm">Accessible for all</span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-emerald-100 bg-white/80 p-3 shadow-[0_30px_80px_-20px_rgba(16,185,129,0.35)] backdrop-blur-xl">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
                  alt="Volunteers distributing fresh food donations"
                  className="h-[480px] w-full rounded-[1.5rem] object-cover"
                />
                <div className="absolute bottom-8 left-8 rounded-full bg-slate-950/80 px-4 py-2 text-sm font-medium text-white">
                  Live rescue • 312 pickups today
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {siteContent.stats.map((item, index) => (
                <div key={item.label} className="rounded-[1.4rem] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1">
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">{item.value}</p>
                  <p className="mt-2 text-sm text-emerald-700">{item.detail}</p>
                  {index < 4 ? <div className="mt-4 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-400" /> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="auth" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-emerald-100 bg-white/85 p-8 shadow-[0_25px_70px_-30px_rgba(15,23,42,0.2)] backdrop-blur xl:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">User authentication</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
                  Choose the role that fits your mission.
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-700">
                  HarvestLink is designed for businesses, organizations, and families with simple, role-based access that can grow into a full account system later.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {siteContent.accountTypes.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setActiveRole(role.id)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${activeRole === role.id ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700'}`}
                  >
                    <p className="font-semibold">{role.title}</p>
                    <p className="mt-1 text-sm">{role.blurb}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50/70 p-6">
                <p className="text-sm font-semibold text-emerald-700">Selected account</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">{selectedRole.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-700">{selectedRole.blurb}</p>
                <ul className="mt-5 space-y-3">
                  {selectedRole.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-3 text-sm text-slate-700">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Create account
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="rounded-full border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Sign in
                  </button>
                </div>
              </div>

              <div className="rounded-[1.6rem] bg-slate-950 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Simple onboarding</p>
                <h3 className="mt-3 text-2xl font-semibold">Local account setup that is easy to upgrade later</h3>
                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-sm text-slate-300">Name and email</p>
                    <p className="mt-2 font-semibold">Collect a real contact for future outreach</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-sm text-slate-300">Role-based profile</p>
                    <p className="mt-2 font-semibold">Business, organization, or family dashboards tailored to each journey</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-sm text-slate-300">Future-ready</p>
                    <p className="mt-2 font-semibold">Swap this for a real auth provider whenever you are ready</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
                      placeholder="Your name"
                      required={mode === 'signup'}
                    />
                    <input
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      type="email"
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
                      placeholder="Email address"
                      required
                    />
                  </div>
                  <input
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    type="password"
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
                    placeholder={mode === 'signup' ? 'Create a password' : 'Password'}
                    required
                  />
                  <input
                    value={form.organization}
                    onChange={(event) => setForm({ ...form, organization: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
                    placeholder="Organization or neighborhood"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="submit" className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
                      {mode === 'signup' ? 'Create account' : 'Sign in'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                      className="text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
                    >
                      {mode === 'signup' ? 'Already have an account?' : 'Need an account?'}
                    </button>
                  </div>
                  {submittedMessage ? <p className="text-sm text-emerald-300">{submittedMessage}</p> : null}
                </form>
              </div>
            </div>
          </div>
        </section>

        <section id="donate-food" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-emerald-100 bg-white/85 p-8 shadow-sm backdrop-blur xl:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Donate food</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Create a donation in minutes.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                Businesses can enter their surplus food details, schedule pickup windows, and instantaneously receive a match recommendation.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {siteContent.donationFields.map((field) => (
                  <div key={field} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-sm font-medium text-slate-600">{field}</p>
                    <div className="mt-3 h-2 rounded-full bg-slate-200" />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#contact" className="rounded-full bg-orange-500 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-600">
                  Submit donation
                </a>
                <a href="#impact-dashboard" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
                  Review impact
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-emerald-100 bg-white/90 p-8 shadow-sm backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">AI matching score</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">Trusted recommendations for every rescue.</h3>
                <div className="mt-6 space-y-4">
                  {siteContent.matchCards.map((card) => (
                    <div key={card.title} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{card.title}</p>
                          <p className="text-sm text-slate-600">{card.priority}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold text-emerald-700">{card.score}%</p>
                          <p className="text-sm text-slate-500">compatibility</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                        <span className="rounded-full bg-white px-3 py-1">{card.time} pickup</span>
                        <span className="rounded-full bg-white px-3 py-1">{card.meals} meals</span>
                        <span className="rounded-full bg-white px-3 py-1">{card.carbon} carbon saved</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-sky-100 bg-sky-50/80 p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Why this is recommended</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                  <li>• Distance and traffic conditions were weighted for ideal pickup timing.</li>
                  <li>• Refrigeration capacity and storage compatibility were validated.</li>
                  <li>• Urgency, food category, and volunteer availability were balanced in real time.</li>
                  <li>• The selected organization can absorb the donation without spoilage risk.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="find-food" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-emerald-100 bg-white/85 p-8 shadow-sm backdrop-blur xl:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Interactive map</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Find food resources near you in seconds.</h2>
                <p className="mt-4 text-lg leading-8 text-slate-700">
                  Explore pantries, shelters, community fridges, donation routes, and live pickups with filters for time, food type, and access needs.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {siteContent.mapFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedFilter(filter)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedFilter === filter ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(135deg,_#f4fff8_0%,_#f6fbff_100%)] p-6">
                <div className="relative h-[420px] overflow-hidden rounded-[1.4rem] border border-emerald-100 bg-gradient-to-br from-emerald-100 via-white to-sky-100">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.95),_transparent_18%),radial-gradient(circle_at_80%_30%,_rgba(255,255,255,0.75),_transparent_20%),radial-gradient(circle_at_60%_80%,_rgba(255,255,255,0.8),_transparent_20%)]" />
                  <div className="absolute left-[12%] top-[20%] h-4 w-4 rounded-full bg-emerald-600 shadow-lg shadow-emerald-600/30" />
                  <div className="absolute right-[18%] top-[30%] h-4 w-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/30" />
                  <div className="absolute left-[22%] top-[65%] h-4 w-4 rounded-full bg-sky-600 shadow-lg shadow-sky-600/30" />
                  <div className="absolute right-[25%] top-[70%] h-4 w-4 rounded-full bg-violet-500 shadow-lg shadow-violet-500/30" />
                  <div className="absolute left-[45%] top-[45%] h-20 w-20 rounded-full border-2 border-dashed border-emerald-300" />
                  <div className="absolute bottom-6 left-6 rounded-2xl bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
                    {selectedFilter} view • 26 live opportunities
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  ['Businesses', 'Fresh produce and prepared meals', 'bg-emerald-600'],
                  ['Food banks', 'Shelf-stable staples and freezer stock', 'bg-sky-600'],
                  ['Community fridges', 'Open now for walk-up access', 'bg-orange-500'],
                  ['Families', 'Pickup windows and pantry access', 'bg-violet-500'],
                ].map(([label, detail, color]) => (
                  <div key={label} className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4">
                    <div className="flex items-center gap-3">
                      <span className={`h-3.5 w-3.5 rounded-full ${color}`} />
                      <p className="font-semibold text-slate-900">{label}</p>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="organizations" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-sm backdrop-blur xl:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Organizations</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Built for food banks, shelters, and community kitchens.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                Operations teams can accept donations, reject low-fit items, request volunteers, and update inventory in one calm, transparent workflow.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {['Nearby donations', 'Pending matches', 'Accepted deliveries', 'Urgent requests'].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm font-medium text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-sm xl:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Organization workflow</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">A calmer workflow for accepting and distributing donations.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Organizations can review incoming offers, confirm pickups, and track what has been distributed without adding unnecessary complexity.
              </p>
              <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Open requests</p>
                    <p className="mt-2 text-3xl font-semibold">1,218</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Meals distributed</p>
                    <p className="mt-2 text-3xl font-semibold">18,450</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="impact-dashboard" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-emerald-100 bg-white/85 p-8 shadow-sm backdrop-blur xl:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Impact dashboard</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Professional analytics you can trust.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                Track meals rescued, food waste reduced, carbon emissions prevented, and volunteer hours with interactive charts built for leaders and donors.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  ['Meals rescued', '1.2M'],
                  ['CO₂ prevented', '4.9K t'],
                  ['Volunteer hours', '42K'],
                  ['Communities served', '128'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-sm backdrop-blur xl:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Top donating businesses</p>
              <div className="mt-6 space-y-4">
                {[
                  ['Fresh Market', '92% donation efficiency'],
                  ['Sunrise Cafe', '86% route compliance'],
                  ['Northfield University', '81% community participation'],
                  ['Riverstone Farms', '79% seasonal recovery'],
                ].map(([name, detail]) => (
                  <div key={name} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{name}</p>
                        <p className="text-sm text-slate-600">{detail}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">+12%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Community stories</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Real impact, from businesses and families to nonprofits and community partners.</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {siteContent.stories.map((story) => (
              <div key={story.title} className="rounded-[1.6rem] border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
                  alt="Community food rescue story"
                  className="h-40 w-full rounded-[1.2rem] object-cover"
                />
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{story.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-700">“{story.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-emerald-700">{story.author}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="resources" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-emerald-100 bg-white/85 p-8 shadow-sm backdrop-blur xl:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Educational resources</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Learn how technology helps rescue more food and feed more people.</h2>
              </div>
              <a href="#contact" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
                Explore more
              </a>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {siteContent.resourceThemes.map((theme) => (
                <div key={theme} className="rounded-[1.3rem] border border-slate-200 bg-slate-50/70 p-5">
                  <p className="font-semibold text-slate-900">{theme}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">Actionable guides, policy context, and practical tips for reducing food waste and supporting neighbors.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_25px_70px_-30px_rgba(15,23,42,0.7)] xl:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Ready to get involved?</p>
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Partner with HarvestLink to rescue food and strengthen your community.</h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                  From donation scheduling to volunteer coordination, the platform helps every stakeholder act with speed, dignity, and measurable impact.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6">
                <p className="text-sm text-slate-300">Contact</p>
                <p className="mt-2 text-xl font-semibold">hello@harvestlink.org</p>
                <p className="mt-2 text-sm text-slate-300">+1 (800) 555-0198</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#auth" className="rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700">
                    Get started
                  </a>
                  <a href="#resources" className="rounded-full border border-white/20 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10">
                    View resources
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/70 px-4 py-10 text-sm text-slate-600 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-semibold text-slate-900">HarvestLink</p>
            <p className="mt-2 max-w-xl leading-7">Mission-driven technology for rescuing surplus food and redirecting it toward people and communities in need.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="#about" className="transition hover:text-emerald-700">About</a>
            <a href="#resources" className="transition hover:text-emerald-700">Resources</a>
            <a href="#contact" className="transition hover:text-emerald-700">Contact</a>
            <a href="#auth" className="transition hover:text-emerald-700">Sign Up</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
