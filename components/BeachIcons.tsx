// Small decorative beach illustrations. All are presentational (aria-hidden) and colored from theme tokens via CSS.

interface IconProps {
  className?: string
}

export function Starfish({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path
        className="starfish-body"
        d="M50 8 60.6 35.4 89.9 37 67.1 55.6 74.7 84 50 68 25.3 84 32.9 55.6 10.1 37 39.4 35.4Z"
        strokeLinejoin="round"
        strokeWidth="9"
      />
      <g className="starfish-dots">
        <circle cx="50" cy="26" r="2.2" />
        <circle cx="74" cy="42" r="2.2" />
        <circle cx="64" cy="70" r="2.2" />
        <circle cx="36" cy="70" r="2.2" />
        <circle cx="26" cy="42" r="2.2" />
        <circle cx="50" cy="50" r="3" />
      </g>
    </svg>
  )
}

export function SandDollar({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle className="sand-dollar-body" cx="50" cy="50" r="42" />
      <g className="sand-dollar-petals">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse key={angle} cx="50" cy="31" rx="5" ry="12.5" transform={`rotate(${angle} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="3.2" />
      </g>
    </svg>
  )
}

export function Scallop({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path className="scallop-body" d="M50 86C31 70 11 55 12 38 14 15 86 15 88 38 89 55 69 70 50 86Z" />
      <path
        className="scallop-ribs"
        d="M50 84 22 31M50 84 34 22M50 84V19M50 84 66 22M50 84 78 31"
        fill="none"
        strokeLinecap="round"
      />
      <path className="scallop-hinge" d="M40 84h20l-4 9H44z" />
    </svg>
  )
}

export function Pebbles({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 120 50" aria-hidden="true" focusable="false">
      <ellipse className="pebble-a" cx="30" cy="32" rx="24" ry="14" />
      <ellipse className="pebble-b" cx="72" cy="36" rx="16" ry="10" />
      <ellipse className="pebble-c" cx="98" cy="30" rx="10" ry="7" />
    </svg>
  )
}

export function Conch({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path className="conch-body" d="M22 74C14 58 18 36 36 24 54 12 78 18 86 36 92 50 84 64 70 66 82 76 78 90 62 90 48 90 32 86 22 74Z" />
      <path
        className="conch-spiral"
        d="M70 66C60 66 52 58 54 48S68 36 74 44 72 58 64 56 58 48 64 46"
        fill="none"
        strokeLinecap="round"
      />
      <path className="conch-lip" d="M22 74C30 70 38 72 44 80 36 86 28 82 22 74Z" />
    </svg>
  )
}
