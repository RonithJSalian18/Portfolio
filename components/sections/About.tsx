import type { CSSProperties } from 'react'
import { GraduationCap, Languages, Sparkles } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { facts, profile, sections } from '@/data/profile'

// One per fact, in order: focus, studies, languages
const factIcons = [Sparkles, GraduationCap, Languages]

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="section-inner">
        <SectionHeading id="about" copy={sections.about} />

        <div className="about-grid">
          <p className="about-story" data-reveal>
            {profile.bio}
          </p>

          <dl className="about-cards">
            {facts.map((fact, index) => {
              const Icon = factIcons[index % factIcons.length]
              return (
                <div
                  key={fact.label}
                  className="card about-card"
                  data-reveal
                  style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}
                >
                  <dt>
                    <span className="about-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    {fact.label}
                  </dt>
                  <dd>{fact.value}</dd>
                </div>
              )
            })}
          </dl>
        </div>
      </div>
    </section>
  )
}
