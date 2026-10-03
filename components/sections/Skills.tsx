import type { CSSProperties } from 'react'
import { SectionHeading } from '@/components/SectionHeading'
import { proficiency, projectsUsing, sections, skillGroups } from '@/lib/content'

const listFormat = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' })
const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="section-inner">
        <SectionHeading id="skills" copy={sections.skills} />

        <div className="pools">
          {skillGroups.map((group, index) => {
            const pebbles = group.skills.map((skill) => ({ skill, usedIn: projectsUsing(skill) }))
            const hasShiny = pebbles.some((pebble) => pebble.usedIn.length > 0)
            const titleId = `pool-${slug(group.name)}`

            return (
              <article
                key={group.name}
                className="pool"
                aria-labelledby={titleId}
                data-reveal
                style={{ '--reveal-delay': `${(index % 3) * 90}ms` } as CSSProperties}
              >
                <h3 id={titleId} className="pool-title">
                  {group.name}
                </h3>
                <ul className="pebbles">
                  {pebbles.map(({ skill, usedIn }) => {
                    if (usedIn.length === 0) {
                      return (
                        <li key={skill} className="pebble">
                          <span className="pebble-stone">{skill}</span>
                        </li>
                      )
                    }
                    const tipId = `${titleId}-${slug(skill)}`
                    return (
                      <li key={skill} className="pebble pebble-shiny">
                        <button type="button" className="pebble-stone" aria-describedby={tipId}>
                          {skill}
                        </button>
                        <span id={tipId} role="tooltip" className="pebble-tip">
                          Used in {listFormat.format(usedIn)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
                <p className="pool-caption" aria-hidden="true">
                  {hasShiny ? 'Glinting pebbles show where I used them' : `${group.skills.length} skills`}
                </p>
              </article>
            )
          })}
        </div>

        <div className="card gauges" data-reveal>
          <h3>Proficiency Summary</h3>
          <ul>
            {proficiency.map((item) => (
              <li key={item.skill}>
                <div className="gauge-label">
                  <span>{item.skill}</span>
                  <span>{item.level}%</span>
                </div>
                <div className="gauge" style={{ '--level': `${item.level}%` } as CSSProperties} aria-hidden="true">
                  <span className="gauge-fill" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
