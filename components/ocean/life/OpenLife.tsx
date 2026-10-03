import type { CSSProperties } from 'react'
import { Dolphin, Manta, SchoolFish } from '../creatures'
import { Ambient, Critter } from './Critter'

// A loose school: [x %, y %, size, phase]
const FORMATION: [number, number, number, number][] = [
  [62, 40, 1.1, 0],
  [48, 22, 0.95, 0.6],
  [50, 60, 1, 1.3],
  [34, 38, 0.9, 0.3],
  [74, 18, 0.85, 1.9],
  [76, 64, 0.9, 0.9],
  [22, 20, 0.8, 1.6],
  [20, 58, 0.85, 2.2],
  [36, 76, 0.75, 0.4],
  [60, 84, 0.8, 1.1],
  [88, 42, 0.8, 2.6],
  [8, 40, 0.75, 1.4],
  [64, 2, 0.7, 2.9],
  [30, 4, 0.7, 0.8],
]

function School({ lane, mode, dur, delay, restX }: { lane: number; mode: 'swim-right' | 'swim-left'; dur: number; delay: number; restX: string }) {
  return (
    <div
      className={`critter school ${mode} ${mode === 'swim-left' ? 'left' : ''}`}
      style={
        {
          '--top': `var(--lane-${lane})`,
          '--w': 'clamp(170px, 18vw, 260px)',
          '--dur': `${dur}s`,
          '--delay': `${-delay}s`,
          '--rest-x': restX,
        } as CSSProperties
      }
    >
      {FORMATION.map(([x, y, size, phase], index) => (
        <div
          key={`${x}-${y}`}
          className="school-fish"
          data-extra={index >= 8 || undefined}
          style={{ left: `${x}%`, top: `${y}%`, '--fs': size, '--bob-delay': `${-phase}s` } as CSSProperties}
        >
          <div className="bob">
            <div className="flee">
              <SchoolFish />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Open water (Skills, Projects): a school of fish, dolphins and a manta ray */
export default function OpenLife() {
  return (
    <>
      <Ambient />
      <School lane={0} mode="swim-right" dur={32} delay={20} restX="22vw" />

      <Critter lane={1} dy="clamp(-30px, -2vw, -12px)" w="clamp(80px, 9vw, 130px)" mode="swim-left" dur={26} delay={6} restX="58vw" arc bob={16}>
        <Dolphin />
      </Critter>
      <Critter lane={1} dy="clamp(14px, 2.4vw, 34px)" w="clamp(66px, 7.4vw, 108px)" mode="swim-left" dur={26} delay={4.3} restX="66vw" arc bob={14} extra>
        <Dolphin />
      </Critter>

      <Critter lane={2} w="clamp(96px, 11vw, 168px)" mode="scroll-right" bob={6} bobDur={6}>
        <Manta />
      </Critter>
      <School lane={2} mode="swim-left" dur={40} delay={8} restX="70vw" />
    </>
  )
}
