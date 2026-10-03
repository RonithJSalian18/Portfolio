/**
 * Builds the illustrated globe textures in public/intro from NASA's public-domain data.
 *
 *   node scripts/globe-textures.mjs <source-dir>
 *
 * <source-dir> needs (links in the README's asset credits):
 *   day.jpg    Blue Marble Next Generation, December, topography + bathymetry, 5400×2700
 *   c1.jpg     the same series' 500 m tile C1 (0–90°E, 0–90°N), 21600×21600
 *   elev.png   GEBCO_08 elevation, 21600×10800
 *   night.jpg  Black Marble 2016, 0.1°
 *
 * Output (all equirectangular: left edge 180°W, top edge 90°N):
 *   globe-color-{2048,1024}.webp      land in a few flat biome colors with stepped relief shading
 *   globe-coast-1024.webp             signed distance to the coastline (land > 0.5 > water), ±COAST_RANGE_KM
 *   globe-lights-512.webp             city-light density for the night side
 *   globe-local-color-1024.webp       a sharper 16° square around the beach (bounds printed at the end)
 *   globe-local-coast-1024.webp       its coastline distance, ±LOCAL_RANGE_KM
 *
 * Sharp comes with Next.js, so this needs no extra install.
 */
import { createRequire } from 'node:module'
import { realpathSync, statSync } from 'node:fs'
import { join } from 'node:path'

const require = createRequire(realpathSync(join(process.cwd(), 'node_modules/next/package.json')))
const sharp = require('sharp')

const SOURCE = process.argv[2]
if (!SOURCE) throw new Error('Usage: node scripts/globe-textures.mjs <source-dir> [output-dir]')
const OUT = process.argv[3] ?? join(process.cwd(), 'public/intro')

/** The beach (kept in step with config/site.ts) */
const BEACH = { lat: 13.101766, lng: 74.769385 }
const COAST_RANGE_KM = 600
const LOCAL_RANGE_KM = 120
const EARTH_KM_PER_DEGREE = 111.32

// ---------- Biomes ----------

const ICE = 0
const BOREAL = 1
const FOREST = 2
const GRASS = 3
const DRY = 4
const DESERT = 5
const BIOMES = 6

/** The illustrated palette: one flat color per biome */
const PALETTE = [
  [238, 246, 251], // ice
  [104, 170, 132], // boreal: snowy taiga and tundra
  [46, 150, 88], // forest
  [128, 198, 92], // grassland
  [210, 196, 108], // dry grass, steppe and savanna
  [242, 196, 110], // desert
]

/** Blue Marble color → biome (calibrated on reference spots: Sahara, Amazon, Deccan, Siberia…) */
function biomeOf(r, g, b, lat, lng, elevation) {
  const lum = 0.3 * r + 0.59 * g + 0.11 * b
  const max = Math.max(r, g, b)
  const sat = max === 0 ? 0 : (max - Math.min(r, g, b)) / max
  if (lum > 200 && sat < 0.14) {
    // The imagery is from December, so snow covers the northern continents; only the polar caps,
    // Greenland and the highest peaks read as ice, the rest as snowy taiga and tundra
    const polar = lat > 71 || lat < -60
    const greenland = lat > 59.5 && lng > -75 && lng < -10
    return polar || greenland || elevation >= 215 ? ICE : BOREAL
  }
  if (sat < 0.13 && b >= r - 6) return BOREAL
  if (r > g * 1.35 || (r > g && lum > 135)) return DESERT
  if (r > g * 1.05 && lum > 70) return DRY
  if (lum < 52) return FOREST
  return GRASS
}

/** Open water in the topo-bathy imagery is distinctly blue; snow and ice are not */
const looksLikeWater = (r, g, b) => b > r + 20 && b - r > 0.3 * b && b > g - 10

// ---------- Raster helpers ----------

