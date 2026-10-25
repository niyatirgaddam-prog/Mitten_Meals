import Link from 'next/link';
import MittenLogo from './components/MittenLogo';
import SiteShell from './components/SiteShell';

export default function Home() {
  return (
    <SiteShell title="Sharing food with care and dignity." intro="Mitten Meals helps local food move from generous donors to people who need it, with a calm, friendly experience that feels practical from day one.">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2.5rem] border border-[#d9ebff] bg-[linear-gradient(135deg,_rgba(224,243,255,0.9),_rgba(255,255,255,0.98),_rgba(190,234,248,0.7))] p-6 shadow-[0_30px_90px_-40px_rgba(10,77,155,0.35)] sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-[#bfe7ff] bg-[#f2fbff] px-3 py-1.5 text-sm font-bold uppercase tracking-[0.18em] text-[#0a4d9b]">
                Fresh, local, and community-led
              </p>
              <h2 className="mt-5 max-w-xl text-4xl font-black tracking-[-0.06em] text-[#102b4a] sm:text-5xl lg:text-6xl">
                Food should be shared with care, not wasted.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
                Mitten Meals is designed to make food rescue feel simple, hopeful, and easy to trust. Donors can post surplus food, families can find nearby support, and local partners can coordinate with confidence.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/signup" className="rounded-full bg-[#0a4d9b] px-5 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_-12px_rgba(10,77,155,0.7)] transition hover:bg-[#0b2d5f]">
                  Create account
                </Link>
                <Link href="/login" className="rounded-full border border-[#b5d8ff] bg-white px-5 py-3 text-sm font-semibold text-[#0a4d9b] transition hover:border-[#7db9ec] hover:bg-[#f4fbff]">
                  Log in
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="rounded-full border border-[#d7edff] bg-white/80 px-3 py-1.5">🍎 Local produce</span>
                <span className="rounded-full border border-[#d7edff] bg-white/80 px-3 py-1.5">🌿 Trusted partners</span>
                <span className="rounded-full border border-[#d7edff] bg-white/80 px-3 py-1.5">🤝 Community care</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <MittenLogo className="w-full max-w-[560px] drop-shadow-[0_28px_55px_rgba(10,77,155,0.18)]" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-4">
          {[
            { title: 'For donors', text: 'Share extra food and keep it moving to people who need it.' },
            { title: 'For organizations', text: 'Coordinate pickups and see what is available nearby.' },
            { title: 'For families', text: 'Find reliable local food support and share what you can.' },
            { title: 'For food seekers', text: 'Search the map and discover nearby food options quickly.' },
          ].map((card) => (
            <div key={card.title} className="rounded-[1.8rem] border border-[#dfeeff] bg-white/90 p-6 shadow-[0_18px_50px_-35px_rgba(10,77,155,0.35)]">
              <h3 className="text-xl font-bold tracking-[-0.04em] text-[#102b4a]">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{card.text}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[2.2rem] border border-[#dfeeff] bg-white/95 p-8 shadow-[0_18px_60px_-35px_rgba(10,77,155,0.25)]">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-[#0a4d9b]">Why it matters</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[#102b4a] sm:text-4xl">
                More visibility means more food reaching people who need it.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-700">
                Good food should not disappear because it is hard to coordinate. This platform is built to make local food support easier to see, easier to trust, and easier to act on.
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-[#dfeeff] bg-[#f4fbff] p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-[#d9ebff] bg-white p-4">
                  <p className="text-3xl font-black tracking-[-0.05em] text-[#102b4a]">1.05B+</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">tonnes of food wasted globally each year</p>
                </div>
                <div className="rounded-[1.25rem] border border-[#d9ebff] bg-white p-4">
                  <p className="text-3xl font-black tracking-[-0.05em] text-[#102b4a]">673M</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">people facing hunger every day</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2.2rem] border border-[#0a4d9b]/15 bg-[linear-gradient(135deg,_#0a3d7a_0%,_#0e5ca8_100%)] p-8 text-white shadow-[0_20px_70px_-35px_rgba(10,77,155,0.9)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-[#bae7ff]">Ready to join</p>
              <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                Create an account and start building a stronger food support network in your community.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0a4d9b] transition hover:bg-[#edf9ff]">
                Sign up
              </Link>
              <Link href="/login" className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Log in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
