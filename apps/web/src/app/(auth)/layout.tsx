import type { ReactNode } from 'react'
import { TrendingUp, BarChart3, ShieldCheck } from 'lucide-react'

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Real-time ROI tracking',
    description: 'Monitor return on investment across every bet, league, and bookmaker.',
  },
  {
    icon: BarChart3,
    title: 'Advanced analytics',
    description: 'Deep performance insights broken down by sport, time, and bet type.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & private',
    description: 'Your data is encrypted end-to-end and never sold to third parties.',
  },
]

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left branding panel (desktop only) ── */}
      <aside className="hidden lg:flex lg:w-[440px] xl:w-[520px] flex-col justify-between bg-gradient-to-br from-violet-600 via-violet-700 to-violet-900 p-12 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">BetTracker</span>
        </div>

        {/* Headline + feature list */}
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl font-bold leading-tight text-white">
              Make smarter bets with data-driven decisions
            </h2>
            <p className="mt-3 text-base text-violet-200">
              Professional-grade analytics trusted by thousands of serious bettors worldwide.
            </p>
          </div>

          <ul className="space-y-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="h-5 w-5 text-violet-200" />
                </div>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-sm text-violet-300">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <figure className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <blockquote className="text-sm italic text-violet-200">
            &ldquo;BetTracker completely changed how I approach sports betting. My ROI improved 34%
            in the first three months.&rdquo;
          </blockquote>
          <figcaption className="mt-3 text-xs text-violet-400">— James K., Professional bettor</figcaption>
        </figure>
      </aside>

      {/* ── Right form panel ── */}
      <main className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">BetTracker</span>
        </div>

        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
