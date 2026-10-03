/**
 * Shared geometry for the intro globe. The camera path, the landing cloud and the debug check all place
 * things with these functions, and the planet shader turns pixels back into latitude/longitude with the
 * exact inverse (see `globeUv` in shaders.ts), so the map and the landing target can't disagree.
 *
 * Globe frame: the planet's own axes before it spins. Longitude 0 is on +X, 90°E on −Z, north is +Y.
 * World frame: the globe spun about its axis (eastward, like the real Earth), then tilted about Z.
 */

export type Vec3 = [number, number, number]

const DEGREES = Math.PI / 180

/** Axial tilt of the whole globe, purely for a more dramatic composition */
export const EARTH_TILT = 0.41
/** Planet spin, radians per second (always running) */
export const SPIN_SPEED = 0.05
/** The cloud layer turns a little faster than the ground under it */
export const CLOUD_DRIFT = 0.016

export function latLngToVector(lat: number, lng: number): Vec3 {
  const phi = lat * DEGREES
  const lambda = lng * DEGREES
  return [Math.cos(phi) * Math.cos(lambda), Math.sin(phi), -Math.cos(phi) * Math.sin(lambda)]
}

export function vectorToLatLng([x, y, z]: Vec3) {
  const length = Math.hypot(x, y, z)
  return { lat: Math.asin(y / length) / DEGREES, lng: Math.atan2(-z, x) / DEGREES }
}

/** Rotation about +Y (eastward spin for positive angles) */
export function rotateY([x, y, z]: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return [x * c + z * s, y, -x * s + z * c]
}

/** Rotation about +Z (the tilt) */
export function rotateZ([x, y, z]: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return [x * c - y * s, x * s + y * c, z]
}

/** Globe frame → world frame after `spin` radians of rotation */
export const globeToWorld = (point: Vec3, spin: number): Vec3 => rotateZ(rotateY(point, spin), EARTH_TILT)

/** The planet's north axis in world space */
export const NORTH_AXIS: Vec3 = rotateZ([0, 1, 0], EARTH_TILT)

// ---------- Small vector helpers ----------

export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s]
export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
export const normalize = (a: Vec3): Vec3 => scale(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))
export const mix = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

/** Rotate `point` about a unit `axis` (Rodrigues) */
export function rotateAbout(point: Vec3, axis: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return add(add(scale(point, c), scale(cross(axis, point), s)), scale(axis, dot(axis, point) * (1 - c)))
}

/** Spherical interpolation between two unit vectors */
export function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const cosine = Math.min(1, Math.max(-1, dot(a, b)))
  const angle = Math.acos(cosine)
  if (angle < 1e-5) return mix(a, b, t)
  const s = Math.sin(angle)
  return add(scale(a, Math.sin((1 - t) * angle) / s), scale(b, Math.sin(t * angle) / s))
}
