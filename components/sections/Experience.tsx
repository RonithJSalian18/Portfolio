import { SectionHeading } from '@/components/SectionHeading'
import { sections, timeline, type TimelineType } from '@/lib/content'

const typeLabels: Record<TimelineType, string> = {
  education: 'Education',
  internship: 'Internship',
  hackathon: 'Hackathon',
  achievement: 'Achievement',
}

export function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="section-inner">
        <SectionHeading id="experience" copy={sections.experience} />

        <ol className="trail">
          {timeline.map((item, index) => (
            <li
              key={`${item.period}-${item.title}`}
              className={`trail-step ${index % 2 === 0 ? 'is-left' : 'is-right'}`}
              data-type={item.type}
              data-reveal
            >
              <span className="trail-rope" aria-hidden="true" />
              <span className="trail-stop" aria-hidden="true" />
              <span className="trail-depth" aria-hidden="true">
                −{30 + index * 35} m
              </span>
              <article className="card trail-card">
                <p className="trail-meta">
                  <span className="trail-type">{typeLabels[item.type]}</span>
                  <span className="trail-period">{item.period}</span>
                </p>
                <h3 className="trail-title">{item.title}</h3>
                <p className="trail-org">{item.organization}</p>
                <p className="trail-desc">{item.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
