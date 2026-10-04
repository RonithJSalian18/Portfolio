/** Messages between the page (EarthIntro.tsx) and the globe worker (intro.worker.ts) */

export interface IntroOptions {
  lite: boolean
  night: boolean
  reduceMotion: boolean
  /** ?globe-debug: stop above the beach, mark it, and report where it lands on screen */
  debug: boolean
  target: { lat: number; lng: number }
  /** Viewport in CSS pixels */
  width: number
  height: number
  devicePixelRatio: number
}

/** Where the beach lands on screen at the end of the dive, in CSS pixels (see globe.measureLanding) */
export interface LandingReport {
  target: { lat: number; lng: number }
  viewport: { width: number; height: number }
  center: { x: number; y: number }
  projected: { x: number; y: number }
  drawn: { x: number; y: number } | null
  coastKm: number | null
  markerPixels: number
}

/** Page → worker */
export type IntroCommand =
  | { type: 'start'; canvas: OffscreenCanvas; options: IntroOptions }
  | { type: 'maps'; maps: ImageBitmap[] }
  | { type: 'local-maps'; maps: ImageBitmap[] }
  | { type: 'maps-failed' }
  | { type: 'local-maps-failed' }
  /** Clicking, scrolling or a key starts the dive early */
  | { type: 'dive' }
  | { type: 'resize'; width: number; height: number }
  | { type: 'dispose' }

/** Worker → page */
export type IntroEvent =
  /** The first frame is on screen */
  | { type: 'ready' }
  /** The dive has started */
  | { type: 'dive' }
  /** The cloud the camera flies into, as a CSS opacity */
  | { type: 'fog'; opacity: string }
  /** The dive is over: the page parts the clouds */
  | { type: 'reveal' }
  | { type: 'debug'; report: LandingReport }
  /** No WebGL 2 (or only a software one), the maps didn't load, or the GPU dropped the context */
  | { type: 'failed' }
