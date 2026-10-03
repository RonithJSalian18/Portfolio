import {
  AdditiveBlending,
  AmbientLight,
  BackSide,
  BufferGeometry,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  Mesh,
  NoColorSpace,
  PerspectiveCamera,
  Points,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  WebGLRenderer,
  type Texture,
} from 'three'
import { createCloudSprites } from './cloudSprites'
import { createSatellites } from './satellites'
import {
  atmosphereFragment,
  cloudFragment,
  earthFragment,
  earthVertex,
  starFragment,
  starVertex,
  surfaceVertex,
} from './shaders'

/** Axial tilt, purely for a more dramatic composition */
const EARTH_TILT = 0.41
/** Planet spin in radians per second (always running) */
export const SPIN_SPEED = 0.05
/** Clouds drift a bit faster than the ground under them */
const CLOUD_DRIFT = 0.012

/** Where earth-detail-*.webp sits on the globe (texture u/v): a 16° square centred on the beach */
const DETAIL_BOUNDS = [0.685475, 0.729919, 0.528333, 0.617222]

const Z_AXIS = new Vector3(0, 0, 1)
const Y_AXIS = new Vector3(0, 1, 0)

export interface CameraPose {
  position: Vector3
  lookAt: Vector3
  up: Vector3
}

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Point on the unit sphere for a latitude/longitude, in the globe's own (unrotated) space */
function surfacePoint(lat: number, lng: number, out: Vector3) {
  const phi = (lat * Math.PI) / 180
  const lambda = (lng * Math.PI) / 180
  // three's SphereGeometry puts longitude 0 on +X and longitude +90° on -Z
  return out.set(Math.cos(phi) * Math.cos(lambda), Math.sin(phi), -Math.cos(phi) * Math.sin(lambda))
}

