import { CanvasTexture, Color, Sprite, SpriteMaterial, type Camera } from 'three'

// Soft cloud puffs that stream toward the camera at the end of the dive, so it feels like flying
// through a cloud deck. Puffs are drawn procedurally; nothing to download.

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function puffTexture(seed: number) {
  const random = mulberry32(seed)
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const context = canvas.getContext('2d')!
  for (let i = 0; i < 26; i++) {
    const angle = random() * Math.PI * 2
    const distance = random() * 64
    const x = size / 2 + Math.cos(angle) * distance
    const y = size / 2 + Math.sin(angle) * distance * 0.7
    const radius = 34 + random() * 50
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, `rgba(255,255,255,${0.16 + random() * 0.2})`)
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
  }
  // Fade the whole puff toward its edges so sprites never show a square outline
  context.globalCompositeOperation = 'destination-in'
  const mask = context.createRadialGradient(size / 2, size / 2, size * 0.15, size / 2, size / 2, size / 2)
  mask.addColorStop(0, 'rgba(0,0,0,1)')
  mask.addColorStop(1, 'rgba(0,0,0,0)')
  context.fillStyle = mask
  context.fillRect(0, 0, size, size)
  return new CanvasTexture(canvas)
}

interface Puff {
  sprite: Sprite
  x: number
  y: number
  z: number
  size: number
}

const FAR = -4.2
const NEAR = -0.3

export function createCloudSprites(camera: Camera, lite: boolean) {
  const random = mulberry32(42)
  const textures = [puffTexture(3), puffTexture(9), puffTexture(27)]
  const tint = new Color('#ffffff')
  const puffs: Puff[] = []

  const place = (puff: Puff, z: number) => {
    puff.z = z
    // Spread puffs across (and beyond) the view; as they approach they slide out past the edges
    puff.x = (random() * 2 - 1) * 1.5
    puff.y = (random() * 2 - 1) * 1.0
    puff.size = 1 + random() * 1.6
  }

  const count = lite ? 12 : 22
  for (let i = 0; i < count; i++) {
    const material = new SpriteMaterial({
      map: textures[i % textures.length],
      color: tint,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      opacity: 0,
    })
    const sprite = new Sprite(material)
    sprite.renderOrder = 10
    sprite.visible = false
    camera.add(sprite)
    const puff: Puff = { sprite, x: 0, y: 0, z: 0, size: 1 }
    place(puff, FAR + (NEAR - FAR) * (i / count))
    puffs.push(puff)
  }

  return {
    /** Moonlit (grey-blue) instead of sunlit puffs */
    setNight(night: boolean) {
      tint.set(night ? '#7f8fa9' : '#ffffff')
      for (const { sprite } of puffs) sprite.material.color.copy(tint)
    },
    /** amount: 0 (none) to 1 (flying through the thick of it) */
    update(deltaSeconds: number, amount: number) {
      const speed = 1.4 + amount * 3.6
      for (const puff of puffs) {
        puff.sprite.visible = amount > 0
        if (amount <= 0) continue
        puff.z += deltaSeconds * speed
        if (puff.z > NEAR) place(puff, FAR)
        const fadeIn = Math.min(1, (puff.z - FAR) / 1.1)
        const fadeOut = Math.min(1, (NEAR - puff.z) / 0.6)
        puff.sprite.material.opacity = amount * 0.85 * Math.max(0, Math.min(fadeIn, fadeOut))
        puff.sprite.position.set(puff.x, puff.y, puff.z)
        puff.sprite.scale.setScalar(puff.size)
      }
    },
    dispose() {
      for (const { sprite } of puffs) {
        sprite.material.dispose()
        sprite.removeFromParent()
      }
      for (const texture of textures) texture.dispose()
    },
  }
}
