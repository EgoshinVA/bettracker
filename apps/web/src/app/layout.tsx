import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/shared/ui/providers/SessionProvider'
import { ReduxProvider } from '@/shared/ui/providers/ReduxProvider'
import { AppToaster } from '@/shared/ui/Toaster'

export const metadata: Metadata = {
  title: 'BetTracker — Professional Analytics',
  description: 'Professional-grade analytics for serious sports bettors.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </SessionProvider>
        <AppToaster />
      </body>
    </html>
  )
}
