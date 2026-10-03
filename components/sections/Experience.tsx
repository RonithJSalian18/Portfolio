import { SectionHeading } from '@/components/SectionHeading'
import { sections, timeline, type TimelineEntry } from '@/data/profile'

const kindLabels: Record<TimelineEntry['kind'], string> = {
  work: 'Experience',
  education: 'Education',
}

/** The descent line: one stop per role or school, each a little deeper */
export function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="section-inner">
        <SectionHeading id="experience" copy={sections.experience} />

        <ol className="trail">
          {timeline.map((item, index) => (
            <li
              key={`${item.org}-${item.period}`}
              className={`trail-step ${index % 2 === 0 ? 'is-left' : 'is-right'}`}
              data-type={item.kind}
              data-reveal
            >
              <span className="trail-rope" aria-hidden="true" />
              <span className="trail-stop" aria-hidden="true" />
              <span className="trail-depth" aria-hidden="true">
                −{40 + index * 60} m
              </span>
              <article className="card trail-card">
                <p className="trail-meta">
                  <span className="trail-type">{kindLabels[item.kind]}</span>
                  <span className="trail-period">{item.period}</span>
                </p>
                <h3 className="trail-title">{item.title}</h3>
                <p className="trail-org">{item.org}</p>
                <ul className="trail-points">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
