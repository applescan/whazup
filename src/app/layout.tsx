import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WHAZUP NZ - Discover Your Perfect Events',
  description: 'Swipe your way to amazing events in New Zealand. Discover concerts, festivals, theatre, sports and more with our personalized event matching app powered by Eventfinda.',
  keywords: [
    'events New Zealand',
    'concerts NZ',
    'festivals',
    'theatre',
    'sports events',
    'exhibitions',
    'workshops',
    'event discovery',
    'Eventfinda',
    'Auckland events',
    'Wellington events',
    'Christchurch events'
  ],
  authors: [{ name: 'Felicia Fel', url: 'https://felicia-portfolio.netlify.app/' }],
  creator: 'Felicia Fel',
  publisher: 'Felicia Fel',

  openGraph: {
    type: 'website',
    locale: 'en_NZ',
    url: 'https://whazup.vercel.app/',
    siteName: 'WHAZUP NZ',
    title: 'WHAZUP NZ - Discover Your Perfect Events',
    description: 'Swipe your way to amazing events in New Zealand. Find concerts, festivals, theatre and more with personalized recommendations.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WHAZUP NZ - Event Discovery App',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'WHAZUP NZ - Discover Your Perfect Events',
    description: 'Swipe to find amazing events in New Zealand. Personalized event discovery made simple.',
    images: ['/whazup.png'],
    creator: '@applescan',
  },

  icons: {
    icon: [
      { url: '/favicon.png' },
    ],
  },

  manifest: '/site.webmanifest',

  applicationName: 'WHAZUP NZ',
  referrer: 'origin-when-cross-origin',
  category: 'entertainment',
  classification: 'Events & Entertainment',

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

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-NZ">
      <head>
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={ inter.className }>{ children }</body>
    </html>
  )
}

