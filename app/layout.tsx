import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Orbitron } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['500', '700', '900'],
})

const title = 'Ronith J Salian | Full Stack & AI Developer'
const description =
  'A long time ago, in a galaxy far, far away... full-stack and AI projects, skills, and experience by Ronith J Salian.'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['developer', 'full-stack', 'ai', 'langgraph', 'rag', 'computer science', 'portfolio', 'react', 'next.js'],
  authors: [{ name: 'Ronith J Salian' }],
  creator: 'Ronith J Salian',
  publisher: 'Ronith J Salian',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ronith.dev',
    title,
    description,
    siteName: 'Ronith Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: '#03040b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
