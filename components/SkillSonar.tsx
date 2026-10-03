'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'

export interface SonarUse {
  label: string
  href: string
}

export interface SonarSkill {
  name: string
  uses: SonarUse[]
}

export interface SonarGroup {
  id: string
  name: string
  skills: SonarSkill[]
}

/** Blip distance from the center (share of the screen radius), cycled so neighbours sit on different rings */
const RINGS = [0.72, 0.42, 0.88, 0.57, 0.3, 0.8, 0.5, 0.65]
/** Degrees kept clear either side of a sector line */
const EDGE = 7
/** The screen's radius as a share of the scope's (the rest is the bezel) */
const SCREEN = 0.86
/** How long the mouse has to rest on a skill before the scope locks on, so sweeping across doesn't count */
const DWELL_MS = 110

interface Blip {
  skill: SonarSkill
  group: SonarGroup
  sector: number
  /** Clockwise from twelve o'clock, like the sweep */
  angle: number
  reach: number
  x: number
  y: number
}

function plot(groups: SonarGroup[]): Blip[] {
  const span = 360 / groups.length
  return groups.flatMap((group, sector) =>
    group.skills.map((skill, index) => {
      const angle = sector * span + EDGE + ((span - 2 * EDGE) * (index + 0.5)) / group.skills.length
      const reach = RINGS[(index + sector * 3) % RINGS.length]
      const radians = (angle * Math.PI) / 180
      return {
        skill,
        group,
        sector,
        angle,
        reach,
        x: 50 + 50 * SCREEN * reach * Math.sin(radians),
        y: 50 - 50 * SCREEN * reach * Math.cos(radians),
      }
    }),
  )
}

/** A point on the dial (viewBox units, radius 100) */
function polar(radius: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180
  return `${(radius * Math.sin(radians)).toFixed(2)} ${(-radius * Math.cos(radians)).toFixed(2)}`
}

/** Path for a sector's name on the bezel; names on the lower half run the other way so they read upright */
function labelArc(sector: number, span: number) {
  const middle = sector * span + span / 2
  const half = span / 2 - 4
  if (middle > 90 && middle < 270) {
    return `M${polar(94.9, middle + half)} A94.9 94.9 0 0 0 ${polar(94.9, middle - half)}`
  }
  return `M${polar(91.1, middle - half)} A91.1 91.1 0 0 1 ${polar(91.1, middle + half)}`
}

const TICKS = Array.from({ length: 36 }, (_, step) => {
  const degrees = step * 10
  return `M${polar(step % 3 === 0 ? 78.5 : 82, degrees)} L${polar(86, degrees)}`
}).join('')

const percent = (value: number) => `${value.toFixed(3)}%`

/** The shortest turn from one heading to another, so the bearing never swings the long way round */
const turnTo = (from: number, to: number) => from + ((((to - from) % 360) + 540) % 360) - 180

interface Lock {
  index: number
  bearing: number
  sectorTurn: number
}

/**
 * Skills on a sonar screen. The real content is the grouped list of radio chips (one Tab stop, arrow keys
 * move between skills) and the status readout, which names the projects that use the chosen skill. The
 * scope is a decorative mirror: each skill is a blip that lights up as the sweep passes, and the chosen one
 * pings. Phones and reduced motion get the list alone (CSS hides the scope).
 */
