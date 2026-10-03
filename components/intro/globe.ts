import {
  CLOUD_DRIFT,
  EARTH_TILT,
  SPIN_SPEED,
  add,
  cross,
  dot,
  globeToWorld,
  latLngToVector,
  normalize,
  rotateAbout,
  scale,
  type Vec3,
} from './geo'
import {
  attributes,
  basisMatrix,
  createBuffer,
  createTexture,
  finishPrograms,
  globeMatrix,
  loadBitmap,
  lookAt,
  mat4,
  multiply,
  perspective,
  project,
  startProgram,
  type Program,
} from './gl'
import * as shaders from './shaders'

/** Where globe-local-*.webp sits on Earth (printed by scripts/globe-textures.mjs) */
const LOCAL_PATCH = { west: 66.770833, north: 21.1, size: 16 }
/** Coastline distance ranges baked into the coast maps, km (global, local) */
const COAST_RANGE_KM: [number, number] = [600, 120]

/** The landing cloud slides in from the sea faster than the rest of the cloud layer */
const LANDING_DRIFT = 0.05
/** Top of the landing cloud above the surface (Earth radii); the dive ends just above it */
export const LANDING_CLOUD_TOP = 0.052

const SEA = { deep: [0.12, 0.31, 0.68], shelf: [0.18, 0.45, 0.81], shallow: [0.24, 0.77, 0.83], foam: [0.84, 0.98, 1] }

export interface Pose {
  position: Vec3
  lookAt: Vec3
  up: Vec3
}

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---------- Geometry ----------

function sphere(segments: number) {
  const rings = segments / 2
  const positions: number[] = []
  const indices: number[] = []
  for (let y = 0; y <= rings; y++) {
    const lat = 90 - (180 * y) / rings
    for (let x = 0; x <= segments; x++) positions.push(...latLngToVector(lat, -180 + (360 * x) / segments))
  }
  for (let y = 0; y < rings; y++) {
    for (let x = 0; x < segments; x++) {
      const a = y * (segments + 1) + x
      const b = a + segments + 1
      // Counter-clockwise seen from outside (north up, east to the right)
      indices.push(a, b, a + 1, a + 1, b, b + 1)
    }
  }
  return { positions: new Float32Array(positions), indices: new Uint16Array(indices) }
}

/** Icosphere, flat-shaded: [x, y, z, nx, ny, nz] per vertex */
function puffMesh(subdivisions: number) {
  const t = (1 + Math.sqrt(5)) / 2
  const corners: Vec3[] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map((corner) => normalize(corner as Vec3))
  const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ]
  const midpoint = (a: Vec3, b: Vec3) => normalize(add(a, b))
  let triangles = faces.map(([i, j, k]) => [corners[i], corners[j], corners[k]])
  for (let level = 0; level < subdivisions; level++) {
    triangles = triangles.flatMap(([a, b, c]) => {
      const [ab, bc, ca] = [midpoint(a, b), midpoint(b, c), midpoint(c, a)]
      return [
        [a, ab, ca],
        [ab, b, bc],
        [ca, bc, c],
        [ab, bc, ca],
      ]
    })
  }
  const data: number[] = []
  for (const [a, b, c] of triangles) {
    const normal = normalize(cross(add(b, scale(a, -1)), add(c, scale(a, -1))))
    for (const vertex of [a, b, c]) data.push(...vertex, ...normal)
  }
  return new Float32Array(data)
}

