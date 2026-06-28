import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/shared/ui/providers/SessionProvider'
import { ReduxProvider } from '@/shared/ui/providers/ReduxProvider'
import { I18nProvider } from '@/shared/ui/providers/I18nProvider'
import { AppToaster } from '@/shared/ui/Toaster'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'BetTracker — Professional Sports Betting Analytics',
    template: '%s | BetTracker',
  },
  description:
    'Track every bet, analyze ROI, win rate, and profit by sport, league, and bookmaker. BetTracker is professional analytics software for serious sports bettors. Free to start.',
  keywords: [
    'sports betting tracker',
    'bet tracker',
    'betting analytics',
    'sports betting ROI',
    'betting performance tracker',
    'bankroll management sports betting',
    'sports betting software',
    'betting journal app',
    'track sports bets',
    'sports betting statistics',
    'betting profit tracker',
    'sports betting analysis',
    'bet tracking app',
    'sports wagering tracker',
  ],
  authors: [{ name: 'BetTracker' }],
  creator: 'BetTracker',
  publisher: 'BetTracker',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'BetTracker',
    title: 'BetTracker — Professional Sports Betting Analytics',
    description:
      'Track every bet, analyze ROI and profit by sport, league, and bookmaker. Built for serious bettors.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BetTracker — Sports Betting Analytics Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BetTracker — Professional Sports Betting Analytics',
    description:
      'Track every bet, analyze ROI and profit by sport, league, and bookmaker. Built for serious bettors.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ReduxProvider>
            <I18nProvider>{children}</I18nProvider>
          </ReduxProvider>
        </SessionProvider>
        <AppToaster />
      </body>
    </html>
  )
}
