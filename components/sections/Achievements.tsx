import type { CSSProperties } from 'react'
import { SandDollar, Scallop, Starfish } from '@/components/BeachIcons'
import { SectionHeading } from '@/components/SectionHeading'
import { difficulty, leetcodeStats, medals, sections, type MedalShape } from '@/lib/content'

const medalIcons: Record<MedalShape, React.ComponentType<{ className?: string }>> = {
  'sand-dollar': SandDollar,
  starfish: Starfish,
  scallop: Scallop,
}

export function Achievements() {
  return (
    <section id="achievements" className="section grain bg-sand-5" aria-labelledby="achievements-title">
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

        <div className="achievement-panels">
          <div className="card activity" data-reveal>
            <h3 className="panel-title">Coding Activity</h3>
            <dl className="stats">
              {leetcodeStats.map((stat) => (
                <div key={stat.label} className="stat">
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card difficulty" data-reveal>
            <h3 className="panel-title">Problem Solving by Difficulty</h3>
            <ul>
              {difficulty.map((item) => {
                const percentage = (item.solved / item.total) * 100
                return (
                  <li key={item.level} data-level={item.level.toLowerCase()}>
                    <div className="gauge-label">
                      <span>{item.level}</span>
                      <span>
                        {item.solved}/{item.total}
                      </span>
                    </div>
                    <div className="gauge" style={{ '--level': `${percentage}%` } as CSSProperties} aria-hidden="true">
                      <span className="gauge-fill" />
                    </div>
                    <p className="difficulty-note">
                      {percentage.toFixed(1)}% of all {item.level.toLowerCase()} problems
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