/** Flat-colored boxes for the satellites: [x, y, z, nx, ny, nz, r, g, b] per vertex */
function boxes(parts: { size: Vec3; at: Vec3; color: Vec3 }[]) {
  const data: number[] = []
  const faces: [Vec3, Vec3, Vec3][] = [
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    [[-1, 0, 0], [0, 0, 1], [0, 1, 0]],
    [[0, 1, 0], [0, 0, 1], [1, 0, 0]],
    [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
    [[0, 0, 1], [1, 0, 0], [0, 1, 0]],
    [[0, 0, -1], [0, 1, 0], [1, 0, 0]],
  ]
  for (const { size, at, color } of parts) {
    const half = scale(size, 0.5)
    for (const [normal, u, v] of faces) {
      const corner = (su: number, sv: number): Vec3 => [
        at[0] + (normal[0] + u[0] * su + v[0] * sv) * half[0],
        at[1] + (normal[1] + u[1] * su + v[1] * sv) * half[1],
        at[2] + (normal[2] + u[2] * su + v[2] * sv) * half[2],
      ]
      for (const [su, sv] of [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, -1],
        [1, 1],
        [-1, 1],
      ]) {
        data.push(...corner(su, sv), ...normal, ...color)
      }
    }
  }
  return new Float32Array(data)
}

const FOIL: Vec3 = [0.96, 0.72, 0.28]
const PANEL: Vec3 = [0.25, 0.42, 0.95]
const WHITE: Vec3 = [0.93, 0.95, 0.98]
const STEEL: Vec3 = [0.62, 0.68, 0.78]

const probe = () =>
  boxes([
    { size: [0.016, 0.016, 0.024], at: [0, 0, 0], color: FOIL },
    { size: [0.056, 0.0016, 0.018], at: [0.038, 0, 0], color: PANEL },
    { size: [0.056, 0.0016, 0.018], at: [-0.038, 0, 0], color: PANEL },
    { size: [0.012, 0.002, 0.002], at: [0.012, 0, 0], color: STEEL },
    { size: [0.012, 0.002, 0.002], at: [-0.012, 0, 0], color: STEEL },
    { size: [0.014, 0.004, 0.014], at: [0, 0.011, 0], color: WHITE },
  ])

const station = () =>
  boxes([
    { size: [0.17, 0.006, 0.006], at: [0, 0, 0], color: STEEL },
    ...[-0.075, -0.047, 0.047, 0.075].flatMap((x) =>
      [-1, 1].map((side) => ({ size: [0.019, 0.0016, 0.06] as Vec3, at: [x, 0, side * 0.035] as Vec3, color: PANEL })),
    ),
    { size: [0.014, 0.014, 0.06], at: [0, 0, 0], color: WHITE },
    { size: [0.012, 0.012, 0.024], at: [0, 0, 0.04], color: WHITE },
    { size: [0.01, 0.014, 0.001], at: [0.022, 0.009, -0.014], color: WHITE },
    { size: [0.01, 0.014, 0.001], at: [-0.022, 0.009, -0.014], color: WHITE },
  ])

interface Orbit {
  kind: 'station' | 'probe'
  radius: number
  inclination: number
  node: number
  speed: number
  phase: number
  beacon: Vec3
  color: Vec3
}

const ORBITS: Orbit[] = [
  { kind: 'station', radius: 1.42, inclination: 0.85, node: 0.3, speed: 0.2, phase: 0.6, beacon: [0, 0.008, 0.052], color: [1, 1, 1] },
  { kind: 'probe', radius: 1.27, inclination: -0.55, node: 1.7, speed: 0.32, phase: 2.1, beacon: [0, -0.01, 0.013], color: [1, 0.36, 0.3] },
  { kind: 'probe', radius: 1.63, inclination: 1.2, node: 3.1, speed: 0.15, phase: 4.3, beacon: [0, -0.01, 0.013], color: [0.45, 1, 0.75] },
  { kind: 'probe', radius: 1.86, inclination: 0.28, node: 4.6, speed: 0.11, phase: 1.2, beacon: [0, -0.01, 0.013], color: [1, 0.36, 0.3] },
]

