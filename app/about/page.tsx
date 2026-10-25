import SiteShell from '../components/SiteShell';

export default function AboutPage() {
  return (
    <SiteShell title="About Mitten Meals" intro="We are building a practical, community-focused platform that helps food reach the people who need it most.">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-[#dfeeff] bg-[linear-gradient(135deg,_#f8fbff_0%,_#edf8ff_30%,_#fefaf2_100%)] p-8 shadow-[0_22px_55px_-40px_rgba(10,77,155,0.35)]">
            <h2 className="text-2xl font-black tracking-[-0.05em] text-[#102b4a]">Our mission</h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              Mitten Meals exists to make surplus food more visible, easier to share, and more accessible to nearby families and organizations. We want to reduce waste while strengthening local support networks across Michigan.
            </p>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              The platform will grow over time as real donors, food banks, and families add their information and needs. Right now, the site is designed to be simple, clear, and ready for that future data.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-600">
              <span className="rounded-full border border-[#d7edff] bg-white/80 px-3 py-1.5">🌱 Less waste</span>
              <span className="rounded-full border border-[#d7edff] bg-white/80 px-3 py-1.5">🤝 Stronger neighborhoods</span>
              <span className="rounded-full border border-[#d7edff] bg-white/80 px-3 py-1.5">🍲 Better access</span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#0a4d9b]/10 bg-[linear-gradient(135deg,_#0a3d7a_0%,_#0e5ca8_100%)] p-8 text-white shadow-[0_22px_55px_-35px_rgba(10,77,155,0.8)]">
            <h2 className="text-2xl font-black tracking-[-0.05em]">What we hope to achieve</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-200">
              <li>• Reduce food waste by connecting surplus food to people who can use it.</li>
              <li>• Make local food access easier to find and understand.</li>
              <li>• Create a trusted system that can support communities as it grows.</li>
              <li>• Give partners a calm, professional place to share what they can offer or need.</li>
            </ul>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
