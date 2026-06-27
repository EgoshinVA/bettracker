import type { Metadata } from 'next'
import { AppShell } from '@/widgets/app-shell/ui/AppShell'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