/** A craft's frame on its orbit: position, plus a basis with the craft flying along +Z */
function orbitFrame(orbit: Orbit, time: number) {
  const angle = orbit.phase + orbit.speed * time
  // Orbit plane: rotate the equatorial circle by the inclination, then about the pole by the node
  const tilt = (v: Vec3) => rotateAbout(rotateAbout(v, [1, 0, 0], orbit.inclination), [0, 1, 0], orbit.node)
  const radial = tilt([Math.cos(angle), 0, -Math.sin(angle)])
  const along = tilt([-Math.sin(angle), 0, -Math.cos(angle)])
  const roll = Math.sin(time * 0.3 + orbit.phase) * 0.15
  const side = rotateAbout(radial, along, roll)
  return { position: scale(radial, orbit.radius), x: side, y: cross(along, side), z: along }
}

// ---------- Clouds ----------

/**
 * The cloud the dive ends in: a big middle puff right over the beach (its top is LANDING_CLOUD_TOP) ringed by
 * lower ones, so the camera can stop just above it without clipping into any puff
 */
function landingCloud(center: Vec3) {
  const side = normalize(cross([0, 1, 0], center))
  const ahead = cross(center, side)
  const middle = 0.034
  const puffs = [...scale(center, 1 + LANDING_CLOUD_TOP - middle * 0.62), middle]
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2 + 0.4
    const reach = 0.03 + 0.008 * Math.sin(i * 2.3)
    const radius = 0.021 + 0.004 * Math.cos(i * 1.7)
    const direction = normalize(add(center, add(scale(side, Math.cos(angle) * reach), scale(ahead, Math.sin(angle) * reach))))
    puffs.push(...scale(direction, 1.026 + 0.003 * Math.sin(i)), radius)
  }
  return puffs
}

/** Puffs as [x, y, z, radius] at cloud height, in the cloud layer's frame */
function cloudLayer(random: () => number, clusters: number, avoid: Vec3) {
  const puffs: number[] = []
  let made = 0
  while (made < clusters) {
    const lat = (Math.asin(random() * 2 - 1) * 180) / Math.PI
    if (Math.abs(lat) > 62) continue
    const center = latLngToVector(lat, random() * 360 - 180)
    // Keep the sky around the landing clear for the approach
    if (dot(center, avoid) > Math.cos(0.3)) continue
    made++
    puffCluster(puffs, center, 0.026 + random() * 0.03, 3 + Math.floor(random() * 4), random)
  }
  return puffs
}

function puffCluster(puffs: number[], center: Vec3, spread: number, count: number, random: () => number) {
  const side = normalize(cross([0, 1, 0], center))
  const ahead = cross(center, side)
  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2
    const reach = i === 0 ? 0 : spread * (0.45 + 0.55 * random())
    const radius = (i === 0 ? 0.03 : 0.016 + random() * 0.014) * (spread / 0.04)
    const direction = normalize(add(center, add(scale(side, Math.cos(angle) * reach), scale(ahead, Math.sin(angle) * reach))))
    puffs.push(...scale(direction, 1.034 + random() * 0.006), Math.max(0.012, radius))
  }
}

// ---------- Scene ----------

