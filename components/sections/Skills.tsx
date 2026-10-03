import type { CSSProperties } from 'react'
import { SectionHeading } from '@/components/SectionHeading'
import { sections, skillGroups, usesOf } from '@/data/profile'

const listFormat = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' })
const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="section-inner">
        <SectionHeading id="skills" copy={sections.skills} />

        <div className="pools">
          {skillGroups.map((group, index) => {
            const titleId = `pool-${group.id}`
            return (
              <article
                key={group.id}
                className="pool"
                aria-labelledby={titleId}
                data-reveal
                style={{ '--reveal-delay': `${(index % 3) * 90}ms` } as CSSProperties}
              >
                <h3 id={titleId} className="pool-title">
                  {group.name}
                </h3>
                <ul className="pebbles">
                  {group.skills.map((skill) => {
                    const uses = usesOf(skill)
                    if (uses.length === 0) {
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
                          Used in {listFormat.format(uses.map((use) => use.label))}
                        </span>
                      </li>
                    )
                  })}
                </ul>
                <p className="pool-caption" aria-hidden="true">
                  Glinting pebbles show where I used them
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
