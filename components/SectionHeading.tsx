import type { SectionCopy } from '@/lib/content'

export function SectionHeading({ id, copy }: { id: string; copy: SectionCopy }) {
  return (
    <header className="section-head" data-reveal>
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id={`${id}-title`} className="section-title">
        {copy.title} <span className="highlight">{copy.highlight}</span>
      </h2>
      <p className="section-intro">{copy.intro}</p>
    </header>
  )
}
