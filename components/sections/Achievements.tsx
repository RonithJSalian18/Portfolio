import type { CSSProperties } from 'react'
import { Conch, SandDollar, Scallop, Starfish } from '@/components/BeachIcons'
import { SectionHeading } from '@/components/SectionHeading'
import { achievements, sections, type AchievementIcon } from '@/data/profile'

const medalIcons: Record<AchievementIcon, React.ComponentType<{ className?: string }>> = {
  'sand-dollar': SandDollar,
  scallop: Scallop,
  starfish: Starfish,
  conch: Conch,
}

export function Achievements() {
  return (
    <section id="achievements" className="section" aria-labelledby="achievements-title">
      <div className="section-inner">
        <SectionHeading id="achievements" copy={sections.achievements} />

        <ul className="medals">
          {achievements.map((achievement, index) => {
            const Icon = medalIcons[achievement.icon]
            const external = achievement.href?.startsWith('http')
            const title = achievement.href ? (
              <a
                href={achievement.href}
                className="medal-link"
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {achievement.title}
              </a>
            ) : (
              achievement.title
            )
            return (
              <li
                key={achievement.title}
                data-reveal
                style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}
              >
                <div className="card medal">
                  <span className="medal-badge">
                    <Icon className="medal-icon" />
                  </span>
                  <h3 className="medal-title">{title}</h3>
                  <p className="medal-detail">{achievement.detail}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
