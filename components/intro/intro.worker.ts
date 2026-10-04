/**
 * The globe intro's renderer and camera, in a worker. It draws on the page's canvas through an OffscreenCanvas,
 * so shader compiles, texture uploads and the GPU waits they cause never block the page (on a busy GPU a single
 * shader status check can stall for over 100 ms). The page (EarthIntro.tsx) handles input, the fog and the
 * cloud reveal.
 */
import { NORTH_AXIS, add, cross, dot, mix, normalize, rotateAbout, scale, slerp, type Vec3 } from './geo'
import { LANDING_CLOUD_TOP, createGlobe, type Globe, type Pose } from './globe'
import type { IntroCommand, IntroEvent, IntroOptions } from './messages'

const IDLE_MS = 1600
const DIVE_MS = 7000
/**
 * How long after the intro ends the worker frees its GPU memory and context: tearing a context down waits for
 * the GPU, which is busy for a moment drawing the newly uncovered site.
 */
const RELEASE_DELAY_MS = 1500

/** Dive stages (share of DIVE_MS): turn and zoom in, hover over the beach, then plunge into the cloud */
const APPROACH_END = 0.7
const HOVER_END = 0.84
const FOG_FROM = 0.86
/** Camera height above the surface while hovering (Earth radii) */
const HOVER_FROM = 0.15
const HOVER_TO = 0.13
/** The plunge stops just above the landing cloud, which by then fills the screen */
const PLUNGE_TO = LANDING_CLOUD_TOP + 0.01

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const smoothstep = (from: number, to: number, t: number) => {
  const x = clamp01((t - from) / (to - from))
  return x * x * (3 - 2 * x)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Altitude over the dive: an even-feeling zoom (log scale), a short hover, then an accelerating plunge */
function altitude(progress: number, start: number) {
  if (progress < APPROACH_END) {
    const t = easeInOutCubic(progress / APPROACH_END)
    return Math.exp(lerp(Math.log(start), Math.log(HOVER_FROM), t))
  }
  if (progress < HOVER_END) return lerp(HOVER_FROM, HOVER_TO, easeInOutCubic((progress - APPROACH_END) / (HOVER_END - APPROACH_END)))
  const t = (progress - HOVER_END) / (1 - HOVER_END)
  return lerp(HOVER_TO, PLUNGE_TO, t * t * t)
}

/** Unit vector pointing north along the surface at `point` */
const northAt = (point: Vec3) => normalize(add(NORTH_AXIS, scale(point, -dot(NORTH_AXIS, point))))

/** A promise settled later, by a message from the page */
function later<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((onResolve, onReject) => {
    resolve = onResolve
    reject = onReject
  })
  // Nothing may be waiting on it yet when it fails
  promise.catch(() => {})
  return { promise, resolve, reject }
}

const post = (event: IntroEvent) => self.postMessage(event)
// Workers drawing to an OffscreenCanvas have requestAnimationFrame in every browser that supports them; the
// timer is only a safety net. Frames read the clock themselves: in a worker, Chrome's frame timestamps aren't
// on the same clock as performance.now()
const hasFrames = typeof requestAnimationFrame === 'function'
const nextFrame = (callback: () => void) => (hasFrames ? requestAnimationFrame(() => callback()) : self.setTimeout(callback, 16))
const cancelFrame = (id: number) => (hasFrames ? cancelAnimationFrame(id) : self.clearTimeout(id))

const maps = later<ImageBitmap[]>()
const localMaps = later<ImageBitmap[]>()
let options: IntroOptions
let globe: Globe | null = null
let phase: 'loading' | 'idle' | 'dive' | 'over' = 'loading'
let frame = 0
let framesDrawn = 0
let start = 0
let diveStart = 0
let measured = false
let startDirection: Vec3 = [0, 0, 1]
let lastFog = ''

/** Where the camera is at `time` (seconds) and dive `progress` (0..1) */
function poseAt(scene: Globe, time: number, progress: number): Pose {
  const half = scene.halfFov()
  // Far enough back for the whole globe to fit, with some space around it
  const startDistance = Math.max(3.6, 1 / Math.sin(Math.min(half.x, half.y) * 0.78))
  const beach = scene.targetDirection(time)
  const turn = easeInOutCubic(clamp01(progress / APPROACH_END))
  const direction = slerp(startDirection, beach, turn)
  return {
    position: scale(direction, 1 + altitude(progress, startDistance - 1)),
    lookAt: scale(beach, smoothstep(0.3, 0.66, progress)),
    up: normalize(mix([0, 1, 0], northAt(beach), smoothstep(0.2, 0.66, progress))),
  }
}

