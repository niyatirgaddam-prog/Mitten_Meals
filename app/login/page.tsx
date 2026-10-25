'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import SiteShell from '../components/SiteShell';
import { signInUser } from '../lib/auth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const justSignedUp = searchParams.get('signup') === 'success';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = signInUser(form.email, form.password);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <SiteShell title="Log in" intro="Welcome back. Sign in with your email and password.">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-sky-100 bg-white/90 p-8 shadow-sm">
          {justSignedUp ? (
            <div className="mb-5 rounded-[1.2rem] border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              Your account is ready. Log in to continue to your dashboard.
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              type="email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm outline-none"
              placeholder="Email address"
              required
            />
            <input
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              type="password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm outline-none"
              placeholder="Password"
              required
            />
            <button type="submit" className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800">
              Log in
            </button>
            {message ? <p className="text-sm text-blue-700">{message}</p> : null}
            <p className="text-sm text-slate-600">
              Don&apos;t have an account? <Link href="/signup" className="font-semibold text-blue-700 hover:text-blue-800">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </SiteShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<SiteShell title="Log in" intro="Loading your sign-in page."><div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8" /></SiteShell>}>
      <LoginContent />
    </Suspense>
  );
}
