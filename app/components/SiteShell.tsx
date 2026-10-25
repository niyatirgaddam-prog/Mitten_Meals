'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import MittenLogo from './MittenLogo';
import { getCurrentUser, type UserProfile } from '../lib/auth';

interface SiteShellProps {
  children: React.ReactNode;
  title?: string;
  intro?: string;
}

export default function SiteShell({ children, title, intro }: SiteShellProps) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const navItems = user
    ? [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Map', href: '/map' },
        { label: 'Dashboard', href: '/dashboard' },
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(95,181,233,0.18),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(10,77,155,0.12),_transparent_30%),linear-gradient(180deg,_#f9fcff_0%,_#f3f9ff_100%)] text-slate-800">
      <header className="sticky top-0 z-30 border-b border-[#dfeeff] bg-[#f8fbff]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
            <MittenLogo compact className="h-14 w-14 shrink-0" />
            <div>
              <div className="text-xl font-black tracking-[-0.06em] text-[#0a4d9b]">Mitten Meals</div>
              <div className="text-[9px] font-bold uppercase tracking-[0.28em] text-slate-500">
                Nourishing Michigan communities
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-[#0a4d9b]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link href="/login" className="rounded-full border border-[#cde6ff] bg-white px-4 py-2.5 text-sm font-semibold text-[#0a4d9b] transition hover:border-[#8ecaf2] hover:bg-[#f2fbff]">
                  Log in
                </Link>
                <Link href="/signup" className="rounded-full bg-[#0a4d9b] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(10,77,155,0.65)] transition hover:bg-[#0b2d5f]">
                  Sign up
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main>
        {(title || intro) && (
          <section className="border-b border-[#dfeeff] bg-[linear-gradient(180deg,_rgba(224,243,255,0.42),_rgba(255,255,255,0.96))]">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              {title ? <h1 className="text-3xl font-black tracking-[-0.05em] text-[#102b4a] sm:text-5xl">{title}</h1> : null}
              {intro ? <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">{intro}</p> : null}
            </div>
          </section>
        )}
        {children}
      </main>
    </div>
  );
}
