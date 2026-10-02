/**
 * Software-rendered pixel-art globe.
 *
 * Every frame is ray-cast into a small buffer (a few hundred pixels wide) and the canvas is scaled up
 * with nearest-neighbor filtering, so each "pixel" is a crisp, screen-aligned square, including the
 * globe's outline. Colors are snapped to a fixed palette with ordered (Bayer) dithering for the retro look.
 * No WebGL or 3D library needed; at this resolution the math costs a few milliseconds per frame.
 */

export interface Texture {
  width: number
  height: number
  data: Uint8ClampedArray
}

export interface View {
  /** Earth spin around its axis (radians) */
  yaw: number
  /** Tilt toward/away from the camera (radians) */
  pitch: number
  /** Roll of the axis on screen (radians) */
  roll: number
  /** Camera distance from the center, in Earth radii */
  distance: number
  /** Seconds, for twinkling and blinking */
  time: number
  /** Show the blinking marker on the target location */
  marker: boolean
  /** 0..1: how much of the frame has turned into the pixel beach */
  resolve: number
  /** 0..1: how much of the frame has dissolved to transparent */
  dissolve: number
}

/** Positions and colors of the real hero (in CSS px), so the pixel beach lines up with it */
export interface BeachLayout {
  horizon: number
  sceneHeight: number
  celestial: { x: number; y: number; r: number; color: string } | null
  colors: Record<'skyTop' | 'skyMid' | 'skyLow' | 'seaFar' | 'seaMid' | 'seaNear' | 'seaShallow' | 'foam' | 'sandWet' | 'sand', string>
}

type RGB = [number, number, number]

export const START_DISTANCE = 3.4
export const END_DISTANCE = 1.18
/** Globe radius as a share of half the shorter screen side, at the start */
const GLOBE_FILL = 0.6
const TAN_HALF_FOV = Math.tan(Math.asin(1 / START_DISTANCE)) / GLOBE_FILL
const HALO = 1.075
const SUN: RGB = normalize([-0.45, 0.38, 0.81])

const PALETTE: RGB[] = [
  [5, 6, 15], // 0 space
  [11, 18, 48], // 1 night
  [15, 31, 74], // 2 deep ocean
  [18, 58, 120], // 3 ocean
  [29, 95, 174], // 4 bright ocean
  [45, 143, 208], // 5 shallow blue
  [70, 193, 200], // 6 turquoise shallows
  [15, 44, 28], // 7 dark forest
  [31, 90, 46], // 8 forest
  [63, 138, 58], // 9 green
  [134, 176, 79], // 10 light green
  [183, 165, 96], // 11 savanna
  [216, 191, 134], // 12 desert
  [154, 116, 72], // 13 brown
  [94, 70, 50], // 14 dark brown
  [233, 242, 248], // 15 ice
  [169, 191, 214], // 16 haze
  [111, 195, 255], // 17 atmosphere
  [43, 79, 154], // 18 deep atmosphere
  [255, 255, 255], // 19 star
  [255, 231, 163], // 20 warm star
  [122, 138, 168], // 21 dim star
  [255, 107, 87], // 22 marker (coral)
]
/** Only these entries are used for texture colors; stars and the marker are drawn directly */
const SHADE_COUNT = 19
const STAR = 19
const STAR_WARM = 20
const STAR_DIM = 21
const MARKER = 22

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const DITHER = 26

function normalize([x, y, z]: RGB): RGB {
  const length = Math.hypot(x, y, z)
  return [x / length, y / length, z / length]
}

/** ImageData is R,G,B,A in memory; a little-endian Uint32 view therefore stores ABGR */
const pack = (r: number, g: number, b: number, a = 255) => ((a << 24) | (b << 16) | (g << 8) | r) >>> 0

