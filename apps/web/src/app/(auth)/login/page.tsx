import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your BetTracker account and access your betting analytics dashboard.',
  robots: { index: true, follow: true },
}

interface LoginPageProps {
  searchParams: { callbackUrl?: string }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <LoginForm callbackUrl={searchParams.callbackUrl} />
    </div>
  )
}