/** Separable box blur, radius r, optionally wrapping around east-west */
function boxBlur(src, w, h, r, wrapX) {
  const tmp = new Float32Array(w * h)
  const out = new Float32Array(w * h)
  const span = 2 * r + 1
  for (let y = 0; y < h; y++) {
    const row = y * w
    let sum = 0
    for (let k = -r; k <= r; k++) sum += src[row + (wrapX ? (k + w) % w : Math.min(w - 1, Math.max(0, k)))]
    for (let x = 0; x < w; x++) {
      tmp[row + x] = sum / span
      const add = x + r + 1
      const drop = x - r
      sum += src[row + (wrapX ? add % w : Math.min(w - 1, add))] - src[row + (wrapX ? (drop + w) % w : Math.max(0, drop))]
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0
    for (let k = -r; k <= r; k++) sum += tmp[Math.min(h - 1, Math.max(0, k)) * w + x]
    for (let y = 0; y < h; y++) {
      out[y * w + x] = sum / span
      sum += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x]
    }
  }
  return out
}

/** "No feature here" (large but finite, so the parabola maths below stays well defined) */
const INF = 1e20

/** 1D squared distance transform (Felzenszwalb & Huttenlocher), carrying the nearest site's id */
function dt1d(f, ids, n, d, outIds, v, z) {
  let k = 0
  v[0] = 0
  z[0] = -Infinity
  z[1] = Infinity
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    while (s <= z[k]) {
      k--
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    }
    k++
    v[k] = q
    z[k] = s
    z[k + 1] = Infinity
  }
  k = 0
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]
    outIds[q] = ids[v[k]]
  }
}

/**
 * Euclidean distance (in pixels) from every pixel to the nearest pixel where feature[i] is set, plus that
 * pixel's index. East-west wrap is handled by padding with the opposite edge.
 */
function distanceTransform(feature, w, h, wrapX) {
  const pad = wrapX ? Math.min(w, 160) : 0
  const pw = w + 2 * pad
  const grid = new Float32Array(pw * h)
  const ids = new Int32Array(pw * h)
  for (let y = 0; y < h; y++) {
    for (let px = 0; px < pw; px++) {
      const x = (px - pad + w) % w
      const i = y * w + x
      grid[y * pw + px] = feature[i] ? 0 : INF
      ids[y * pw + px] = i
    }
  }
  const n = Math.max(pw, h)
  const f = new Float64Array(n)
  const fi = new Int32Array(n)
  const d = new Float64Array(n)
  const di = new Int32Array(n)
  const v = new Int32Array(n)
  const z = new Float64Array(n + 1)
  for (let x = 0; x < pw; x++) {
    for (let y = 0; y < h; y++) {
      f[y] = grid[y * pw + x]
      fi[y] = ids[y * pw + x]
    }
    dt1d(f, fi, h, d, di, v, z)
    for (let y = 0; y < h; y++) {
      grid[y * pw + x] = d[y]
      ids[y * pw + x] = di[y]
    }
  }
  const dist = new Float32Array(w * h)
  const nearest = new Int32Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < pw; x++) {
      f[x] = grid[y * pw + x]
      fi[x] = ids[y * pw + x]
    }
    dt1d(f, fi, pw, d, di, v, z)
    for (let x = 0; x < w; x++) {
      const found = d[x + pad] < INF / 2
      dist[y * w + x] = found ? Math.sqrt(d[x + pad]) : Infinity
      nearest[y * w + x] = found ? di[x + pad] : -1
    }
  }
  return { dist, nearest }
}

// ---------- One map (the globe, or the local patch) ----------

/**
 * rgb: Blue Marble pixels, elev: GEBCO 0–255 on the same grid; west/north/degreesPerPixel place the grid on Earth
 * Returns the stylized color and the signed coastline distance in km.
 */