export async function createGlobe(
  container: HTMLElement,
  options: { lite: boolean; target: { lat: number; lng: number } },
) {
  const { lite } = options
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2', {
    antialias: !lite,
    alpha: false,
    stencil: false,
    powerPreference: 'high-performance',
    // A software-rendered globe would be janky; the caller skips the intro instead
    failIfMajorPerformanceCaveat: true,
  })
  if (!gl) throw new Error('WebGL 2 unavailable')
  const info = gl.getExtension('WEBGL_debug_renderer_info')
  const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER))
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) {
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    throw new Error('Software WebGL: skipping the intro')
  }
  const pixelRatio = Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 1.5)
  const fail = (error: unknown): never => {
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    throw error
  }

  // Programs compile in the background while the textures download
  const pending = [
    startProgram(gl, shaders.skyVertex, shaders.skyFragment),
    startProgram(gl, shaders.starVertex, shaders.starFragment),
    startProgram(gl, shaders.planetVertex, shaders.planetFragment),
    startProgram(gl, shaders.cloudVertex, shaders.cloudFragment),
    startProgram(gl, shaders.craftVertex, shaders.craftFragment),
    startProgram(gl, shaders.beaconVertex, shaders.beaconFragment),
  ]
  const file = (name: string) => `/intro/${name}.webp`
  const mainMaps = Promise.all(
    [lite ? 'globe-color-1024' : 'globe-color-2048', 'globe-coast-1024', 'globe-lights-512'].map((name) => loadBitmap(file(name))),
  )
  // Only needed for the last stretch of the dive; fetched now, uploaded after the first frame
  const localMaps = Promise.all(['globe-local-color-1024', 'globe-local-coast-1024'].map((name) => loadBitmap(file(name))))
  localMaps.catch(() => {})

  let programs: Program[]
  let images: ImageBitmap[]
  try {
    ;[programs, images] = await Promise.all([finishPrograms(gl, pending), mainMaps])
  } catch (error) {
    return fail(error)
  }
  const [sky, stars, planet, clouds, craft, beacons] = programs

  const anisotropy = lite ? 2 : 8
  const textures: WebGLTexture[] = []
  for (const [index, image] of images.entries()) {
    textures.push(createTexture(gl, image, { repeatX: true, anisotropy: index < 2 ? anisotropy : undefined }))
    // One upload per task, so no single task blocks the page for long
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
  // Placeholders until the local patch arrives (uLocalReady keeps them unused)
  const blank = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, blank)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(3))
  const localTextures: (WebGLTexture | null)[] = [blank, blank]
  let localReady = 0

  // ---------- Buffers ----------
  const vaos: WebGLVertexArrayObject[] = []
  const buffers: (WebGLBuffer | null)[] = []
  const vao = () => {
    const array = gl.createVertexArray()!
    gl.bindVertexArray(array)
    vaos.push(array)
    return array
  }
  const buffer = (data: BufferSource, target?: number) => {
    const created = createBuffer(gl, data, target)
    buffers.push(created)
    return created
  }

  const skyVao = vao()
  attributes(gl, buffer(new Float32Array([-1, -1, 3, -1, -1, 3])), [[0, 2, 2, 0]])

  const random = mulberry32(7)
  const starCount = lite ? 650 : 1500
  const starData = new Float32Array(starCount * 7)
  for (let i = 0; i < starCount; i++) {
    const u = random() * 2 - 1
    const theta = random() * Math.PI * 2
    const ring = Math.sqrt(1 - u * u)
    const sparkle = random() < 0.035 ? 1 : 0
    starData.set(
      [
        60 * ring * Math.cos(theta),
        60 * u,
        60 * ring * Math.sin(theta),
        sparkle ? 9 + random() * 5 : 1.1 + 2 * random() ** 3,
        random(),
        sparkle,
        random(),
      ],
      i * 7,
    )
  }
  const starVao = vao()
  attributes(gl, buffer(starData), [
    [0, 3, 7, 0],
    [1, 4, 7, 3],
  ])

  const mesh = sphere(lite ? 128 : 192)
  const planetVao = vao()
  attributes(gl, buffer(mesh.positions), [[0, 3, 3, 0]])
  buffer(mesh.indices, gl.ELEMENT_ARRAY_BUFFER)

  // The far-off cloud layer is chunkier; the landing cloud fills the screen at the end, so it gets finer facets
  const puff = puffMesh(1)
  const finePuff = puffMesh(2)
  const target = latLngToVector(options.target.lat, options.target.lng)
  const cloudRandom = mulberry32(42)
  const layer = new Float32Array(cloudLayer(cloudRandom, lite ? 24 : 46, target))
  const landing = landingCloud(target)
  const puffVao = (shape: Float32Array, instances: Float32Array) => {
    const array = vao()
    attributes(gl, buffer(shape), [
      [0, 3, 6, 0],
      [1, 3, 6, 3],
    ])
    attributes(gl, buffer(instances), [[2, 4, 4, 0]], 1)
    return array
  }
  const layerVao = puffVao(puff, layer)
  const landingVao = puffVao(finePuff, new Float32Array(landing))

  const orbits = lite ? ORBITS.slice(0, 2) : ORBITS
  const craftMeshes = orbits.map((orbit) => {
    const data = orbit.kind === 'station' ? station() : probe()
    const array = vao()
    attributes(gl, buffer(data), [
      [0, 3, 9, 0],
      [1, 3, 9, 3],
      [2, 3, 9, 6],
    ])
    return { vao: array, count: data.length / 9 }
  })
  const beaconData = new Float32Array(orbits.length * 7)
  const beaconBuffer = gl.createBuffer()
  buffers.push(beaconBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, beaconBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, beaconData.byteLength, gl.DYNAMIC_DRAW)
  const beaconVao = vao()
  attributes(gl, beaconBuffer, [
    [0, 3, 7, 0],
    [1, 4, 7, 3],
  ])
  gl.bindVertexArray(null)

  // ---------- Per-frame state ----------
  const projection = mat4()
  const view = mat4()
  const viewProjection = mat4()
  const model = mat4()
  let sun: Vec3 = normalize([1, 0.2, 0.4])
  let width = 0
  let height = 0
  let aspect = 1
  let fovY = 0

  const resize = () => {
    width = Math.max(1, Math.round(window.innerWidth * pixelRatio))
    height = Math.max(1, Math.round(window.innerHeight * pixelRatio))
    canvas.width = width
    canvas.height = height
    aspect = width / height
    // Landscape keeps a 40° view; portrait widens it so the coast isn't cropped to a sliver
    fovY = 2 * Math.atan(Math.max(Math.tan((20 * Math.PI) / 180), Math.tan((14 * Math.PI) / 180) / aspect))
  }
  resize()

  const halfFov = () => ({ x: Math.atan(Math.tan(fovY / 2) * aspect), y: fovY / 2 })

  const activate = ({ program, uniforms }: Program) => {
    gl.useProgram(program)
    return uniforms
  }

  /** Draws the planet alone (shared by the frame and the debug measurement) */
  const drawPlanet = (time: number, camera: Vec3, extras: { pulse?: number; debug?: number }) => {
    const u = activate(planet)
    gl.uniformMatrix4fv(u.uModel, false, globeMatrix(model, EARTH_TILT, SPIN_SPEED * time))
    gl.uniformMatrix4fv(u.uViewProjection, false, viewProjection)
    gl.uniform3f(u.uLocal, LOCAL_PATCH.west, LOCAL_PATCH.north, LOCAL_PATCH.size)
    gl.uniform2f(u.uRange, COAST_RANGE_KM[0], COAST_RANGE_KM[1])
    gl.uniform3fv(u.uSun, sun)
    gl.uniform3fv(u.uCamera, camera)
    gl.uniform3fv(u.uTarget, target)
    gl.uniform1f(u.uPulse, extras.pulse ?? -1)
    gl.uniform1f(u.uDebug, extras.debug ?? 0)
    gl.uniform1f(u.uLocalReady, localReady)
    gl.uniform3fv(u.uDeepSea, SEA.deep)
    gl.uniform3fv(u.uShelfSea, SEA.shelf)
    gl.uniform3fv(u.uShallowSea, SEA.shallow)
    gl.uniform3fv(u.uFoam, SEA.foam)
    const units: [string, WebGLTexture | null][] = [
      ['uColor', textures[0]],
      ['uCoast', textures[1]],
      ['uLights', textures[2]],
      ['uLocalColor', localTextures[0]],
      ['uLocalCoast', localTextures[1]],
    ]
    units.forEach(([name, texture], unit) => {
      gl.activeTexture(gl.TEXTURE0 + unit)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.uniform1i(u[name], unit)
    })
    gl.bindVertexArray(planetVao)
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0)
  }

  const setCamera = (pose: Pose) => {
    perspective(projection, fovY, aspect, 0.002, 200)
    lookAt(view, pose.position, pose.lookAt, pose.up)
    multiply(viewProjection, projection, view)
  }

  let lost = false
  canvas.addEventListener('webglcontextlost', () => (lost = true))
  // Only now, so the CSS starfield shows while everything loads instead of a blank canvas
  container.appendChild(canvas)

  return {
    canvas,
    /** Half the field of view, horizontally and vertically (radians) */
    halfFov,
    /** World-space direction of the beach at a given time (the planet keeps spinning) */
    targetDirection(time: number): Vec3 {
      return globeToWorld(target, SPIN_SPEED * time)
    },
    setSun(direction: Vec3) {
      sun = normalize(direction)
    },
    /** Upload the sharper patch around the beach (call after the first frame) */
    async loadLocal() {
      try {
        const [color, coast] = await localMaps
        localTextures[0] = createTexture(gl, color, { anisotropy })
        await new Promise((resolve) => setTimeout(resolve, 0))
        localTextures[1] = createTexture(gl, coast)
        localReady = 1
      } catch {
        // Without it the dive just uses the global map
      }
    },
    /**
     * extras.pulse: landing ring progress (0..1); extras.landingAt: when the landing cloud is over the beach;
     * extras.debug: draw the marker on the beach
     */
    render(time: number, pose: Pose, extras: { pulse?: number; landingAt?: number; debug?: boolean } = {}) {
      if (lost) return
      setCamera(pose)
      gl.viewport(0, 0, width, height)
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      // Sky and halo
      const forward = normalize(add(pose.lookAt, scale(pose.position, -1)))
      const right = normalize(cross(forward, pose.up))
      const up = cross(right, forward)
      gl.disable(gl.DEPTH_TEST)
      gl.disable(gl.BLEND)
      let u = activate(sky)
      gl.uniform3fv(u.uCamera, pose.position)
      gl.uniform3fv(u.uForward, forward)
      gl.uniform3fv(u.uRight, right)
      gl.uniform3fv(u.uUp, up)
      const half = halfFov()
      gl.uniform2f(u.uTan, Math.tan(half.x), Math.tan(half.y))
      gl.uniform3fv(u.uSun, sun)
      gl.bindVertexArray(skyVao)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // Stars (additive, behind everything)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE)
      u = activate(stars)
      gl.uniformMatrix4fv(u.uViewProjection, false, viewProjection)
      gl.uniform1f(u.uTime, time)
      gl.uniform1f(u.uPixelRatio, pixelRatio)
      gl.bindVertexArray(starVao)
      gl.drawArrays(gl.POINTS, 0, starCount)

      // Planet, clouds and craft
      gl.disable(gl.BLEND)
      gl.enable(gl.DEPTH_TEST)
      gl.depthMask(true)
      gl.enable(gl.CULL_FACE)
      drawPlanet(time, pose.position, { pulse: extras.pulse, debug: extras.debug ? 1 : 0 })

      u = activate(clouds)
      gl.uniformMatrix4fv(u.uViewProjection, false, viewProjection)
      gl.uniform3fv(u.uSun, sun)
      gl.uniform3fv(u.uCamera, pose.position)
      gl.uniformMatrix4fv(u.uModel, false, globeMatrix(model, EARTH_TILT, (SPIN_SPEED + CLOUD_DRIFT) * time))
      gl.bindVertexArray(layerVao)
      gl.drawArraysInstanced(gl.TRIANGLES, 0, puff.length / 6, layer.length / 4)
      if (!extras.debug) {
        const late = time - (extras.landingAt ?? time)
        gl.uniformMatrix4fv(u.uModel, false, globeMatrix(model, EARTH_TILT, SPIN_SPEED * time + LANDING_DRIFT * late))
        gl.bindVertexArray(landingVao)
        gl.drawArraysInstanced(gl.TRIANGLES, 0, finePuff.length / 6, landing.length / 4)
      }

      // Satellites only while the camera is well outside their orbits
      const distance = Math.hypot(...pose.position)
      if (distance > 2.1) {
        u = activate(craft)
        gl.uniformMatrix4fv(u.uViewProjection, false, viewProjection)
        gl.uniform3fv(u.uSun, sun)
        orbits.forEach((orbit, index) => {
          const frame = orbitFrame(orbit, time)
          gl.uniformMatrix4fv(u.uModel, false, basisMatrix(model, frame.x, frame.y, frame.z, frame.position))
          gl.bindVertexArray(craftMeshes[index].vao)
          gl.drawArrays(gl.TRIANGLES, 0, craftMeshes[index].count)
          const light = add(
            frame.position,
            add(add(scale(frame.x, orbit.beacon[0]), scale(frame.y, orbit.beacon[1])), scale(frame.z, orbit.beacon[2])),
          )
          // A short blink every ~1.6 s, each craft out of step with the others
          const blink = (time * 0.62 + orbit.phase) % 1 < 0.1 ? 1 : 0.1
          beaconData.set([...light, ...orbit.color, blink], index * 7)
        })
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.ONE, gl.ONE)
        gl.depthMask(false)
        u = activate(beacons)
        gl.uniformMatrix4fv(u.uViewProjection, false, viewProjection)
        gl.uniform1f(u.uPixelRatio, pixelRatio)
        gl.bindBuffer(gl.ARRAY_BUFFER, beaconBuffer)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, beaconData)
        gl.bindVertexArray(beaconVao)
        gl.drawArrays(gl.POINTS, 0, orbits.length)
        gl.depthMask(true)
      }
      gl.disable(gl.CULL_FACE)
      gl.bindVertexArray(null)
    },
    /**
     * Debug: where the beach lands on screen, two ways. `projected` runs the target's lat/long through the
     * camera maths on the CPU; `drawn` is the centroid of the marker the planet shader paints from its own
     * per-pixel lat/long (both in CSS pixels). `coastKm` is the coastline distance the map shows under it.
     */
    measureLanding(time: number, pose: Pose) {
      setCamera(pose)
      const clip = project(viewProjection, globeToWorld(target, SPIN_SPEED * time))
      const projected = { x: ((clip.x + 1) / 2) * window.innerWidth, y: ((1 - clip.y) / 2) * window.innerHeight }

      const framebuffer = gl.createFramebuffer()
      const color = gl.createRenderbuffer()
      gl.bindRenderbuffer(gl.RENDERBUFFER, color)
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA8, width, height)
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, color)
      gl.viewport(0, 0, width, height)
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.disable(gl.DEPTH_TEST)
      gl.disable(gl.BLEND)
      gl.enable(gl.CULL_FACE)
      drawPlanet(time, pose.position, { debug: 2 })
      const pixels = new Uint8Array(width * height * 4)
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.deleteFramebuffer(framebuffer)
      gl.deleteRenderbuffer(color)
      gl.disable(gl.CULL_FACE)

      let sumX = 0
      let sumY = 0
      let sumCoast = 0
      let count = 0
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (pixels[(y * width + x) * 4] > 127) {
            sumX += x + 0.5
            sumY += height - y - 0.5
            sumCoast += pixels[(y * width + x) * 4 + 1]
            count++
          }
        }
      }
      const drawn = count ? { x: sumX / count / pixelRatio, y: sumY / count / pixelRatio } : null
      // How far the rendered map puts the beach from its coastline (km, positive inland)
      const coastKm = count ? (sumCoast / count / 255 - 0.5) * 120 : null
      return { projected, drawn, coastKm, markerPixels: count, center: { x: window.innerWidth / 2, y: window.innerHeight / 2 } }
    },
    resize,
    onContextLost(callback: () => void) {
      canvas.addEventListener('webglcontextlost', callback, { once: true })
    },
    /** Free the GPU memory and the context itself */
    dispose() {
      for (const texture of [...textures, ...localTextures, blank]) gl.deleteTexture(texture)
      for (const item of buffers) gl.deleteBuffer(item)
      for (const item of vaos) gl.deleteVertexArray(item)
      for (const { program } of programs) gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.width = canvas.height = 1
      canvas.remove()
    },
  }
}

export type Globe = Awaited<ReturnType<typeof createGlobe>>
