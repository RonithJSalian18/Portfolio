import type { CSSProperties } from 'react'
import { GraduationCap, Languages, MapPin, Sparkles } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { facts, profile, sections } from '@/data/profile'

const factIcons = [MapPin, GraduationCap, Sparkles, Languages]

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
                  <span className="about-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                </div>
              )
            })}
          </dl>
        </div>
      </div>
    </section>
  )
}
