import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BetTracker — Professional Sports Betting Analytics',
  description:
    'Track every bet, analyze ROI, win rate, and profit by sport, league, and bookmaker. Professional analytics software for serious sports bettors. Free to start.',
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
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BetTracker',
  applicationCategory: 'SportsApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available. Pro plan at $19/month.',
  },
  description:
    'Professional sports betting analytics platform. Track ROI, win rate, and profit by sport, league, and bookmaker.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '1240',
  },
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
