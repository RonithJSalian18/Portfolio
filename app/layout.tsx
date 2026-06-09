import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Ronith | Computer Science Student & Full Stack Developer',
  description: 'Premium portfolio showcasing full-stack development projects, skills, and experiences. Built with Next.js, TypeScript, and cutting-edge technologies.',
  keywords: ['developer', 'full-stack', 'computer science', 'portfolio', 'react', 'next.js'],
  authors: [{ name: 'Ronith' }],
  creator: 'Ronith',
  publisher: 'Ronith',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ronith.dev',
    title: 'Ronith | Computer Science Student & Full Stack Developer',
    description: 'Premium portfolio showcasing full-stack development projects, skills, and experiences.',
    siteName: 'Ronith Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ronith | Computer Science Student & Full Stack Developer',
    description: 'Premium portfolio showcasing full-stack development projects, skills, and experiences.',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f0f1e',
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
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
