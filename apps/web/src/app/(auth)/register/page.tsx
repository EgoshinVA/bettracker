import type { Metadata } from 'next'
import { RegisterForm } from '@/features/auth'

export const metadata: Metadata = {
  title: 'Create Free Account',
  description:
    'Join BetTracker and start tracking your sports bets professionally. Free forever — no credit card required.',
  robots: { index: true, follow: true },
}

export default function RegisterPage() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Start tracking your bets professionally — free forever.
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
