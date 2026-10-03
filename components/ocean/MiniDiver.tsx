/**
 * A small, simplified version of the diver for narrower screens, where there's no side margin for the
 * full one. It swims through the bands between sections like the fish do (placed as a Critter), with a
 * flutter kick and its own breath bubbles; in the deep its headlamp is on.
 */
export function MiniDiver({ lamp = false }: { lamp?: boolean }) {
  return (
    <svg className="mini-diver-art" viewBox="0 0 124 56" focusable="false">
      <g className="mini-fin mini-fin-far">
        <path d="M33 25 6 15Q1 18 3 24L31 31Z" />
      </g>
      <path className="mini-suit mini-far" d="M44 27 30 26Q26 29 30 32L44 33Z" />
      <rect className="mini-tank" x="48" y="13" width="32" height="9.5" rx="4.75" />
      <path className="mini-suit" d="M42 25Q42 20 50 20L80 19.5Q91 20 92 28Q91 37 80 37.5L50 38Q42 37.5 42 32Z" />
      <path className="mini-stripe" d="M46 33Q66 35.5 88 32" />
      <path className="mini-suit" d="M45 31 31 32Q27 35 31 38L45 37Z" />
      <g className="mini-fin mini-fin-near">
        <path d="M33 34 6 40Q1 44 4 48L31 40Z" />
      </g>
      <circle className="mini-suit" cx="100" cy="27" r="9.5" />
      <rect className="mini-mask" x="102.5" y="19.5" width="10.5" height="10" rx="3.2" />
      <circle className="mini-eye" cx="108.4" cy="24.4" r="1.4" />
      <circle className="mini-reg" cx="110.5" cy="34" r="3.2" />
      <path className="mini-arm" d="M86 32 99 40" />
      {lamp && <circle className="mini-lamp" cx="104" cy="16.8" r="2.4" />}
      <circle className="mini-bubble" cx="112" cy="30" r="2.2" />
      <circle className="mini-bubble mini-bubble-2" cx="112" cy="30" r="1.5" />
    </svg>
  )
}