function stylize({ rgb, elev, w, h, wrapX, west, north, degreesPerPixel, coastSmoothing, biomeSmoothing, reliefSmoothing }) {
  const size = w * h
  const kmPerPixel = degreesPerPixel * EARTH_KM_PER_DEGREE

  // Water: blue in the imagery and at sea level in the elevation grid (low coastal land reads as 0 there)
  const land = new Float32Array(size)
  for (let i = 0; i < size; i++) {
    const water = looksLikeWater(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]) && elev[i] < 2
    land[i] = water ? 0 : 1
  }
  // Rounder coastlines: blur the mask twice and threshold it (drops specks smaller than the blur)
  const soft = boxBlur(boxBlur(land, w, h, coastSmoothing, wrapX), w, h, coastSmoothing, wrapX)
  const isLand = new Uint8Array(size)
  const isWater = new Uint8Array(size)
  for (let i = 0; i < size; i++) {
    isLand[i] = soft[i] >= 0.5 ? 1 : 0
    isWater[i] = 1 - isLand[i]
  }

  // Signed distance to the coast, in km (land positive)
  const toWater = distanceTransform(isWater, w, h, wrapX)
  const toLand = distanceTransform(isLand, w, h, wrapX)
  const coastKm = new Float32Array(size)
  for (let i = 0; i < size; i++) {
    coastKm[i] = (isLand[i] ? toWater.dist[i] - 0.5 : -(toLand.dist[i] - 0.5)) * kmPerPixel
  }

  // Biomes: classify, then a majority vote over a neighbourhood so regions read as smooth shapes
  const classes = new Uint8Array(size)
  for (let y = 0; y < h; y++) {
    const lat = north - (y + 0.5) * degreesPerPixel
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      const lng = west + (x + 0.5) * degreesPerPixel
      classes[i] = biomeOf(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2], lat, lng, elev[i])
    }
  }
  const biome = new Uint8Array(size).fill(GRASS)
  const bestVote = new Float32Array(size).fill(-1)
  const vote = new Float32Array(size)
  for (let b = 0; b < BIOMES; b++) {
    for (let i = 0; i < size; i++) vote[i] = isLand[i] && classes[i] === b ? 1 : 0
    const smooth = boxBlur(boxBlur(vote, w, h, biomeSmoothing, wrapX), w, h, biomeSmoothing, wrapX)
    for (let i = 0; i < size; i++) {
      if (smooth[i] > bestVote[i]) {
        bestVote[i] = smooth[i]
        biome[i] = b
      }
    }
  }

  // Stepped relief: slopes facing the northwest light get a lighter tone, slopes facing away a darker one.
  // Measured on smoothed elevation in units per km, so only real ranges (Ghats, Himalaya, Andes) show.
  const height = new Float32Array(size)
  for (let i = 0; i < size; i++) height[i] = elev[i]
  const relief = boxBlur(boxBlur(height, w, h, reliefSmoothing, wrapX), w, h, reliefSmoothing, wrapX)
  const color = new Uint8Array(size * 3)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      const toWest = relief[y * w + (wrapX ? (x - 1 + w) % w : Math.max(0, x - 1))]
      const toEast = relief[y * w + (wrapX ? (x + 1) % w : Math.min(w - 1, x + 1))]
      const toNorth = relief[Math.max(0, y - 1) * w + x]
      const toSouth = relief[Math.min(h - 1, y + 1) * w + x]
      const facing = (toWest - toEast + (toNorth - toSouth)) / (2 * kmPerPixel)
      const tone = facing > 0.6 ? 1.08 : facing < -0.6 ? 0.86 : 1
      const [r, g, b] = PALETTE[biome[i]]
      color[i * 3] = Math.min(255, r * tone)
      color[i * 3 + 1] = Math.min(255, g * tone)
      color[i * 3 + 2] = Math.min(255, b * tone)
    }
  }
  // Water near the coast takes the nearest land color, so texture filtering never tints the shoreline;
  // open water is flat (the shader paints the sea, and flat areas cost nothing to store)
  for (let i = 0; i < size; i++) {
    if (isLand[i]) continue
    const j = toLand.dist[i] <= 6 ? toLand.nearest[i] : -1
    const [r, g, b] = j < 0 ? PALETTE[FOREST] : [color[j * 3], color[j * 3 + 1], color[j * 3 + 2]]
    color[i * 3] = r
    color[i * 3 + 1] = g
    color[i * 3 + 2] = b
  }
  return { color, coastKm, isLand }
}

function encodeCoast(coastKm, rangeKm) {
  const out = new Uint8Array(coastKm.length)
  for (let i = 0; i < coastKm.length; i++) {
    out[i] = Math.round(Math.min(1, Math.max(0, 0.5 + coastKm[i] / (2 * rangeKm))) * 255)
  }
  return out
}

async function save(name, pixels, w, h, channels, size, quality) {
  const file = join(OUT, name)
  await sharp(Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength), { raw: { width: w, height: h, channels } })
    .resize(size[0], size[1], { kernel: 'lanczos3' })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(file)
  const bytes = statSync(file).size
  console.log(`${name.padEnd(30)} ${size[0]}×${size[1]}  ${(bytes / 1024).toFixed(1)} KB`)
}

