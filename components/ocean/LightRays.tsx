import type { CSSProperties } from 'react'

// [left %, width %, angle deg, sway seconds]
const RAYS: [number, number, number, number][] = [
  [8, 7, 14, 9],
  [24, 11, 9, 11],
  [43, 6, 16, 8],
  [61, 10, 8, 12],
  [80, 8, 13, 10],
]

/** Shafts of sunlight slanting down from the surface (faint at night via --ray-strength) */
export function LightRays() {
  return (
    <div className="light-rays" aria-hidden="true">
      {RAYS.map(([x, width, angle, time]) => (
        <span
          key={x}
          style={{ '--x': `${x}%`, '--w': `${width}%`, '--r': `${angle}deg`, '--t': `${time}s` } as CSSProperties}
        />
      ))}
    </div>
  )
}