function startDive(now: number) {
  if (phase !== 'idle') return
  phase = 'dive'
  diveStart = now
  post({ type: 'dive' })
}

function report(scene: Globe, time: number, pose: Pose) {
  const result = scene.measureLanding(time, pose)
  post({
    type: 'debug',
    report: { ...result, target: options.target, viewport: { width: options.width, height: options.height } },
  })
}

function loop() {
  const now = performance.now()
  const scene = globe
  if (!scene || (phase !== 'idle' && phase !== 'dive')) return
  if (phase === 'idle' && now - start >= IDLE_MS) startDive(now)
  const time = (now - start) / 1000
  let progress = phase === 'dive' ? clamp01((now - diveStart) / DIVE_MS) : 0
  if (options.debug) progress = Math.min(progress, HOVER_END)
  const pose = poseAt(scene, time, progress)
  const landingAt = ((phase === 'dive' ? diveStart - start : IDLE_MS) + DIVE_MS) / 1000
  // A ring pulses out from the beach while the camera hovers over it
  const hoverStart = diveStart + (APPROACH_END - 0.02) * DIVE_MS
  const pulse = phase === 'dive' && now > hoverStart && !options.debug ? ((now - hoverStart) / 900) % 1 : -1

  // The page only hears about the fog when it changes (it's 0 for most of the dive)
  const fog = smoothstep(FOG_FROM, 1, progress).toFixed(3)
  if (fog !== lastFog) post({ type: 'fog', opacity: (lastFog = fog) })
  scene.render(time, pose, { pulse, landingAt, debug: options.debug })

  // Ready once a frame has certainly reached the screen, so the page never uncovers an empty canvas
  framesDrawn++
  if (framesDrawn === 2) {
    post({ type: 'ready' })
    void scene.loadLocal()
  }
  if (options.debug && progress >= HOVER_END && !measured) {
    measured = true
    report(scene, time, pose)
  }
  if (progress >= 1 && !options.debug) {
    phase = 'over'
    return post({ type: 'reveal' })
  }
  frame = nextFrame(loop)
}

async function begin(canvas: OffscreenCanvas) {
  try {
    globe = await createGlobe(canvas, { ...options, maps: maps.promise, localMaps: localMaps.promise })
  } catch {
    // No WebGL 2, a software renderer, or the maps failed: the page just shows the site
    return post({ type: 'failed' })
  }
  if (phase === 'over') return globe.dispose()
  globe.onContextLost(() => post({ type: 'failed' }))

  // Match the site theme. By day the sun sits west of the beach (afternoon), so the opening shot and the
  // landing are both lit; by night the dive flies from the sunlit side into the dark, where the coast shows
  // its city lights
  const landing = globe.targetDirection((IDLE_MS + DIVE_MS) / 1000)
  const east = normalize(cross(NORTH_AXIS, landing))
  const sunAngle = options.night ? -2.3 : -0.5
  globe.setSun(add(add(scale(landing, Math.cos(sunAngle)), scale(east, Math.sin(sunAngle))), scale(northAt(landing), 0.25)))
  // Open the shot over Africa, west of the beach
  startDirection = rotateAbout(landing, NORTH_AXIS, -1.2)

  if (options.reduceMotion && !options.debug) {
    // One still frame looking down at India; the page holds it, then fades into the site
    const beach = globe.targetDirection(0)
    globe.render(0, { position: scale(beach, 2.3), lookAt: [0, 0, 0], up: northAt(beach) })
    phase = 'over'
    // A frame later it's certainly on screen
    nextFrame(() => post({ type: 'ready' }))
    return
  }

  phase = 'idle'
  start = performance.now()
  frame = nextFrame(loop)
}

self.onmessage = (event: MessageEvent<IntroCommand>) => {
  const message = event.data
  switch (message.type) {
    case 'start':
      options = message.options
      void begin(message.canvas)
      break
    case 'maps':
      maps.resolve(message.maps)
      break
    case 'local-maps':
      localMaps.resolve(message.maps)
      break
    case 'maps-failed':
      maps.reject(new Error('Globe maps failed to load'))
      break
    case 'local-maps-failed':
      localMaps.reject(new Error('Local globe maps failed to load'))
      break
    case 'dive':
      startDive(performance.now())
      break
    case 'resize':
      options = { ...options, width: message.width, height: message.height }
      globe?.resize(message.width, message.height)
      measured = false
      break
    case 'dispose':
      phase = 'over'
      cancelFrame(frame)
      // The worker itself stays, idle, until the page goes: closing it makes the page wait for the thread to wind
      // down, which on a busy GPU froze the page for over 100 ms
      self.setTimeout(() => {
        globe?.dispose()
        globe = null
      }, RELEASE_DELAY_MS)
      break
  }
}
