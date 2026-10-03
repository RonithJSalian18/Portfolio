import type { CSSProperties } from 'react'
import { DiveProgress } from './DiveProgress'
import { LightRays } from './LightRays'

// Deterministic bubble layout (left %, size px, duration s, delay s)
const BUBBLES: [number, number, number, number][] = [
  [8, 10, 6.5, 0],
  [15, 6, 5.2, 1.1],
  [22, 14, 7.4, 0.4],
  [31, 8, 5.8, 2.2],
  [38, 5, 4.6, 0.9],
  [46, 12, 6.9, 1.7],
  [53, 7, 5.4, 0.2],
  [61, 16, 8.1, 1.3],
  [68, 6, 5, 2.6],
  [74, 10, 6.2, 0.6],
  [82, 8, 5.6, 1.9],
  [89, 13, 7.2, 0.3],
  [94, 6, 4.8, 2.1],
]

/** Scrolling past the beach pulls the view under the water surface, into the shallow reef. */
export function DiveTransition() {
  return (
    <div className="dive" aria-hidden="true">
      <div className="dive-view">
        <div className="dive-above">
          <div className="dive-glints" />
          <div className="dive-shoreline" />
        </div>
        <div className="dive-below">
          <LightRays />
          <div className="dive-bubbles">
            {BUBBLES.map(([x, size, duration, delay]) => (
              <span
                key={x}
                className="bubble"
                style={{ '--x': `${x}%`, '--s': `${size}px`, '--d': `${duration}s`, '--delay': `${delay}s` } as CSSProperties}
              />
            ))}
          </div>
        </div>
        <div className="dive-surface" />
      </div>
      <DiveProgress />
    </div>
  )
}
