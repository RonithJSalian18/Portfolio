import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { profile } from '@/lib/content'

export const alt = `${profile.name}, ${profile.role}: a portfolio styled as a walk along a beach`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Rendered once at build time. Poppins TTFs live in assets/fonts (OFL licensed) because the
// image renderer can't use next/font.
export default async function OpenGraphImage() {
  const [extraBold, semiBold] = await Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/Poppins-ExtraBold.ttf')),
    readFile(join(process.cwd(), 'assets/fonts/Poppins-SemiBold.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          fontFamily: 'Poppins',
          color: '#0b2540',
          background: 'linear-gradient(180deg, #3a98d4 0%, #86c9ec 40%, #dff1f8 64%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 130,
            top: 80,
            width: 150,
            height: 150,
            borderRadius: 150,
            background: '#ffd166',
            boxShadow: '0 0 90px 36px rgba(255, 190, 80, 0.55)',
          }}
        />
        <svg width="1200" height="260" viewBox="0 0 1200 260" style={{ position: 'absolute', left: 0, bottom: 0 }}>
          <path d="M0 40C100 10 200 10 300 40S500 70 600 40 800 10 900 40 1100 70 1200 40V260H0z" fill="#17a2b5" />
          <path d="M0 95C120 65 240 65 360 95S600 125 720 95 960 65 1080 95 1200 110 1200 110V260H0z" fill="#2fbcbe" />
          <path d="M0 140C150 112 300 112 450 140S750 168 900 140 1200 125 1200 125V260H0z" fill="#6fd9cf" />
          <path d="M0 140C150 112 300 112 450 140S750 168 900 140 1200 125 1200 125" fill="none" stroke="#ffffff" strokeWidth="6" />
          <path d="M0 196C200 172 400 172 600 196S1000 220 1200 196V260H0z" fill="#f2e4c6" />
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '96px 90px 0' }}>
          <div style={{ fontSize: 34, fontWeight: 600 }}>Hi, I&apos;m</div>
          <div style={{ fontSize: 104, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{profile.name}</div>
          <div style={{ marginTop: 18, fontSize: 44, fontWeight: 600 }}>{profile.role}</div>
          <div style={{ marginTop: 8, fontSize: 28, fontWeight: 600, color: '#33475d' }}>{profile.tagline}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Poppins', data: extraBold, weight: 800, style: 'normal' },
        { name: 'Poppins', data: semiBold, weight: 600, style: 'normal' },
      ],
    },
  )
}