export async function createEarthScene(
  container: HTMLElement,
  options: { lite: boolean; target: { lat: number; lng: number } },
) {
  const { lite } = options
  // Throws if WebGL isn't available, or would only run in software (no GPU): a CPU-rendered globe would
  // be janky, so the caller skips the intro in both cases
  const renderer = new WebGLRenderer({
    antialias: !lite,
    powerPreference: 'high-performance',
    failIfMajorPerformanceCaveat: true,
  })
  const debugInfo = renderer.getContext().getExtension('WEBGL_debug_renderer_info')
  const gpu = debugInfo ? String(renderer.getContext().getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)) : ''
  if (/swiftshader|llvmpipe|software/i.test(gpu)) {
    renderer.dispose()
    throw new Error('Software WebGL: skipping the intro')
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor('#02040a', 1)
  container.appendChild(renderer.domElement)

  const loader = new TextureLoader()
  const anisotropy = Math.min(lite ? 2 : 8, renderer.capabilities.getMaxAnisotropy())
  const load = async (name: string, color: boolean) => {
    const texture = await loader.loadAsync(`/intro/${name}`)
    // Decode off the main thread now, rather than synchronously during the first upload
    await (texture.image as HTMLImageElement).decode?.().catch(() => {})
    texture.colorSpace = color ? SRGBColorSpace : NoColorSpace
    texture.anisotropy = anisotropy
    return texture
  }

  let textures: Texture[]
  try {
    textures = await Promise.all([
      load(lite ? 'earth-day-2048.webp' : 'earth-day-4096.webp', true),
      load(lite ? 'earth-night-1024.webp' : 'earth-night-2048.webp', true),
      load(lite ? 'earth-clouds-1024.webp' : 'earth-clouds-2048.webp', false),
      load(lite ? 'earth-bump-1024.webp' : 'earth-bump-2048.webp', false),
      load('earth-ocean-1024.webp', false),
    ])
  } catch (error) {
    renderer.dispose()
    renderer.domElement.remove()
    throw error
  }
  const [day, night, clouds, bump, ocean] = textures
  clouds.wrapS = RepeatWrapping

  const scene = new Scene()
  const camera = new PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.005, 400)
  scene.add(camera)

  const sunDirection = new Vector3(1, 0.2, 0.4).normalize()
  const sunLight = new DirectionalLight('#ffffff', 3)
  scene.add(sunLight, new AmbientLight('#9db8ff', 0.3))

  // tilt (fixed) → spin (continuous) → planet and clouds
  const tilt = new Group()
  tilt.rotation.z = EARTH_TILT
  const spin = new Group()
  tilt.add(spin)
  scene.add(tilt)
  const axis = Y_AXIS.clone().applyAxisAngle(Z_AXIS, EARTH_TILT)

  const segments = lite ? 72 : 128
  const geometries: BufferGeometry[] = [
    new SphereGeometry(1, segments, segments),
    new SphereGeometry(1.006, segments, segments),
    new SphereGeometry(1.035, 64, 64),
  ]

  const earthMaterial = new ShaderMaterial({
    uniforms: {
      dayMap: { value: day },
      nightMap: { value: night },
      bumpMap: { value: bump },
      oceanMap: { value: ocean },
      cloudMap: { value: clouds },
      detailMap: { value: null as Texture | null },
      detailBounds: { value: DETAIL_BOUNDS },
      detailMix: { value: 0 },
      sunDirection: { value: sunDirection },
      bumpScale: { value: lite ? 1.4 : 1.8 },
      // Sample the elevation 1.5 texels apart (texture sizes are fixed by the file names above)
      bumpTexel: { value: lite ? [1.5 / 1024, 1.5 / 512] : [1.5 / 2048, 1.5 / 1024] },
      cloudOffset: { value: 0 },
      nightAmbient: { value: 0.03 },
    },
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
  })
  spin.add(new Mesh(geometries[0], earthMaterial))

  const cloudMaterial = new ShaderMaterial({
    uniforms: { cloudMap: { value: clouds }, sunDirection: { value: sunDirection }, opacity: { value: 1 } },
    vertexShader: surfaceVertex,
    fragmentShader: cloudFragment,
    transparent: true,
    depthWrite: false,
  })
  const cloudLayer = new Mesh(geometries[1], cloudMaterial)
  spin.add(cloudLayer)

  const atmosphereMaterial = new ShaderMaterial({
    uniforms: { sunDirection: { value: sunDirection }, glowColor: { value: new Color('#4f9bff') } },
    vertexShader: surfaceVertex,
    fragmentShader: atmosphereFragment,
    side: BackSide,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  })
  scene.add(new Mesh(geometries[2], atmosphereMaterial))

  // Two star shells at different distances, so they parallax against each other as the camera moves
  const starMaterials: ShaderMaterial[] = []
  const starLayer = (count: number, radius: number, minSize: number, maxSize: number, seed: number) => {
    const random = mulberry32(seed)
    const positions: number[] = []
    const sizes: number[] = []
    const phases: number[] = []
    for (let i = 0; i < count; i++) {
      const u = random() * 2 - 1
      const theta = random() * Math.PI * 2
      const r = radius * (0.9 + random() * 0.2)
      const s = Math.sqrt(1 - u * u)
      positions.push(r * s * Math.cos(theta), r * u, r * s * Math.sin(theta))
      sizes.push(minSize + (maxSize - minSize) * random() ** 3)
      phases.push(random())
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1))
    geometry.setAttribute('phase', new Float32BufferAttribute(phases, 1))
    geometries.push(geometry)
    const material = new ShaderMaterial({
      uniforms: { time: { value: 0 }, pixelRatio: { value: renderer.getPixelRatio() } },
      vertexShader: starVertex,
      fragmentShader: starFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    starMaterials.push(material)
    const points = new Points(geometry, material)
    scene.add(points)
    return points
  }
  const nearStars = starLayer(lite ? 260 : 700, 40, 1.3, 3.4, 7)
  const farStars = starLayer(lite ? 700 : 1900, 110, 0.8, 2.2, 11)

  const satellites = createSatellites(lite)
  scene.add(satellites.root)

  const cloudSprites = createCloudSprites(camera, lite)
  let detail: Texture | null = null
  let lastTime = 0

  const target = surfacePoint(options.target.lat, options.target.lng, new Vector3())

  // Compile every shader up front (in parallel where the browser supports it) instead of mid-frame,
  // then upload the textures one per task so no single task blocks the page for long
  await renderer.compileAsync(scene, camera).catch(() => {})
  for (const texture of textures) {
    renderer.initTexture(texture)
    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  return {
    /** The planet's north axis in world space */
    axis,
    camera,
    /** World-space direction of the target location at a given time (the planet keeps spinning) */
    targetDirection(time: number, out: Vector3) {
      return out
        .copy(target)
        .applyAxisAngle(Y_AXIS, SPIN_SPEED * time)
        .applyAxisAngle(Z_AXIS, EARTH_TILT)
    },
    setSun(direction: Vector3) {
      sunDirection.copy(direction).normalize()
      sunLight.position.copy(sunDirection).multiplyScalar(10)
    },
    /** Night landing: a touch more moonlight on the dark side and grey-blue clouds */
    setNight(night: boolean) {
      earthMaterial.uniforms.nightAmbient.value = night ? 0.06 : 0.03
      cloudSprites.setNight(night)
    },
    /** Fetch the high-resolution patch around the beach; it's only needed late in the dive */
    async loadDetail() {
      try {
        detail = await load(lite ? 'earth-detail-1024.webp' : 'earth-detail-2048.webp', true)
        earthMaterial.uniforms.detailMap.value = detail
      } catch {
        // Without it the dive just uses the global map
      }
    },
    /** extras.detail: how much of the sharp patch to show; extras.clouds: cloud fly-through amount */
    render(time: number, pose: CameraPose, extras: { detail?: number; clouds?: number } = {}) {
      const delta = Math.min(0.1, Math.max(0, time - lastTime))
      lastTime = time
      earthMaterial.uniforms.detailMix.value = detail ? (extras.detail ?? 0) : 0
      // The global cloud map turns to mush up close; thin it out and let the fly-through puffs take over
      const altitude = pose.position.length()
      cloudMaterial.uniforms.opacity.value = 0.25 + 0.75 * Math.min(1, Math.max(0, (altitude - 1.3) / 0.5))
      cloudSprites.update(delta, extras.clouds ?? 0)
      spin.rotation.y = SPIN_SPEED * time
      cloudLayer.rotation.y = CLOUD_DRIFT * time
      // Cloud shadows on the ground follow the cloud layer
      earthMaterial.uniforms.cloudOffset.value = -(CLOUD_DRIFT * time) / (Math.PI * 2)
      nearStars.rotation.y = time * 0.004
      farStars.rotation.y = time * 0.0015
      for (const material of starMaterials) material.uniforms.time.value = time
      satellites.update(time)

      camera.position.copy(pose.position)
      camera.up.copy(pose.up)
      camera.lookAt(pose.lookAt)
      renderer.render(scene, camera)
    },
    resize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    },
    onContextLost(callback: () => void) {
      renderer.domElement.addEventListener('webglcontextlost', callback, { once: true })
    },
    dispose() {
      for (const texture of textures) texture.dispose()
      detail?.dispose()
      cloudSprites.dispose()
      for (const geometry of geometries) geometry.dispose()
      for (const material of [earthMaterial, cloudMaterial, atmosphereMaterial, ...starMaterials]) material.dispose()
      satellites.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}

export type EarthScene = Awaited<ReturnType<typeof createEarthScene>>
