import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const title = 'Ronith J Salian | Full Stack Developer'
const description =
  'Ronith J Salian is a full stack developer and Computer Science student building efficient, scalable, and intelligent solutions, from multi-agent AI pipelines to full-stack web apps.'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['Ronith J Salian', 'full stack developer', 'portfolio', 'next.js', 'react', 'fastapi', 'ai', 'langgraph'],
  authors: [{ name: 'Ronith J Salian' }],
  creator: 'Ronith J Salian',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title,
    description,
    siteName: 'Ronith J Salian',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#86c9ec' },
    { media: '(prefers-color-scheme: dark)', color: '#020817' },
  ],
  width: 'device-width',
  initialScale: 1,
}

// Runs before first paint: picks the saved theme (or the system one) so the page never flashes the wrong palette.
const bootScript = `(function(){var d=document.documentElement,t='light';try{var s=localStorage.getItem('theme');t=s==='dark'||s==='light'?s:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){}d.setAttribute('data-theme',t);d.style.colorScheme=t;d.classList.add('js')})()`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
