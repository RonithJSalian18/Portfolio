import type { CSSProperties, ReactNode } from 'react'
import { SandDollar, Scallop, Starfish } from '@/components/BeachIcons'

// Background life for the beach hero. Purely decorative (aria-hidden), colours from theme tokens.
// Moving parts (gull wings, the lighthouse beam) are their own <svg> layers so the compositor can animate them.

const at = (style: Record<string, string | number>) => style as CSSProperties

function Gull() {
  return (
    <span className="gull-art">
      <svg className="gull-wings" viewBox="0 0 40 16" focusable="false">
        <path d="M2 10Q10 1 20 9Q30 1 38 10" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 40 16" focusable="false">
        <ellipse cx="20" cy="9.6" rx="2.6" ry="1.8" />
      </svg>
    </span>
  )
}

/** Seagulls gliding in the sides of the sky by day; a shooting star at night */
export function SkyLife() {
  return (
    <div className="sky-life" aria-hidden="true">
      <div className="gull" style={at({ left: '5%', top: '20%', '--range': '11vw', '--dur': '17s', '--delay': '-4s' })}>
        <div className="gull-bob">
          <Gull />
        </div>
      </div>
      <div className="gull gull-small" style={at({ left: '11%', top: '31%', '--range': '8vw', '--dur': '13s', '--delay': '-9s' })} data-extra>
        <div className="gull-bob">
          <Gull />
        </div>
      </div>
      <div className="gull" style={at({ left: '76%', top: '34%', '--range': '9vw', '--dur': '15s', '--delay': '-2s' })}>
        <div className="gull-bob">
          <Gull />
        </div>
      </div>
      <span className="shooting-star" />
    </div>
  )
}

/** A distant sailboat on the horizon (with a lantern at night) */
export function Sailboat() {
  return (
    <div className="sailboat" aria-hidden="true">
      <svg viewBox="0 0 40 40" focusable="false">
        <path className="sail" d="M21 4 34 28H21Z" />
        <path className="sail sail-jib" d="M19 8V28H8Z" />
        <path className="mast" d="M20 3V30" />
        <path className="hull" d="M4 30H36L31.5 36H8.5Z" />
        <circle className="lantern" cx="20" cy="3.4" r="1.6" />
      </svg>
    </div>
  )
}

/** Lighthouse on a rocky point; its beam sweeps (faintly by day, brightly at night) */
export function Lighthouse() {
  return (
    <div className="hero-lighthouse" aria-hidden="true">
      <svg className="lh-beam" viewBox="0 0 140 170" focusable="false">
        <defs>
          <linearGradient id="hero-beam" x1="1" x2="0" y1="0" y2="0">
            <stop offset="0" stopColor="#fff3bf" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff3bf" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M70 46-170 6V86Z" fill="url(#hero-beam)" />
      </svg>
      <svg viewBox="0 0 140 170" focusable="false">
        <path className="lh-rock" d="M14 170C18 140 34 128 52 130 62 118 86 116 100 126 116 122 132 138 136 170Z" />
        <path className="lh-tower" d="M56 136 61 58H79L84 136Z" />
        <g className="lh-stripes">
          <path d="M60.2 72H79.8L80.7 86H59.3Z" />
          <path d="M58.6 100H81.4L82.3 114H57.7Z" />
        </g>
        <rect className="lh-door" x="66" y="122" width="8" height="14" rx="4" />
        <rect className="lh-deck" x="56" y="52" width="28" height="6" rx="1.5" />
        <rect className="lh-room" x="61" y="36" width="18" height="16" rx="2" />
        <circle className="lh-lamp" cx="70" cy="44" r="4.5" />
        <path className="lh-roof" d="M59 37 70 25 81 37Z" />
      </svg>
    </div>
  )
}

/** A surfer riding a wave layer */
export function Surfer({ className = '' }: { className?: string }) {
  return (
    <div className={`surfer ${className}`} aria-hidden="true">
      <div className="surfer-ride">
        <svg viewBox="0 0 60 60" focusable="false">
          <path className="board" d="M6 48C20 43 44 43 57 47.5 44 52 20 52.5 6 48Z" />
          <path className="board-stripe" d="M14 47.6C26 45.6 42 45.6 52 47.4" />
          <g className="rider">
            <circle cx="34.5" cy="13" r="4.2" />
            <path d="M33 18 29 31M23 23.5 32.5 20 42 24.5M29 31 22.5 45M29 31 37 37 38 45.5" />
          </g>
        </svg>
      </div>
    </div>
  )
}

function Find({ x, b, w, extra, className = '', children }: { x: string; b: string; w: string; extra?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={`find ${className}`} style={at({ left: x, bottom: b, '--w': w })} data-extra={extra || undefined}>
      {children}
    </div>
  )
}

