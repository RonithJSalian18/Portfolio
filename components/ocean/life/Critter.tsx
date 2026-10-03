import type { CSSProperties, ReactNode } from 'react'

export type Mode = 'swim-right' | 'swim-left' | 'scroll-right' | 'scroll-left' | 'drift'

interface CritterProps {
  /** Which text-free band of the zone it lives in (set as --lane-N by ZoneLife) */
  lane: number
  /** Vertical offset from the lane's centre line (any CSS length) */
  dy?: string
  /** Width; the artwork keeps its aspect ratio */
  w: string
  mode: Mode
  /** Seconds to cross the screen (swim modes) or one drift cycle */
  dur?: number
  /** How far into its loop it starts, in seconds */
  delay?: number
  /** Where it rests when motion is reduced */
  restX?: string
  /** Bob height in px */
  bob?: number
  bobDur?: number
  /** Dolphin-style arcing instead of bobbing */
  arc?: boolean
  /** Scatters a little from the mouse */
  flee?: boolean
  /** Bioluminescent: never dimmed at night */
  glows?: boolean
  /** Skipped on phones and low-end devices */
  extra?: boolean
  /** Lives in the side margin (wide screens only) instead of crossing the screen */
  gutter?: 'left' | 'right'
  className?: string
  children: ReactNode
}

export function Critter({
  lane,
  dy = '0px',
  w,
  mode,
  dur,
  delay = 0,
  restX,
  bob,
  bobDur,
  arc,
  flee,
  glows,
  extra,
  gutter,
  className,
  children,
}: CritterProps) {
  const facesLeft = mode === 'swim-left' || mode === 'scroll-left'
  const classes = ['critter', mode, facesLeft && 'left', gutter && `gutter gutter-${gutter}`, glows && 'glows', className]
    .filter(Boolean)
    .join(' ')
  const style = {
    '--top': `calc(var(--lane-${lane}) + ${dy})`,
    '--w': w,
    '--dur': dur ? `${dur}s` : undefined,
    '--delay': `${-delay}s`,
    '--rest-x': restX,
    '--bob': bob !== undefined ? `${bob}px` : undefined,
    '--bob-dur': bobDur ? `${bobDur}s` : undefined,
    '--bob-delay': `${-(delay % 5)}s`,
  } as CSSProperties

  return (
    <div className={classes} style={style} data-extra={extra || undefined}>
      <div className={arc ? 'arc' : 'bob'}>
        <div className={flee ? 'flee' : undefined}>{children}</div>
      </div>
    </div>
  )
}

/** Drifting specks (and glowing plankton at night), pinned to the viewport while the zone is on screen */
export function Ambient({ caustics = false }: { caustics?: boolean }) {
  return (
    <div className="life-sticky">
      {caustics && (
        <div className="caustics-wrap">
          <div className="caustics" />
          <div className="caustics caustics-b" data-extra />
        </div>
      )}
      <div className="snow" />
      <div className="snow snow-far" data-extra />
      <div className="plankton" />
    </div>
  )
}

/** Rising bubbles that pop after a short climb (so they never drift across text) */
export function Bubbles({ items }: { items: [x: string, bottom: string, size: number, duration: number, delay: number][] }) {
  return (
    <>
      {items.map(([x, bottom, size, duration, delay]) => (
        <span
          key={`${x}-${bottom}-${delay}`}
          className="bubble-short"
          style={{ '--x': x, '--b': bottom, '--s': `${size}px`, '--d': `${duration}s`, '--delay': `${-delay}s` } as CSSProperties}
        />
      ))}
    </>
  )
}
