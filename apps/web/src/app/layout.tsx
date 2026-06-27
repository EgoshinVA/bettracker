import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BetTracker — Professional Analytics',
  description: 'Professional-grade analytics for serious sports bettors.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
