import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { SITE_URL } from '@/config/site'
import { profile, seo, socials } from '@/data/profile'
import './globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  // Only the weights the styles use (all of them appear on the first screen except 700)
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

// Link previews and search: the absolute base comes from config/site.ts (NEXT_PUBLIC_SITE_URL overrides it)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: '/',
    siteName: profile.name,
    title: seo.title,
    description: seo.description,
    firstName: profile.givenName,
    lastName: profile.familyName,
    username: socials.find((social) => social.key === 'github')?.handle,
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  robots: { index: true, follow: true },
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
// - decides whether the intro plays: once per session, never when the URL targets a section (always with
//   ?globe-debug, which stops the dive over the beach and measures the landing); while it plays, the page's
//   animations are paused (data-paused)
// - flags phones / low-end devices (data-lite) for a lighter intro and fewer animals, and (once the first
//   paint is on screen, so they never compete with the page's own CSS, fonts and code) starts fetching the
//   globe's main maps
const bootScript = `(function(){var d=document.documentElement,t='light';try{var s=localStorage.getItem('theme');t=s==='dark'||s==='light'?s:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){}d.setAttribute('data-theme',t);d.style.colorScheme=t;d.classList.add('js');var i='play';try{if(sessionStorage.getItem('intro-played'))i='skip'}catch(e){}if(location.hash&&location.hash!=='#hero')i='skip';if(/[?&]globe-debug/.test(location.search))i='play';d.setAttribute('data-intro',i);if(i==='play')d.setAttribute('data-paused','');var n=navigator,c=n.connection,l=(n.hardwareConcurrency||8)<=4||(n.deviceMemory||8)<=4||!!(c&&c.saveData)||matchMedia('(pointer: coarse)').matches||Math.min(innerWidth,innerHeight)<600;d.setAttribute('data-lite',l?'1':'0');if(i==='play'){var g=function(){var f=[l?'globe-color-1024':'globe-color-2048','globe-coast-1024','globe-lights-512'];for(var k=0;k<f.length;k++){var p=document.createElement('link');p.rel='preload';p.as='fetch';p.crossOrigin='anonymous';p.href='/intro/'+f[k]+'.webp';document.head.appendChild(p)}},P=window.PerformanceObserver;if(P&&P.supportedEntryTypes&&P.supportedEntryTypes.indexOf('paint')>=0)new P(function(x,o){o.disconnect();g()}).observe({type:'paint',buffered:true});else requestAnimationFrame(function(){setTimeout(g,0)})}})()`

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
