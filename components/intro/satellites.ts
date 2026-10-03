import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Sprite,
  SpriteMaterial,
  type Object3D,
} from 'three'

// Small low-poly satellites built from primitives. Sizes are in Earth radii: deliberately tiny so they
// read as distant craft rather than toys.

interface Orbit {
  kind: 'station' | 'probe'
  radius: number
  inclination: number
  node: number
  /** radians per second */
  speed: number
  phase: number
}

const ORBITS: Orbit[] = [
  { kind: 'station', radius: 1.42, inclination: 0.85, node: 0.3, speed: 0.2, phase: 0.6 },
  { kind: 'probe', radius: 1.27, inclination: -0.55, node: 1.7, speed: 0.32, phase: 2.1 },
  { kind: 'probe', radius: 1.63, inclination: 1.2, node: 3.1, speed: 0.15, phase: 4.3 },
  { kind: 'probe', radius: 1.86, inclination: 0.28, node: 4.6, speed: 0.11, phase: 1.2 },
]

function glowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const context = canvas.getContext('2d')!
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.25, 'rgba(255,255,255,0.6)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 64, 64)
  return new CanvasTexture(canvas)
}

export function createSatellites(lite: boolean) {
  const metal = new MeshStandardMaterial({ color: '#cfd5de', metalness: 0.75, roughness: 0.35 })
  const foil = new MeshStandardMaterial({ color: '#d8a33f', metalness: 0.9, roughness: 0.32 })
  const panel = new MeshStandardMaterial({
    color: '#1d3b82',
    metalness: 0.45,
    roughness: 0.28,
    emissive: '#06122c',
    emissiveIntensity: 0.8,
  })
  const white = new MeshStandardMaterial({ color: '#eef2f6', metalness: 0.2, roughness: 0.6 })
  const glow = glowTexture()

  const disposables: { dispose(): void }[] = [metal, foil, panel, white, glow]
  const box = (w: number, h: number, d: number) => {
    const geometry = new BoxGeometry(w, h, d)
    disposables.push(geometry)
    return geometry
  }
  const cylinder = (rTop: number, rBottom: number, length: number) => {
    const geometry = new CylinderGeometry(rTop, rBottom, length, 10)
    disposables.push(geometry)
    return geometry
  }

  const beacon = (color: string, size: number) => {
    const material = new SpriteMaterial({
      map: glow,
      color,
      blending: AdditiveBlending,
      depthWrite: false,
      transparent: true,
    })
    disposables.push(material)
    const sprite = new Sprite(material)
    sprite.scale.setScalar(size)
    return sprite
  }

  function probe(): { craft: Group; light: Sprite } {
    const craft = new Group()
    craft.add(new Mesh(box(0.014, 0.014, 0.022), foil))
    for (const side of [-1, 1]) {
      const wing = new Mesh(box(0.05, 0.001, 0.016), panel)
      wing.position.x = side * 0.034
      craft.add(wing)
      const strut = new Mesh(box(0.01, 0.0015, 0.0015), metal)
      strut.position.x = side * 0.009
      craft.add(strut)
    }
    const dish = new Mesh(cylinder(0.008, 0.0015, 0.004), metal)
    dish.position.y = 0.01
    craft.add(dish)
    const light = beacon('#ff5a46', 0.018)
    light.position.set(0, -0.009, 0.012)
    craft.add(light)
    return { craft, light }
  }

  function station(): { craft: Group; light: Sprite } {
    const craft = new Group()
    craft.add(new Mesh(box(0.16, 0.005, 0.005), metal)) // main truss
    for (const x of [-0.072, -0.046, 0.046, 0.072]) {
      for (const z of [-1, 1]) {
        const array = new Mesh(box(0.017, 0.001, 0.056), panel)
        array.position.set(x, 0, z * 0.033)
        craft.add(array)
      }
    }
    for (const [z, length] of [
      [0, 0.05],
      [0.03, 0.022],
    ] as const) {
      const hull = new Mesh(cylinder(0.0065, 0.0065, length), white)
      hull.rotation.x = Math.PI / 2
      hull.position.z = z
      craft.add(hull)
    }
    for (const x of [-0.02, 0.02]) {
      const radiator = new Mesh(box(0.008, 0.012, 0.0008), white)
      radiator.position.set(x, 0.008, -0.012)
      craft.add(radiator)
    }
    const light = beacon('#ffffff', 0.024)
    light.position.set(0, 0.006, 0.026)
    craft.add(light)
    return { craft, light }
  }

  const root = new Group()
  const orbits = (lite ? ORBITS.slice(0, 2) : ORBITS).map((orbit) => {
    // pivot sets the orbital plane, spinner moves the craft along it
    const pivot = new Group()
    pivot.rotation.order = 'YXZ'
    pivot.rotation.y = orbit.node
    pivot.rotation.x = orbit.inclination
    const spinner = new Group()
    const { craft, light } = orbit.kind === 'station' ? station() : probe()
    craft.position.x = orbit.radius
    craft.rotation.y = Math.PI / 2 // fly along the orbit
    spinner.add(craft)
    pivot.add(spinner)
    root.add(pivot)
    return { orbit, spinner, craft, light }
  })

  return {
    root: root as Object3D,
    update(time: number) {
      for (const { orbit, spinner, craft, light } of orbits) {
        spinner.rotation.y = orbit.phase + orbit.speed * time
        craft.rotation.z = Math.sin(time * 0.3 + orbit.phase) * 0.15
        // Short blink roughly every 1.6 s, each craft out of step with the others
        const blink = (time * 0.62 + orbit.phase) % 1
        light.material.opacity = blink < 0.1 ? 1 : 0.12
      }
    },
    dispose() {
      for (const item of disposables) item.dispose()
    },
  }
}