function FlipFlops() {
  return (
    <svg viewBox="0 0 50 34" focusable="false">
      <g transform="rotate(-14 14 17)">
        <path className="flipflop-sole" d="M14 2C21 2 22 10 20 18S18 32 13 32 6 26 7 18 7 2 14 2Z" />
        <path className="flipflop-strap" d="M14 9 9 16M14 9 19 15" />
      </g>
      <g transform="rotate(10 36 17)">
        <path className="flipflop-sole flipflop-sole-b" d="M36 2C43 2 44 10 42 18S40 32 35 32 28 26 29 18 29 2 36 2Z" />
        <path className="flipflop-strap" d="M36 9 31 16M36 9 41 15" />
      </g>
    </svg>
  )
}

function Sandcastle() {
  return (
    <svg viewBox="0 0 72 62" focusable="false">
      <path className="flag-pole" d="M36 4V20" />
      <path className="flag" d="M36 4 46 7.5 36 11Z" />
      <path className="castle" d="M4 62V40H10V36H14V40H20V36H24V30H28V26H32V30H40V26H44V30H48V36H52V40H58V36H62V40H68V62Z" />
      <path className="castle-shade" d="M24 30V62H48V30Z" />
      <path className="castle-door" d="M32 62V52Q36 46 40 52V62Z" />
      <path className="castle-shade" d="M4 54H68V62H4Z" />
    </svg>
  )
}

function BottleInSand() {
  return (
    <svg viewBox="0 0 60 30" focusable="false">
      <g transform="rotate(-18 30 16)">
        <path className="beach-bottle" d="M8 10H38C42 10 44 12 46 13H54V19H46C44 20 42 22 38 22H8C4 22 2 19 2 16S4 10 8 10Z" />
        <rect className="beach-bottle-paper" x="11" y="13" width="22" height="6" rx="3" />
        <rect className="beach-bottle-cork" x="54" y="13.4" width="4.5" height="5.2" rx="1.2" />
      </g>
      <path className="sand-mound" d="M0 30C6 20 18 18 30 21S50 22 60 30Z" />
    </svg>
  )
}

function BeachCrab() {
  return (
    <svg viewBox="0 0 40 30" focusable="false">
      <g fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="crab-legs">
        <path className="crab-legs-a" d="M10 16 4 13 2 16M11 22 5 25 4 28M30 19 37 19 39 23" />
        <path className="crab-legs-b" d="M10 19 3 19 1 23M30 16 36 13 38 16M29 22 35 25 36 28" />
        <path d="M14 14 9.5 8.5M26 14 30.5 8.5M17 12.5 16 8.5M23 12.5 24 8.5" />
      </g>
      <circle cx="8.5" cy="6.5" r="3.6" className="crab-shell" />
      <circle cx="31.5" cy="6.5" r="3.6" className="crab-shell" />
      <ellipse cx="20" cy="19" rx="10.5" ry="7.5" className="crab-shell" />
      <circle cx="16" cy="7.8" r="1.7" className="crab-eye" />
      <circle cx="24" cy="7.8" r="1.7" className="crab-eye" />
    </svg>
  )
}

function Footprints() {
  // Bare footprints leading from the foreground up to the waterline
  const prints: [number, number, number][] = [
    [0, 96, -24],
    [26, 78, -20],
    [14, 58, -22],
    [40, 40, -18],
    [30, 20, -20],
    [56, 2, -16],
  ]
  return (
    <svg viewBox="0 0 80 120" focusable="false">
      {prints.map(([x, y, angle], index) => (
        <g key={`${x}-${y}`} className="print" transform={`translate(${x + 8} ${y + 8}) rotate(${angle}) scale(${index % 2 ? -1 : 1} 1)`}>
          <ellipse cx="0" cy="4" rx="3.6" ry="6" />
          <circle cx="-2.6" cy="-4.4" r="1.3" />
          <circle cx="0" cy="-5.4" r="1.2" />
          <circle cx="2.4" cy="-4.8" r="1.1" />
        </g>
      ))}
    </svg>
  )
}

/** Things lying on the sand at the front of the beach */
export function BeachFinds() {
  return (
    <div className="beach-finds" aria-hidden="true">
      <Find x="5%" b="10%" w="clamp(30px, 3.6vw, 52px)">
        <FlipFlops />
      </Find>
      <Find x="16%" b="20%" w="clamp(16px, 1.8vw, 26px)" className="find-shell" extra>
        <Scallop />
      </Find>
      <Find x="24%" b="8%" w="clamp(20px, 2.4vw, 34px)" className="find-star">
        <Starfish />
      </Find>
      <Find x="33%" b="6%" w="clamp(30px, 3.4vw, 50px)" className="find-prints" extra>
        <Footprints />
      </Find>
      <Find x="46%" b="34%" w="clamp(34px, 4vw, 58px)">
        <BottleInSand />
      </Find>
      <Find x="55%" b="12%" w="clamp(16px, 1.8vw, 26px)" extra>
        <SandDollar />
      </Find>
      <Find x="61%" b="30%" w="clamp(22px, 2.4vw, 34px)" className="find-crab">
        <BeachCrab />
      </Find>
      <Find x="71%" b="8%" w="clamp(44px, 5vw, 76px)">
        <Sandcastle />
      </Find>
      <Find x="87%" b="16%" w="clamp(14px, 1.6vw, 22px)" className="find-shell find-shell-b" extra>
        <Scallop />
      </Find>
    </div>
  )
}