const raw = async (image, channels) => {
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
  if (info.channels === channels) return data
  const out = new Uint8Array(info.width * info.height * channels)
  for (let i = 0; i < info.width * info.height; i++) {
    for (let c = 0; c < channels; c++) out[i * channels + c] = data[i * info.channels + c]
  }
  return out
}

const big = { limitInputPixels: false }

// ---------- The globe ----------

{
  const w = 4096
  const h = 2048
  const rgb = await raw(sharp(join(SOURCE, 'day.jpg'), big).resize(w, h, { kernel: 'lanczos3' }), 3)
  const elev = await raw(sharp(join(SOURCE, 'elev.png'), big).greyscale().resize(w, h, { kernel: 'mitchell' }), 1)
  const { color, coastKm } = stylize({
    rgb, elev, w, h, wrapX: true,
    west: -180, north: 90, degreesPerPixel: 360 / w,
    coastSmoothing: 2, biomeSmoothing: 4, reliefSmoothing: 2,
  })
  await save('globe-color-2048.webp', color, w, h, 3, [2048, 1024], 80)
  await save('globe-color-1024.webp', color, w, h, 3, [1024, 512], 80)
  await save('globe-coast-1024.webp', encodeCoast(coastKm, COAST_RANGE_KM), w, h, 1, [1024, 512], 88)
}

// ---------- City lights ----------

{
  const night = await raw(sharp(join(SOURCE, 'night.jpg'), big).greyscale().resize(512, 256, { kernel: 'lanczos3' }), 1)
  // Boost the faint towns so they still show as dots; the shader decides how many dots each area gets
  const boosted = new Uint8Array(night.length)
  for (let i = 0; i < night.length; i++) boosted[i] = Math.round(255 * Math.min(1, Math.max(0, (night[i] - 14) / 140)) ** 0.7)
  await save('globe-lights-512.webp', boosted, 512, 256, 1, [512, 256], 75)
}

// ---------- The patch around the beach (from the 500 m tile) ----------

{
  // C1 covers 0–90°E, 90°N–0 at 240 px per degree; take a 16° square centred on the beach
  const left = Math.round((BEACH.lng - 8) * 240)
  const top = Math.round((90 - BEACH.lat - 8) * 240)
  const span = 16 * 240
  const w = 2048
  const h = 2048
  const rgb = await raw(
    sharp(join(SOURCE, 'c1.jpg'), big).extract({ left, top, width: span, height: span }).resize(w, h, { kernel: 'lanczos3' }),
    3,
  )
  // GEBCO is 60 px per degree from 180°W, 90°N
  const elev = await raw(
    sharp(join(SOURCE, 'elev.png'), big)
      .greyscale()
      .extract({ left: Math.round((left / 240 + 180) * 60), top: Math.round((top / 240) * 60), width: 960, height: 960 })
      .resize(w, h, { kernel: 'mitchell' }),
    1,
  )
  const { color, coastKm } = stylize({
    rgb, elev, w, h, wrapX: false,
    west: left / 240, north: 90 - top / 240, degreesPerPixel: 16 / w,
    coastSmoothing: 2, biomeSmoothing: 10, reliefSmoothing: 8,
  })
  await save('globe-local-color-1024.webp', color, w, h, 3, [1024, 1024], 80)
  await save('globe-local-coast-1024.webp', encodeCoast(coastKm, LOCAL_RANGE_KM), w, h, 1, [1024, 1024], 90)

  const west = left / 240
  const north = 90 - top / 240
  // How far the beach sits from the coastline in this map (sanity check for the landing)
  const bx = ((BEACH.lng - west) / 16) * w
  const by = ((north - BEACH.lat) / 16) * h
  const at = coastKm[Math.floor(by) * w + Math.floor(bx)]
  console.log(`\nLocal patch: ${west.toFixed(6)}°E to ${(west + 16).toFixed(6)}°E, ${(north - 16).toFixed(6)}°N to ${north.toFixed(6)}°N`)
  console.log(`The beach is ${Math.abs(at).toFixed(2)} km ${at >= 0 ? 'inland from' : 'offshore of'} the mapped coastline`)
}