/** Stable 0..1 noise per (x, y), used for the block-by-block resolve and dissolve */
function hash2(x: number, y: number, seed: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(seed, 2246822519)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const UNKNOWN = 255

/**
 * Nearest palette entry per 15-bit color ("redmean" perceptual distance), filled in lazily the first
 * time a color shows up, so startup doesn't pay for all 32k entries at once.
 */
function createPaletteLookup() {
  const lookup = new Uint8Array(32 * 32 * 32).fill(UNKNOWN)
  return (key: number) => {
    const cached = lookup[key]
    if (cached !== UNKNOWN) return cached
    const r = ((key >> 10) & 31) * 8 + 4
    const g = ((key >> 5) & 31) * 8 + 4
    const b = (key & 31) * 8 + 4
    let best = 0
    let bestDistance = Infinity
    for (let i = 0; i < SHADE_COUNT; i++) {
      const [pr, pg, pb] = PALETTE[i]
      const mean = (r + pr) / 2
      const dr = r - pr
      const dg = g - pg
      const db = b - pb
      const distance = (2 + mean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - mean) / 256) * db * db
      if (distance < bestDistance) {
        bestDistance = distance
        best = i
      }
    }
    lookup[key] = best
    return best
  }
}

type Matrix = [number, number, number, number, number, number, number, number, number]

const rotX = (a: number): Matrix => [1, 0, 0, 0, Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a)]
const rotY = (a: number): Matrix => [Math.cos(a), 0, Math.sin(a), 0, 1, 0, -Math.sin(a), 0, Math.cos(a)]
const rotZ = (a: number): Matrix => [Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1]

function multiply(a: Matrix, b: Matrix): Matrix {
  const out = new Array(9) as Matrix
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      out[row * 3 + col] = a[row * 3] * b[col] + a[row * 3 + 1] * b[3 + col] + a[row * 3 + 2] * b[6 + col]
    }
  }
  return out
}

const clamp255 = (value: number) => (value < 0 ? 0 : value > 255 ? 255 : value | 0)

