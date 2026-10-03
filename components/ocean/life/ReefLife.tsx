import type { CSSProperties, ReactNode } from 'react'
import { Starfish } from '@/components/BeachIcons'
import { LightRays } from '../LightRays'
import {
  Anemone,
  BrainCoral,
  Clownfish,
  Kelp,
  SeaFan,
  Staghorn,
  Tang,
  TubeSponge,
  Turtle,
} from '../creatures'
import { MiniDiver } from '../MiniDiver'
import { Ambient, Bubbles, Critter } from './Critter'

/** A piece of the reef standing on the rock ledge at the bottom of the zone */
function Piece({
  x,
  w,
  sink = 0.62,
  extra,
  className,
  children,
}: {
  x: string
  w: string
  sink?: number
  extra?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={`floor-piece ${className ?? ''}`}
      data-extra={extra || undefined}
      style={{ '--x': x, '--w': w, '--sink': sink } as CSSProperties}
    >
      {children}
    </div>
  )
}

function ReefFloor() {
  return (
    <>
      <svg className="reef-ledge" viewBox="0 0 600 70" preserveAspectRatio="none" focusable="false">
        <path d="M0 70V22C40 14 90 20 140 12S260 18 320 10 430 16 480 20C520 24 560 40 600 70Z" />
        <path className="ledge-shade" d="M0 70V40C60 34 140 42 220 36S380 40 460 44C520 48 560 56 600 70Z" />
      </svg>
      <Piece x="1.5%" w="clamp(22px, 2.6vw, 38px)" sink={0.55} className="kelp-piece">
        <Kelp />
      </Piece>
      <Piece x="4.5%" w="clamp(20px, 2.2vw, 32px)" sink={0.6} className="kelp-piece kelp-short" extra>
        <Kelp />
      </Piece>
      <Piece x="9%" w="clamp(52px, 6vw, 86px)">
        <Staghorn />
      </Piece>
      <Piece x="15.5%" w="clamp(26px, 2.6vw, 38px)" sink={0.72} className="star-piece">
        <Starfish />
      </Piece>
      <Piece x="21%" w="clamp(64px, 8vw, 116px)" sink={0.66}>
        <BrainCoral />
      </Piece>
      <Piece x="33%" w="clamp(84px, 10vw, 136px)" sink={0.6} className="anemone-piece">
        <Anemone />
        <div className="nemo">
          <Clownfish />
        </div>
        <div className="nemo nemo-2" data-extra>
          <Clownfish />
        </div>
      </Piece>
      <Piece x="47%" w="clamp(64px, 8vw, 116px)" className="fan-piece">
        <SeaFan />
      </Piece>
      <Piece x="57%" w="clamp(34px, 4.4vw, 62px)" sink={0.64}>
        <TubeSponge />
      </Piece>
      <Piece x="64%" w="clamp(48px, 5.6vw, 80px)" extra>
        <Staghorn />
      </Piece>
      <Piece x="71%" w="clamp(20px, 2.2vw, 32px)" sink={0.58} className="kelp-piece kelp-short" extra>
        <Kelp />
      </Piece>
      <Bubbles
        items={[
          ['12%', 'calc(var(--ledge-h) * 1.8)', 7, 4.2, 0],
          ['37%', 'calc(var(--ledge-h) * 2.1)', 9, 5, 1.8],
          ['38.5%', 'calc(var(--ledge-h) * 2.1)', 5, 4.4, 3.1],
          ['59%', 'calc(var(--ledge-h) * 2)', 6, 4.6, 2.4],
        ]}
      />
    </>
  )
}

/** Shallow reef (About): sun shafts, caustics, clownfish, tangs, a turtle and a coral ledge */
export default function ReefLife() {
  return (
    <>
      <Ambient caustics />
      <LightRays />

      {/* The diver, on screens without room for it in the side margin */}
      <Critter lane={0} dy="0px" w="clamp(58px, 14vw, 86px)" mode="scroll-right" bob={4} bobDur={3.4} className="mini-diver">
        <MiniDiver />
      </Critter>

      {/* A little group of clownfish in the band above About */}
      <Critter lane={0} dy="-6px" w="clamp(32px, 3.4vw, 50px)" mode="swim-right" dur={44} delay={30} restX="16vw" flee>
        <Clownfish />
      </Critter>
      <Critter lane={0} dy="8px" w="clamp(26px, 2.8vw, 42px)" mode="swim-right" dur={44} delay={27.6} restX="20vw" flee>
        <Clownfish />
      </Critter>
      <Critter lane={0} dy="0px" w="clamp(28px, 3vw, 44px)" mode="swim-right" dur={44} delay={25} restX="24vw" flee extra>
        <Clownfish />
      </Critter>

      {/* Between About and Skills: a sea turtle that swims across as you scroll past, and two tangs */}
      <Critter lane={1} w="clamp(96px, 11vw, 160px)" mode="scroll-right" bob={5} bobDur={5}>
        <Turtle />
      </Critter>
      <Critter lane={1} dy="clamp(-52px, -4vw, -34px)" w="clamp(28px, 3vw, 44px)" mode="swim-left" dur={36} delay={12} restX="70vw" flee>
        <Tang />
      </Critter>
      <Critter lane={1} dy="clamp(30px, 3.4vw, 46px)" w="clamp(24px, 2.6vw, 38px)" mode="swim-left" dur={36} delay={9.5} restX="76vw" flee extra>
        <Tang />
      </Critter>

      <ReefFloor />
    </>
  )
}
