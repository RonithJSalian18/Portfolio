import type { CSSProperties } from 'react'

type Tone = 'sand-1' | 'sand-2' | 'sand-3' | 'sand-4' | 'sand-5' | 'sand-wet' | 'sea-deep'

interface WaveDividerProps {
  /** Background of the section above */
  from: Tone
  /** Background of the section below, which washes up over the one above */
  to: Tone
  variant?: 'tide' | 'surf'
}

export function WaveDivider({ from, to, variant = 'tide' }: WaveDividerProps) {
  const style = { '--from': `var(--${from})`, '--to': `var(--${to})` } as CSSProperties

  return (
    <div className={`divider divider-${variant} grain`} style={style} aria-hidden="true">
      {variant === 'surf' && <div className="divider-back" />}
      <div className="divider-wave" />
      <div className="divider-glow">
        <div className="divider-foam" />
      </div>
    </div>
  )
}
