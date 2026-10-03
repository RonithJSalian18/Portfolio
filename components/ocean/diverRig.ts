/**
 * The diver's skeleton and the small physics that move it. All coordinates are in the artwork's viewBox
 * units (240 × 120, facing right); angles are SVG degrees (clockwise, 0 = pointing right).
 */

export type Point = [number, number]

/** Where the joints sit in the artwork (see DiverFigure) */
export const RIG = {
  /** The body pitches about its middle */
  center: [128, 62] as Point,
  hipNear: [96, 67] as Point,
  hipFar: [98, 62] as Point,
  shoulderNear: [152, 65] as Point,
  shoulderFar: [150, 59] as Point,
  neck: [165, 60] as Point,
  upperArm: 21,
  forearm: 19,
  /** In the head's frame (relative to the neck) */
  eye: [24, -5] as Point,
  lamp: [22.5, -14.7] as Point,
  exhaust: [27, 15] as Point,
}

/** A damped spring: call step() every frame; never linear, and it settles without snapping */
export class Spring {
  value: number
  velocity = 0
  constructor(
    initial: number,
    public stiffness: number,
    public damping: number,
  ) {
    this.value = initial
  }
  step(target: number, dt: number) {
    const acceleration = this.stiffness * (target - this.value) - this.damping * this.velocity
    this.velocity += acceleration * dt
    this.value += this.velocity * dt
    return this.value
  }
}

/** A spring for 2D points (the hands) */
export class Spring2 {
  x: Spring
  y: Spring
  constructor([x, y]: Point, stiffness: number, damping: number) {
    this.x = new Spring(x, stiffness, damping)
    this.y = new Spring(y, stiffness, damping)
  }
  step([x, y]: Point, dt: number): Point {
    return [this.x.step(x, dt), this.y.step(y, dt)]
  }
}

const DEGREES = 180 / Math.PI

/**
 * Two-bone IK: shoulder and elbow angles that put the wrist on `target`, elbow bent toward the diver's
 * belly (down) when `bendDown`. Out-of-reach targets get a straight arm pointing at them.
 */
export function reach(shoulder: Point, target: Point, upper: number, lower: number, bendDown = true) {
  const dx = target[0] - shoulder[0]
  const dy = target[1] - shoulder[1]
  const distance = Math.min(Math.hypot(dx, dy), upper + lower - 0.001)
  const toTarget = Math.atan2(dy, dx)
  // Law of cosines for the angle at the shoulder and at the elbow
  const atShoulder = Math.acos(Math.min(1, Math.max(-1, (upper ** 2 + distance ** 2 - lower ** 2) / (2 * upper * distance))))
  const atElbow = Math.acos(Math.min(1, Math.max(-1, (upper ** 2 + lower ** 2 - distance ** 2) / (2 * upper * lower))))
  // Positive angles turn clockwise (down, since SVG's y points down): +shoulder, −elbow keeps the elbow below
  const sign = bendDown ? 1 : -1
  return {
    shoulder: (toTarget + sign * atShoulder) * DEGREES,
    elbow: -sign * (Math.PI - atElbow) * DEGREES,
  }
}

/** Rotate a point about a pivot by SVG degrees */
export function rotateAbout([x, y]: Point, [px, py]: Point, degrees: number): Point {
  const radians = degrees / DEGREES
  const c = Math.cos(radians)
  const s = Math.sin(radians)
  return [px + (x - px) * c - (y - py) * s, py + (x - px) * s + (y - py) * c]
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
