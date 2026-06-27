import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth'

export const metadata: Metadata = {
  title: 'Sign in — BetTracker',
}

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1.5 text-sm text-slate-500">Sign in to your BetTracker account</p>
      </div>
      <LoginForm />
    </div>
  )
}
