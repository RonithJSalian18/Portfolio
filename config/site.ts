// Site-wide configuration. Content (bio, projects, skills...) lives in data/profile.ts.

/**
 * Where the intro globe lands: a beach on the Karnataka coast near Udupi (WGS84 degrees).
 * The globe, its texture mapping and the camera all derive from this one constant.
 */
export const BEACH = { lat: 13.101766, lng: 74.769385 } as const

/** Canonical address of the deployed site, used for link previews and structured data */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ronith.vercel.app'

/** The résumé download. TODO: add the file as public/resume.pdf */
export const RESUME_PATH = '/resume.pdf'
