import type { CSSProperties } from 'react'
import { Brain, GraduationCap, Heart } from 'lucide-react'
import { Pebbles, Starfish } from '@/components/BeachIcons'
import { SectionHeading } from '@/components/SectionHeading'
import { about, sections } from '@/lib/content'

const cardIcons = [GraduationCap, Brain, Heart]

export function About() {
  return (
    <section id="about" className="section grain bg-sand-1" aria-labelledby="about-title">
      <div className="section-inner">
        <SectionHeading id="about" copy={sections.about} />

        <div className="about-grid">
          <div className="about-story" data-reveal>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <ul className="about-cards">
            {about.cards.map((card, index) => {
              const Icon = cardIcons[index % cardIcons.length]
              return (
                <li
                  key={card.title}
                  data-reveal
                  style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}
                >
                  <div className="card about-card">
                    <span className="about-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <div>
                      <h3>{card.title}</h3>
                      <ul>
                        {card.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <Starfish className="about-starfish" />
      <Pebbles className="about-pebbles" />
    </section>
  )
}