export function SkillSonar({ groups }: { groups: SonarGroup[] }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const rootRef = useRef<HTMLDivElement>(null)
  const dwell = useRef(0)
  const aimed = useRef<number | null>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const [lock, setLock] = useState<Lock | null>(null)

  const span = 360 / groups.length
  const blips = useMemo(() => plot(groups), [groups])
  const offsets = useMemo(
    () => groups.map((_, sector) => groups.slice(0, sector).reduce((count, group) => count + group.skills.length, 0)),
    [groups],
  )
  const active = lock ? blips[lock.index] : null

  const select = useCallback(
    (index: number) => {
      setLock((previous) => {
        if (previous?.index === index) return previous
        const blip = blips[index]
        return {
          index,
          bearing: turnTo(previous?.bearing ?? 0, blip.angle),
          sectorTurn: turnTo(previous?.sectorTurn ?? 0, blip.sector * span),
        }
      })
    },
    [blips, span],
  )

  // Hovering a chip or blip locks on once the mouse rests there. Only real mouse movement counts: when the
  // page scrolls under a resting cursor, the browser reports new hover targets without the mouse moving.
  const track = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'mouse') return
      const last = pointer.current
      pointer.current = { x: event.clientX, y: event.clientY }
      if (last && last.x === event.clientX && last.y === event.clientY) return
      const target = (event.target as Element).closest<HTMLElement>('[data-skill], [data-blip]')
      const index = target ? Number(target.dataset.skill ?? target.dataset.blip) : null
      if (index === aimed.current) return
      aimed.current = index
      window.clearTimeout(dwell.current)
      if (index !== null) dwell.current = window.setTimeout(() => select(index), DWELL_MS)
    },
    [select],
  )
  const holdFire = useCallback(() => {
    aimed.current = null
    window.clearTimeout(dwell.current)
  }, [])

  // The sweep and blips are CSS animations kept in step by their delays; they all pause together off-screen
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(([entry]) => root.toggleAttribute('data-running', entry.isIntersecting))
    observer.observe(root)
    return () => {
      observer.disconnect()
      window.clearTimeout(dwell.current)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="sonar"
      data-locked={active ? '' : undefined}
      onPointerMove={track}
      onPointerLeave={holdFire}
    >
      <div
        className="sonar-scope"
        aria-hidden="true"
        data-reveal
        style={{ '--span': span } as CSSProperties}
        onClick={(event) => {
          const blip = (event.target as Element).closest<HTMLElement>('[data-blip]')
          if (blip) select(Number(blip.dataset.blip))
        }}
      >
        <svg className="sonar-dial" viewBox="-100 -100 200 200" focusable="false">
          <defs>
            <radialGradient id={`${uid}-screen`}>
              <stop offset="0" stopColor="#0c3755" />
              <stop offset="1" stopColor="#03111f" />
            </radialGradient>
            <linearGradient id={`${uid}-bezel`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2d6386" />
              <stop offset="0.5" stopColor="#123b58" />
              <stop offset="1" stopColor="#09213a" />
            </linearGradient>
            {groups.map((group, sector) => (
              <path key={group.id} id={`${uid}-arc-${sector}`} d={labelArc(sector, span)} />
            ))}
          </defs>
          <circle className="dial-bezel" r="93" stroke={`url(#${uid}-bezel)`} />
          <circle className="dial-rim" r="99.4" />
          <circle className="dial-screen" r="86" fill={`url(#${uid}-screen)`} />
          {[0.25, 0.5, 0.75].map((share) => (
            <circle key={share} className="dial-ring" r={86 * share} />
          ))}
          {groups.map((group, sector) => (
            <path key={group.id} className="dial-spoke" d={`M0 0 L${polar(86, sector * span)}`} />
          ))}
          <path className="dial-ticks" d={TICKS} />
          {groups.map((group, sector) => (
            <text key={group.id} className="dial-label">
              <textPath href={`#${uid}-arc-${sector}`} startOffset="50%" textAnchor="middle">
                {group.name}
              </textPath>
            </text>
          ))}
        </svg>

        <span className="sonar-sector" style={{ '--turn': lock?.sectorTurn ?? 0 } as CSSProperties} />
        <span className="sonar-sweep" />
        <span
          className="sonar-bearing"
          style={{ '--turn': lock?.bearing ?? 0, '--reach': active?.reach ?? 0 } as CSSProperties}
        />
        {blips.map((blip, index) => (
          <span
            key={blip.skill.name}
            className={index === lock?.index ? 'blip is-locked' : 'blip'}
            data-blip={index}
            style={{ left: percent(blip.x), top: percent(blip.y), '--a': blip.angle.toFixed(2) } as CSSProperties}
          >
            <i />
          </span>
        ))}
        {active && (
          <span
            key={lock?.index}
            className="sonar-tag"
            data-side={active.x > 50 ? 'left' : 'right'}
            style={{ left: percent(active.x), top: percent(active.y) }}
          >
            {active.skill.name}
          </span>
        )}
        <span className="sonar-hub" />
      </div>

      <div className="card sonar-list" data-reveal>
        {groups.map((group, sector) => (
          <fieldset key={group.id} className="sonar-group">
            <legend>
              <h3 className="sonar-group-title">{group.name}</h3>
            </legend>
            <ul className="sonar-chips">
              {group.skills.map((skill, position) => {
                const index = offsets[sector] + position
                return (
                  <li key={skill.name}>
                    <label className="sonar-chip" data-skill={index}>
                      <input
                        type="radio"
                        name={`${uid}-skill`}
                        value={skill.name}
                        checked={lock?.index === index}
                        onChange={() => select(index)}
                      />
                      <span className="chip-face">{skill.name}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </fieldset>
        ))}
      </div>

      <div className="sonar-readout" role="status">
        <div className="card readout-panel">
          {active ? (
            <>
              <p className="readout-sector">{active.group.name}</p>
              <p className="readout-skill">{active.skill.name}</p>
              {active.skill.uses.length > 0 ? (
                <>
                  <p className="readout-label">Used in</p>
                  <ul className="readout-hits">
                    {active.skill.uses.map((use) => (
                      <li key={use.label}>
                        <a
                          href={use.href}
                          {...(use.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                          <span className="readout-arrow" aria-hidden="true">
                            →
                          </span>
                          <span className="readout-name">{use.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="readout-label">Not part of the projects featured here.</p>
              )}
            </>
          ) : (
            <p className="readout-idle">Ping a skill to see where I&apos;ve used it.</p>
          )}
        </div>
      </div>
    </div>
  )
}
