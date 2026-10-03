import type { SectionCopy } from '@/data/profile'

export function SectionHeading({ id, copy }: { id: string; copy: SectionCopy }) {
  return (
    <header className="section-head" data-reveal>
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id={`${id}-title`} className="section-title">
        {copy.title && `${copy.title} `}
        <span className="highlight">{copy.highlight}</span>
      </h2>
      {copy.intro && <p className="section-intro">{copy.intro}</p>}
    </header>
  )
}