/** Parse any CSS color the browser understands into RGB (via a canvas, which normalizes it) */
function cssColorToRgb(color: string, scratch: CanvasRenderingContext2D): RGB {
  scratch.fillStyle = '#000'
  scratch.fillStyle = color
  const normalized = scratch.fillStyle
  if (normalized.startsWith('#')) {
    const n = parseInt(normalized.slice(1), 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const parts = normalized.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0]
  return [parts[0], parts[1], parts[2]]
}

export async function loadTexture(url: string): Promise<Texture> {
  const image = new Image()
  image.decoding = 'async'
  image.src = url
  await image.decode()
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('2D canvas unavailable')
  context.drawImage(image, 0, 0)
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
  return { width: canvas.width, height: canvas.height, data }
}

interface Star {
  x: number
  y: number
  brightness: number
  phase: number
  speed: number
}

export function createGlobeRenderer(
  canvas: HTMLCanvasElement,
  texture: Texture,
  options: { lite: boolean; target: { lat: number; lng: number } },
) {
  const context = canvas.getContext('2d')
  if (!context) throw new Error('2D canvas unavailable')

  const nearestShade = createPaletteLookup()
  const palette = Uint32Array.from(PALETTE, ([r, g, b]) => pack(r, g, b))
  const lat = (options.target.lat * Math.PI) / 180
  const lng = (options.target.lng * Math.PI) / 180
  const location: RGB = [Math.cos(lat) * Math.sin(lng), Math.sin(lat), Math.cos(lat) * Math.cos(lng)]
  const { width: texW, height: texH, data: tex } = texture

  let width = 0
  let height = 0
  let pixelSize = 1
  let offsetX = 0
  let offsetY = 0
  let rays = new Float32Array(0)
  let image = context.createImageData(1, 1)
  let pixels: Uint32Array = new Uint32Array(0)
  let isScene = new Uint8Array(0)
  let stars: Star[] = []
  let beach: Uint32Array | null = null

  function resize() {
    // Aim for a fixed pixel budget: ~52k pixels normally, ~22k on phones and low-end devices
    const budget = options.lite ? 22000 : 52000
    pixelSize = Math.max(3, Math.ceil(Math.sqrt((window.innerWidth * window.innerHeight) / budget)))
    width = Math.ceil(window.innerWidth / pixelSize)
    height = Math.ceil(window.innerHeight / pixelSize)
    offsetX = (window.innerWidth - width * pixelSize) / 2
    offsetY = (window.innerHeight - height * pixelSize) / 2

    canvas.width = width
    canvas.height = height
    canvas.style.width = `${width * pixelSize}px`
    canvas.style.height = `${height * pixelSize}px`
    image = context!.createImageData(width, height)
    pixels = new Uint32Array(image.data.buffer)
    isScene = new Uint8Array(width * height)

    // Camera ray per pixel (camera on +Z looking at the origin); only depends on the screen size
    rays = new Float32Array(width * height * 3)
    const half = Math.min(width, height) / 2
    for (let y = 0, i = 0; y < height; y++) {
      for (let x = 0; x < width; x++, i++) {
        const nx = ((x + 0.5 - width / 2) / half) * TAN_HALF_FOV
        const ny = (-(y + 0.5 - height / 2) / half) * TAN_HALF_FOV
        const length = Math.hypot(nx, ny, 1)
        rays[i * 3] = nx / length
        rays[i * 3 + 1] = ny / length
        rays[i * 3 + 2] = -1 / length
      }
    }

    const random = mulberry32(1337)
    const count = options.lite ? 70 : 170
    stars = Array.from({ length: count }, () => ({
      x: random() * width,
      y: random() * height,
      brightness: random(),
      phase: random() * Math.PI * 2,
      speed: 1 + random() * 2.5,
    }))
    beach = null
  }

  function sampleTexture(u: number, v: number, out: RGB) {
    const fx = u * texW - 0.5
    const fy = Math.min(Math.max(v * texH - 0.5, 0), texH - 1.001)
    const x0 = Math.floor(fx)
    const y0 = Math.floor(fy)
    const tx = fx - x0
    const ty = fy - y0
    const xa = ((x0 % texW) + texW) % texW
    const xb = (xa + 1) % texW
    const row0 = y0 * texW
    const row1 = Math.min(y0 + 1, texH - 1) * texW
    const i00 = (row0 + xa) * 4
    const i10 = (row0 + xb) * 4
    const i01 = (row1 + xa) * 4
    const i11 = (row1 + xb) * 4
    for (let c = 0; c < 3; c++) {
      const top = tex[i00 + c] + (tex[i10 + c] - tex[i00 + c]) * tx
      const bottom = tex[i01 + c] + (tex[i11 + c] - tex[i01 + c]) * tx
      out[c] = top + (bottom - top) * ty
    }
  }

  function renderGlobe(view: View) {
    const d = view.distance
    const c = d * d - 1
    // world = Rz(roll) · Rx(pitch) · Ry(yaw) · earth, so earth = its inverse applied to world points
    const m = multiply(rotY(-view.yaw), multiply(rotX(-view.pitch), rotZ(-view.roll)))
    const color: RGB = [0, 0, 0]
    const space = palette[0]

    for (let y = 0, i = 0; y < height; y++) {
      const bayerRow = (y & 3) * 4
      for (let x = 0; x < width; x++, i++) {
        const dx = rays[i * 3]
        const dy = rays[i * 3 + 1]
        const dz = rays[i * 3 + 2]
        const b = d * dz
        const disc = b * b - c
        let r: number
        let g: number
        let bl: number

        if (disc >= 0) {
          const t = -b - Math.sqrt(disc)
          // Hit point on the unit sphere doubles as the surface normal
          const px = t * dx
          const py = t * dy
          const pz = d + t * dz
          const ex = m[0] * px + m[1] * py + m[2] * pz
          const ey = m[3] * px + m[4] * py + m[5] * pz
          const ez = m[6] * px + m[7] * py + m[8] * pz
          const latitude = Math.asin(ey > 1 ? 1 : ey < -1 ? -1 : ey)
          const longitude = Math.atan2(ex, ez)
          sampleTexture(longitude / (2 * Math.PI) + 0.5, 0.5 - latitude / Math.PI, color)

          const diffuse = px * SUN[0] + py * SUN[1] + pz * SUN[2]
          const light = 0.1 + 1.05 * (diffuse > 0 ? diffuse : 0)
          const facing = -(dx * px + dy * py + dz * pz)
          const edge = 1 - facing
          const rim = edge * edge * edge * (0.3 + 0.7 * Math.max(0, diffuse + 0.25))
          r = color[0] * light + 80 * rim
          g = color[1] * light + 170 * rim
          bl = color[2] * light + 255 * rim
          isScene[i] = 1
        } else {
          const closest = Math.sqrt(d * d - b * b)
          if (closest < HALO) {
            const glow = 1 - (closest - 1) / (HALO - 1)
            r = 40 * glow
            g = 110 * glow
            bl = 230 * glow
            isScene[i] = 1
          } else {
            pixels[i] = space
            isScene[i] = 0
            continue
          }
        }

        const bias = (BAYER4[bayerRow + (x & 3)] / 16 - 0.47) * DITHER
        const qr = clamp255(r + bias) >> 3
        const qg = clamp255(g + bias) >> 3
        const qb = clamp255(bl + bias) >> 3
        pixels[i] = palette[nearestShade((qr << 10) | (qg << 5) | qb)]
      }
    }

    // Stars drift outward a little as the camera dives in
    const spread = 1 + ((START_DISTANCE - d) / (START_DISTANCE - END_DISTANCE)) * 0.7
    for (const star of stars) {
      const sx = Math.round(width / 2 + (star.x - width / 2) * spread)
      const sy = Math.round(height / 2 + (star.y - height / 2) * spread)
      if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue
      const index = sy * width + sx
      if (isScene[index]) continue
      const twinkle = star.brightness * (0.6 + 0.4 * Math.sin(view.time * star.speed + star.phase))
      if (twinkle < 0.18) continue
      pixels[index] = palette[twinkle > 0.75 ? STAR : twinkle > 0.45 ? STAR_WARM : STAR_DIM]
    }

    if (view.marker) drawMarker(view)
  }

  function drawMarker(view: View) {
    // Location in world space: world = Rz(roll) Rx(pitch) Ry(yaw) · location
    const world = multiply(rotZ(view.roll), multiply(rotX(view.pitch), rotY(view.yaw)))
    const wx = world[0] * location[0] + world[1] * location[1] + world[2] * location[2]
    const wy = world[3] * location[0] + world[4] * location[1] + world[5] * location[2]
    const wz = world[6] * location[0] + world[7] * location[1] + world[8] * location[2]
    if (wz <= 1 / view.distance) return // on the far side

    const depth = view.distance - wz
    const half = Math.min(width, height) / 2
    const cx = Math.round(width / 2 + (wx / (depth * TAN_HALF_FOV)) * half - 0.5)
    const cy = Math.round(height / 2 - (wy / (depth * TAN_HALF_FOV)) * half - 0.5)
    const on = Math.sin(view.time * 7) > -0.2
    const size = view.distance < 1.8 ? 2 : 1
    for (let y = -size; y <= size; y++) {
      for (let x = -size; x <= size; x++) {
        if (Math.abs(x) + Math.abs(y) > size + 0.5) continue
        const px = cx + x
        const py = cy + y
        if (px < 0 || py < 0 || px >= width || py >= height) continue
        pixels[py * width + px] = palette[on ? (x === 0 && y === 0 ? STAR : MARKER) : MARKER]
      }
    }
  }

  /** Pre-render the hero (sky, sun/moon, waves, sand) as pixel art in the same buffer */
  function setBeach(layout: BeachLayout) {
    const scratch = document.createElement('canvas').getContext('2d')
    if (!scratch) return
    const rgb = Object.fromEntries(
      Object.entries(layout.colors).map(([key, value]) => [key, cssColorToRgb(value, scratch)]),
    ) as Record<keyof BeachLayout['colors'], RGB>

    const toBufferY = (cssY: number) => (cssY - offsetY) / pixelSize
    const toBufferX = (cssX: number) => (cssX - offsetX) / pixelSize
    const horizon = toBufferY(layout.horizon)
    const sceneHeight = layout.sceneHeight / pixelSize
    // Mirrors the hero's wave layers: top as a share of the sea scene, color, wave period in CSS px
    const bands: [number, RGB, number][] = [
      [0.07, rgb.seaMid, 150],
      [0.22, rgb.seaNear, 240],
      [0.38, rgb.seaShallow, 380],
      [0.56, rgb.sandWet, 560],
      [0.68, rgb.sand, 1100],
    ]
    const skyStops: RGB[] = [rgb.skyTop, rgb.skyMid, rgb.skyLow]
    const skyAt = (t: number): RGB => {
      const [a, b, local] = t < 0.55 ? [skyStops[0], skyStops[1], t / 0.55] : [skyStops[1], skyStops[2], (t - 0.55) / 0.45]
      return [a[0] + (b[0] - a[0]) * local, a[1] + (b[1] - a[1]) * local, a[2] + (b[2] - a[2]) * local]
    }
    const sky = Array.from({ length: 8 }, (_, k) => skyAt(k / 7))
    const celestial = layout.celestial && {
      x: toBufferX(layout.celestial.x),
      y: toBufferY(layout.celestial.y),
      r: layout.celestial.r / pixelSize,
      color: cssColorToRgb(layout.celestial.color, scratch),
    }

    beach = new Uint32Array(width * height)
    for (let y = 0, i = 0; y < height; y++) {
      for (let x = 0; x < width; x++, i++) {
        let color: RGB
        if (y < horizon) {
          // Banded, dithered sky gradient
          const t = Math.max(0, y / horizon)
          const band = Math.min(7, Math.max(0, Math.floor(t * 7 + BAYER4[(y & 3) * 4 + (x & 3)] / 16)))
          color = sky[band]
          if (celestial) {
            const distance = Math.hypot(x + 0.5 - celestial.x, y + 0.5 - celestial.y)
            if (distance <= celestial.r) color = celestial.color
            else if (distance <= celestial.r + 1.2) color = mix(color, celestial.color, 0.45)
          }
        } else {
          color = rgb.seaFar
          let foam = false
          for (const [top, bandColor, period] of bands) {
            const amplitude = period / 20 / pixelSize
            const wave = Math.sin(((x * pixelSize) / period) * Math.PI * 2) * amplitude
            const edge = horizon + top * sceneHeight + wave
            if (y >= edge) {
              color = bandColor
              foam = top === 0.38 && y < edge + 1
            }
          }
          if (foam) color = rgb.foam
        }
        beach[i] = pack(color[0] | 0, color[1] | 0, color[2] | 0)
      }
    }
  }

  function render(view: View) {
    const showGlobe = !beach || view.resolve < 1
    if (showGlobe) renderGlobe(view)

    if (beach && view.resolve > 0) {
      for (let y = 0, i = 0; y < height; y++) {
        for (let x = 0; x < width; x++, i++) {
          if (!showGlobe || hash2(x >> 1, y >> 1, 7) < view.resolve) pixels[i] = beach[i]
        }
      }
    }

    if (view.dissolve > 0) {
      for (let y = 0, i = 0; y < height; y++) {
        for (let x = 0; x < width; x++, i++) {
          if (hash2(x >> 1, y >> 1, 13) < view.dissolve) pixels[i] = 0
        }
      }
    }

    context!.putImageData(image, 0, 0)
  }

  resize()
  return { resize, render, setBeach, hasBeach: () => beach !== null }
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

export type GlobeRenderer = ReturnType<typeof createGlobeRenderer>
