import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth'

export const metadata: Metadata = {
  title: 'Sign in — BetTracker',
}

interface LoginPageProps {
  searchParams: { callbackUrl?: string }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1.5 text-sm text-slate-500">Sign in to your BetTracker account</p>
      </div>
      <LoginForm callbackUrl={searchParams.callbackUrl} />
    </div>
  )
}
