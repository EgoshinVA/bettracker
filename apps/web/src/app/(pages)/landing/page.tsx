'use client'

import { useRouter } from 'next/navigation'
import { BarChart2, TrendingUp, Zap, Globe, Smartphone, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Real-time ROI',
    body: 'Every bet tracked instantly. Watch your performance metrics evolve as games conclude with zero manual entry.',
    tags: ['100% Accuracy', 'Zero Latency'],
    dark: false,
  },
  {
    icon: Globe,
    title: 'Bookmaker Insights',
    body: 'Compare margins and track your performance across 40+ global sportsbooks.',
    tags: ['FanDuel', 'DraftKings', 'Bet365'],
    dark: true,
  },
  {
    icon: BarChart2,
    title: 'Performance Analytics',
    body: 'Drill down into sports, leagues, and even specific bet types to find your edge.',
    dark: true,
  },
  {
    icon: Zap,
    title: 'Automated Sync',
    body: 'Connect your accounts once. Never manually log a bet again.',
    dark: false,
  },
  {
    icon: Smartphone,
    title: 'Always with you',
    body: 'Native iOS and Android apps for tracking on the go.',
    dark: false,
  },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
            <BarChart2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-slate-900">BetTracker</span>
        </div>
        <div className="flex items-center gap-8">
          {['Features', 'Analytics', 'Pricing'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {item}
            </a>
          ))}
        </div>
        <button
          onClick={() => router.push('/login')}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
        >
          Start tracking free
        </button>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-8 py-24">
        <div className="grid grid-cols-2 items-center gap-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
              <span className="text-xs font-semibold text-violet-700">
                Real-time Bookmaker Integration is Live
              </span>
            </div>
            <h1 className="text-5xl font-extrabold leading-tight text-slate-900">
              Elevate Your{' '}
              <span className="text-violet-600">Betting Strategy</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-500">
              Professional-grade analytics for serious sports bettors. Transform your fragmented data
              into actionable insights with our automated tracking suite.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => router.push('/login')}
                className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
              >
                Start tracking free
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                View Demo <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['#7c3aed', '#8b5cf6', '#a78bfa'].map((c, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-500">
                Joined by <span className="font-semibold text-slate-900">12,000+</span> serious bettors
              </p>
            </div>
          </div>

          {/* Hero card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl shadow-slate-200/60">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400">BetTracker Terminal v4.2.9</p>
              <div className="flex gap-1.5">
                {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                  <div key={c} className="h-3 w-3 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Net Profit</p>
                <p className="text-2xl font-bold text-violet-600">+$14,284.50</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">ROI</p>
                <p className="text-2xl font-bold text-green-500">+12.4%</p>
              </div>
            </div>
            <div className="flex h-28 items-end gap-1.5">
              {[40, 55, 45, 65, 75, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md transition-all"
                  style={{ height: `${h}%`, backgroundColor: i === 5 ? '#7c3aed' : '#ede9fe' }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-300">
              {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-8 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Analytics for Every Move</h2>
          <p className="mt-3 text-slate-500">
            Precision engineering for your betting bankroll. We provide the tools usually reserved
            for quantitative hedge funds.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, body, tags, dark }) => (
            <div
              key={title}
              className={`rounded-xl p-6 ${
                dark ? 'bg-slate-900 text-white' : 'border border-slate-100 bg-white text-slate-900'
              }`}
            >
              <div className={`mb-3 inline-flex rounded-lg p-2.5 ${dark ? 'bg-white/10' : 'bg-violet-50'}`}>
                <Icon className={`h-5 w-5 ${dark ? 'text-violet-400' : 'text-violet-600'}`} />
              </div>
              <h3 className="mb-2 text-base font-bold">{title}</h3>
              <p className={`text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                {body}
              </p>
              {tags && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        dark ? 'bg-white/10 text-slate-300' : 'bg-violet-50 text-violet-700'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-8 py-16 text-center">
        <h2 className="text-4xl font-extrabold text-slate-900">Stop Guessing. Start Winning.</h2>
        <p className="mx-auto mt-4 max-w-lg text-slate-500">
          The top 5% of bettors use data to drive their decisions. Join the community and get the
          clarity your bankroll deserves.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => router.push('/login')}
            className="rounded-lg bg-violet-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
          >
            Create Free Account
          </button>
          <button className="rounded-lg border border-slate-200 px-8 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
            Talk to Sales
          </button>
        </div>
        <p className="mt-6 text-sm italic text-slate-400">
          &ldquo;BetTracker changed how I view my losses. I finally found the leak in my MLB
          strategy.&rdquo; — Professional Bettor
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-8 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid grid-cols-5 gap-8">
            <div className="col-span-1">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600">
                  <BarChart2 className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-900">BetTracker</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                The analytical terminal for modern sports bettors. Precision, speed, and clarity for
                every wager.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Integrations', 'API Access', 'Pricing'] },
              { title: 'Resources', links: ['Help Center', 'Betting Guide', 'ROI Calculator'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-900">
                  {title}
                </p>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-slate-400 transition-colors hover:text-slate-700"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-6">
            <p className="text-center text-xs text-slate-400">
              © 2024 BetTracker Inc. All rights reserved. Gamble responsibly.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
