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

// Runs before first paint:
// - picks the saved theme (or the system one) so the page never flashes the wrong palette
// - decides whether the intro plays: once per session, never when the URL targets a section
// - flags phones / low-end devices for the lighter intro and starts fetching the right Earth texture
const bootScript = `(function(){var d=document.documentElement,t='light';try{var s=localStorage.getItem('theme');t=s==='dark'||s==='light'?s:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){}d.setAttribute('data-theme',t);d.style.colorScheme=t;d.classList.add('js');var i='play';try{if(sessionStorage.getItem('intro-played'))i='skip'}catch(e){}if(location.hash&&location.hash!=='#hero')i='skip';d.setAttribute('data-intro',i);if(i==='play'){var n=navigator,c=n.connection,l=(n.hardwareConcurrency||8)<=4||(n.deviceMemory||8)<=4||!!(c&&c.saveData)||matchMedia('(pointer: coarse)').matches||Math.min(innerWidth,innerHeight)<600;d.setAttribute('data-intro-lite',l?'1':'0');var p=document.createElement('link');p.rel='preload';p.as='image';p.type='image/webp';p.href=l?'/intro/earth-1024.webp':'/intro/earth-2048.webp';document.head.appendChild(p)}})()`

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
        {/* Shown only while the intro chunk loads (see styles/intro.css), so the site never flashes first */}
        <div className="intro-cover" aria-hidden="true" />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
