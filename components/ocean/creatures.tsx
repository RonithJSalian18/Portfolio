// Hand-drawn SVG sea life. Every piece faces right; CSS flips the ones swimming left.
// Motion is applied to each creature's own <svg> (see "Body motion" in sealife.css), so the compositor can run it.
// Purely decorative: the zone layer that holds them is aria-hidden.

const OUTLINE = '#1d1a1a'

export function Clownfish() {
  return (
    <svg className="swim" viewBox="0 0 64 36" focusable="false">
      <path d="M15 18 4 8.5Q2 9 3 11.5 6 18 3 24.5 2 27 4 27.5Z" fill="#ff7b25" stroke={OUTLINE} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M24 9Q30 1.5 40 6.5L38 10Z" fill="#ff7b25" stroke={OUTLINE} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M28 28Q32 34 37 29Z" fill="#ff7b25" stroke={OUTLINE} strokeWidth="1.1" strokeLinejoin="round" />
      <ellipse cx="34" cy="18" rx="21" ry="11.5" fill="#ff7b25" stroke={OUTLINE} strokeWidth="1.2" />
      <g fill="#fff" stroke={OUTLINE} strokeWidth="1.1">
        <ellipse cx="44.5" cy="18" rx="2.8" ry="9.6" />
        <ellipse cx="32" cy="18" rx="3.4" ry="11" />
        <ellipse cx="20.5" cy="18" rx="2.4" ry="8" />
      </g>
      <path d="M41 22Q44 28 38 29 39 25 41 22Z" fill="#ff9a4d" stroke={OUTLINE} strokeWidth="1" />
      <circle cx="49.5" cy="15" r="2.6" fill="#fff" stroke={OUTLINE} strokeWidth="0.8" />
      <circle cx="50.2" cy="15.2" r="1.4" fill={OUTLINE} />
      <path d="M54.5 20q1.5.8.4 1.8" fill="none" stroke={OUTLINE} strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
}

export function Tang() {
  return (
    <svg className="swim" viewBox="0 0 46 34" focusable="false">
      <path d="M9 17 1 9.5Q3 17 1 24.5Z" fill="#ffcf2e" />
      <path d="M7 17Q13 3 27 3.5 38 5 42.5 15 43.5 18 41 20.5 34 31 19 31 10 29 7 17Z" fill="#ffd23f" />
      <path d="M14 7Q22 1 32 4M14 27Q22 33 32 29" fill="none" stroke="#f2b705" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 15.5 13 17 9 18.5Z" fill="#fff" />
      <circle cx="35" cy="12.5" r="2.4" fill="#1b2430" />
      <circle cx="35.6" cy="12" r="0.7" fill="#fff" />
      <path d="M28 19Q30 25 24 25.5 25.5 22 28 19Z" fill="#f2b705" />
    </svg>
  )
}

export function SchoolFish() {
  return (
    <svg className="swim" viewBox="0 0 30 14" focusable="false">
      <path d="M7.5 7 1.5 2.5 3.5 7 1.5 11.5Z" fill="#9fbad0" />
      <path d="M6 7Q14 1.5 23 4.5 28.5 6.5 28.5 7 28.5 7.5 23 9.5 14 12.5 6 7Z" fill="#c4d9e8" />
      <path d="M8 6.2Q16 2.6 24 5.2" fill="none" stroke="#6e8fae" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="24.6" cy="6.4" r="0.9" fill="#1d2733" />
    </svg>
  )
}

export function Turtle() {
  return (
    <svg className="glide" viewBox="0 0 140 100" focusable="false">
      <g fill="#8fbf6e" stroke="#5f8a45" strokeWidth="1.2">
        <path d="M80 32Q96 4 120 7 104 22 88 40Z" />
        <path d="M80 68Q96 96 120 93 104 78 88 60Z" />
        <path d="M40 36Q28 22 16 25 25 36 38 43Z" />
        <path d="M40 64Q28 78 16 75 25 64 38 57Z" />
        <path d="M27 47 14 50 27 53Z" />
        <ellipse cx="112" cy="50" rx="15" ry="10.5" />
      </g>
      <circle cx="119" cy="44.5" r="1.8" fill="#24321a" />
      <circle cx="119" cy="55.5" r="1.8" fill="#24321a" />
      <ellipse cx="63" cy="50" rx="37" ry="28" fill="#7a5a2f" stroke="#59401f" strokeWidth="1.4" />
      <g fill="#a07a3e" stroke="#59401f" strokeWidth="1.2" strokeLinejoin="round">
        <path d="M54 50 59 40H69L74 50 69 60H59Z" />
        <path d="M76 50 80 42H88L92 50 88 58H80Z" />
        <path d="M34 50 38 42H47L51 50 47 58H38Z" />
        <path d="M51 36 56 27H70L74 36 69 38H59Z" />
        <path d="M51 64 56 73H70L74 64 69 62H59Z" />
        <path d="M77 38 80 30H88L92 38 88 40H80Z" />
        <path d="M77 62 80 70H88L92 62 88 60H80Z" />
      </g>
    </svg>
  )
}

export function Dolphin() {
  return (
    <svg viewBox="0 0 120 52" focusable="false">
      <path d="M14 23 2 14 6 26 1 37 14 31Z" fill="#6f8ba6" />
      <path d="M60 12Q66 0 75 1 70 6 72 13Z" fill="#6f8ba6" />
      <path d="M118 30Q110 26 102 25 92 12 70 10 46 9 30 18 20 24 12 25L12 30Q30 37 64 36 80 35 92 38 104 37 110 33Z" fill="#7d99b4" />
      <path d="M100 34Q80 40 60 37 40 35 24 31 50 30 70 31 88 31 100 34Z" fill="#dce8f1" />
      <path d="M74 34Q72 44 64 46 68 40 66 34Z" fill="#6f8ba6" />
      <circle cx="100" cy="25.5" r="1.4" fill="#1b2533" />
      <path d="M108 30.5q3 .6 6 0" fill="none" stroke="#5c7690" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
}

export function Manta() {
  return (
    <svg className="beat" viewBox="-36 0 166 100" focusable="false">
      <path d="M12 50H-34" stroke="#22344a" strokeWidth="1.6" strokeLinecap="round" />
      <g>
        <path d="M118 50C112 47 104 46 96 44 86 26 70 8 44 4 52 16 56 30 54 42 40 45 22 48 8 50 22 52 40 55 54 58 56 70 52 84 44 96 70 92 86 74 96 56 104 54 112 53 118 50Z" fill="#2b3f55" />
        <path d="M90 43C84 35 76 29 68 27 73 33 77 39 79 45ZM90 57C84 65 76 71 68 73 73 67 77 61 79 55Z" fill="#ffffff" opacity="0.16" />
      </g>
      <path d="M115 46q9-3 11-10M115 54q9 3 11 10" fill="none" stroke="#2b3f55" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  )
}

export function Jellyfish() {
  return (
    <svg viewBox="0 0 60 130" focusable="false">
      <g className="tentacles" fill="none" strokeLinecap="round">
        <path className="tentacle" d="M11 34q-4 18 2 34t-2 34 2 22" />
        <path className="tentacle" d="M21 36q4 18-2 34t2 34-2 18" />
        <path className="tentacle" d="M39 36q-4 18 2 34t-2 34 2 18" />
        <path className="tentacle" d="M49 34q4 18-2 34t2 34-2 22" />
        <path className="arm" d="M27 35q-7 14 2 27t-3 26" />
        <path className="arm" d="M33 35q7 14-2 27t3 24" />
      </g>
      <g className="bell-group">
        <path className="bell" d="M5 35C4 14 16 4 30 4S56 14 55 35C50 32 46 36 42 33 38 36 34 32 30 35 26 32 22 36 18 33 14 36 10 32 5 35Z" />
        <ellipse className="bell-core" cx="30" cy="22" rx="13" ry="8" />
        <path className="bell-shine" d="M14 18Q18 9 28 8" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function Octopus() {
  return (
    <svg viewBox="0 0 170 120" focusable="false">
      <path className="seabed-rock" d="M0 120C6 100 22 92 44 90 64 84 92 82 116 88 140 92 160 100 170 120Z" />
      <g fill="#c9503a">
        <path d="M66 78C52 84 40 92 30 100 24 105 18 104 20 98 22 94 26 96 28 98 34 92 46 84 60 74Z" />
        <path d="M72 80C66 92 60 104 50 110 46 112 42 110 45 106 52 104 58 94 64 80Z" />
        <path d="M90 80C96 92 102 104 112 110 116 112 120 110 117 106 110 104 104 94 98 80Z" />
        <path d="M96 78C110 84 122 92 132 100 138 105 144 104 142 98 140 94 136 96 134 98 128 92 116 84 102 74Z" />
        <path d="M80 80C78 94 84 102 92 100 98 98 96 92 92 94 88 96 86 92 86 82Z" />
      </g>
      <g fill="#f3b19c">
        <circle cx="40" cy="94" r="1.6" />
        <circle cx="50" cy="88" r="1.6" />
        <circle cx="56" cy="104" r="1.5" />
        <circle cx="104" cy="104" r="1.5" />
        <circle cx="120" cy="94" r="1.6" />
        <circle cx="110" cy="88" r="1.6" />
      </g>
      <path d="M58 70C50 30 66 14 81 14S112 30 104 70C100 80 62 80 58 70Z" fill="#d4583f" />
      <path d="M68 26Q74 18 82 18" fill="none" stroke="#e8826a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="94" cy="38" r="3" fill="#b8452f" />
      <circle cx="70" cy="44" r="2.2" fill="#b8452f" />
      <ellipse cx="71" cy="62" rx="6.5" ry="5.5" fill="#fff5e6" />
      <ellipse cx="91" cy="62" rx="6.5" ry="5.5" fill="#fff5e6" />
      <ellipse className="look" cx="71" cy="62.5" rx="3.2" ry="1.7" fill={OUTLINE} />
      <ellipse className="look" cx="91" cy="62.5" rx="3.2" ry="1.7" fill={OUTLINE} />
    </svg>
  )
}

/** The lure's glow pulses as its own composited layer (an SVG filter animating would repaint every frame) */
export function Anglerfish() {
  return (
    <span className="angler-art">
      <svg viewBox="0 -12 150 122" focusable="false">
        <path d="M64 18C58-2 36-8 22 4" fill="none" stroke="#4a3d5c" strokeWidth="2.4" strokeLinecap="round" />
        <circle className="lure" cx="21" cy="6" r="5.5" />
        <path d="M128 56 148 40 144 56 148 72Z" fill="#2b2238" />
        <path
          className="angler-body"
          d="M130 56C130 24 104 14 80 16 54 18 30 30 22 52 18 64 22 74 30 82 46 96 74 100 100 92 120 86 130 74 130 56Z"
        />
        <path d="M24 60C34 78 54 84 74 80L70 70C56 72 40 68 30 60Z" fill="#140f1c" />
        <path
          d="M30 59l2.5 6 2.5-6ZM37 61l2.5 7 2.5-7ZM45 64l2.5 6 2.5-6ZM53 66l2.5 6.5 2.5-6.5ZM61 67.5l2.5 6 2.5-6ZM40 75l2.5-6 2.5 6ZM50 78l2.5-6.5 2.5 6.5ZM60 79l2.5-6 2.5 6Z"
          fill="#e8e4dc"
        />
        <path d="M86 70C92 80 100 84 108 82 100 76 94 70 92 64Z" fill="#3a2f4a" />
        <circle cx="52" cy="40" r="5" fill="#0d0a12" />
        <circle cx="51" cy="39" r="1.6" fill="#9fd8ff" />
      </svg>
      <span className="lure-glow" />
    </span>
  )
}

export function Lanternfish() {
  return (
    <svg className="swim" viewBox="0 0 40 16" focusable="false">
      <path d="M5 8 0 3 1.5 8 0 13Z" fill="#1d2b44" />
      <path d="M4 8Q14 2 30 5 37 7 37 8 37 9 30 11 14 14 4 8Z" fill="#22344f" />
      <g className="photophores">
        <circle cx="10" cy="10" r="0.9" />
        <circle cx="14" cy="10.6" r="0.9" />
        <circle cx="18" cy="10.9" r="0.9" />
        <circle cx="22" cy="10.8" r="0.9" />
        <circle cx="26" cy="10.4" r="0.9" />
        <circle cx="30" cy="9.6" r="0.9" />
      </g>
      <circle cx="29.5" cy="6.6" r="2.1" fill="#0b1220" />
      <circle cx="30.1" cy="6" r="0.6" fill="#cfe9ff" />
    </svg>
  )
}

/** Static drawing; the shimmer running down its comb rows is a separate composited layer (see .comb-glint) */
export function CombJelly() {
  return (
    <span className="comb-art">
      <svg viewBox="0 0 30 44" focusable="false">
        <path className="comb-body" d="M15 2C26 2 28 16 26 28 24 38 19 42 15 42S6 38 4 28C2 16 4 2 15 2Z" />
        <g className="comb-rows" fill="none" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1.5 2">
          <path d="M15 3C21 10 22 28 15.5 41" />
          <path d="M15 3C9 10 8 28 14.5 41" />
          <path d="M15 3C25 12 25 30 17 40" />
          <path d="M15 3C5 12 5 30 13 40" />
        </g>
      </svg>
      <span className="comb-glint" />
    </span>
  )
}

// ----- Reef floor pieces -----

export function Staghorn() {
  return (
    <svg viewBox="0 0 80 92" focusable="false">
      <path
        d="M40 92V58M40 66 24 44M40 60 56 36M24 44 18 26M24 44 32 22M56 36 52 16M56 36 68 22M18 26 12 14M32 22 36 8M68 22 74 10"
        fill="none"
        stroke="#ff8f70"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <g fill="#ffc2ad">
        <circle cx="12" cy="14" r="3.4" />
        <circle cx="36" cy="8" r="3.4" />
        <circle cx="52" cy="16" r="3.4" />
        <circle cx="74" cy="10" r="3.4" />
      </g>
    </svg>
  )
}

export function BrainCoral() {
  return (
    <svg viewBox="0 0 90 50" focusable="false">
      <path d="M4 50C4 18 26 4 45 4S86 18 86 50Z" fill="#e6b74f" />
      <path
        d="M14 42C18 32 26 36 30 27S42 24 46 16M28 46C32 38 40 42 44 33S56 30 60 22M48 47C52 40 60 43 64 35S72 33 76 27M12 28C18 22 22 26 26 18"
        fill="none"
        stroke="#b98a2c"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Sea fan: a trunk splitting into a fan of fine branches
const FAN = (() => {
  let d = 'M45 100V70'
  for (let i = 0; i < 10; i++) {
    const angle = ((-158 + i * 15.5) * Math.PI) / 180
    const x = 45 + 56 * Math.cos(angle)
    const y = 70 + 56 * Math.sin(angle)
    const mx = 45 + 30 * Math.cos(angle)
    const my = 70 + 30 * Math.sin(angle)
    d += `M45 70Q${(mx + 4).toFixed(1)} ${my.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`
    const twig = angle + 0.35
    d += `M${mx.toFixed(1)} ${my.toFixed(1)}L${(mx + 18 * Math.cos(twig)).toFixed(1)} ${(my + 18 * Math.sin(twig)).toFixed(1)}`
  }
  return d
})()

export function SeaFan() {
  return (
    <svg viewBox="0 0 90 100" focusable="false">
      <path d={FAN} fill="none" stroke="#d1609f" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export function TubeSponge() {
  return (
    <svg viewBox="0 0 60 82" focusable="false">
      <g fill="#8a5bd1">
        <rect x="6" y="32" width="15" height="50" rx="7.5" />
        <rect x="23" y="12" width="17" height="70" rx="8.5" />
        <rect x="42" y="38" width="13" height="44" rx="6.5" />
      </g>
      <g fill="#4e2c8a">
        <ellipse cx="13.5" cy="36" rx="5" ry="2.6" />
        <ellipse cx="31.5" cy="16" rx="5.8" ry="2.8" />
        <ellipse cx="48.5" cy="42" rx="4.4" ry="2.3" />
      </g>
    </svg>
  )
}

const TENTACLES = Array.from({ length: 12 }, (_, i) => {
  const x0 = 32 + i * 4
  const spread = (i - 5.5) * 5
  const top = 26 + Math.abs(i - 5.5) * 3.2
  return `M${x0} 70C${x0 + spread * 0.2} 52 ${x0 + spread * 0.8} 44 ${x0 + spread} ${top.toFixed(1)}`
})

export function Anemone() {
  return (
    <svg viewBox="0 0 110 92" focusable="false">
      <g fill="none" stroke="#f6a0bf" strokeWidth="5" strokeLinecap="round">
        <path d={TENTACLES.filter((_, i) => i % 2 === 0).join('')} />
        <path d={TENTACLES.filter((_, i) => i % 2 === 1).join('')} />
      </g>
      <path d="M30 92C28 74 38 66 55 66S82 74 80 92Z" fill="#c94f7c" />
    </svg>
  )
}

export function Kelp() {
  return (
    <svg viewBox="0 0 40 200" focusable="false" preserveAspectRatio="xMidYMax meet">
      <g>
        <path d="M20 200C14 160 28 130 20 96S28 36 22 4" fill="none" stroke="#3c9a64" strokeWidth="4.5" strokeLinecap="round" />
        <g fill="#4bb176">
          <path d="M20 160C30 150 36 138 34 128 28 138 24 148 20 160Z" />
          <path d="M21 124C11 114 6 102 8 92 14 102 18 112 21 124Z" />
          <path d="M22 86C32 76 37 64 35 54 29 64 25 74 22 86Z" />
          <path d="M23 48C13 40 9 28 11 18 17 28 20 38 23 48Z" />
        </g>
      </g>
    </svg>
  )
}
