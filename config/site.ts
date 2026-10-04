// Site-wide configuration. Content (bio, projects, skills, the résumé link...) lives in data/profile.ts.

/**
 * Where the intro globe lands: a beach on India's southwest coast (WGS84 degrees).
 * The globe, its texture mapping and the camera all derive from this one constant.
 */
export const BEACH = { lat: 13.101766, lng: 74.769385 } as const

/** Canonical address of the deployed site, used for link previews and structured data */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ronith.vercel.app'
