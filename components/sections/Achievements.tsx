import type { CSSProperties } from 'react'
import { SandDollar, Scallop, Starfish } from '@/components/BeachIcons'
import { SectionHeading } from '@/components/SectionHeading'
import { medals, sections, type MedalShape } from '@/lib/content'

const medalIcons: Record<MedalShape, React.ComponentType<{ className?: string }>> = {
  'sand-dollar': SandDollar,
  starfish: Starfish,
  scallop: Scallop,
}

export function Achievements() {
  return (
    <section id="achievements" className="section" aria-labelledby="achievements-title">
      <div className="section-inner">
        <SectionHeading id="achievements" copy={sections.achievements} />

        <ul className="medals">
          {medals.map((medal, index) => {
            const Icon = medalIcons[medal.shape]
            return (
              <li
                key={medal.title}
                data-reveal
                style={{ '--reveal-delay': `${index * 100}ms` } as CSSProperties}
              >
                <div className="card medal">
                  <span className="medal-badge">
                    <Icon className="medal-icon" />
                  </span>
                  <h3 className="medal-title">{medal.title}</h3>
                  <p className="medal-detail">{medal.detail}</p>
                </div>
              </li>
            )
          })}
        </ul>

      </div>
    </section>
  )
}
