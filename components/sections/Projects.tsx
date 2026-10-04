import type { CSSProperties } from 'react'
import { ExternalLink } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { GithubIcon } from '@/components/SocialIcons'
import { UncorkLetter } from '@/components/UncorkLetter'
import { projects, sections } from '@/data/profile'

function Bottle() {
  return (
    <svg className="bottle-svg" viewBox="0 0 300 110" aria-hidden="true" focusable="false">
      <path
        className="glass-fill"
        d="M38 22H196C219 22 229 34 238 40H262V70H238C229 76 219 88 196 88H38C22 88 12 74 12 55S22 22 38 22Z"
      />
      <g className="letter-roll">
        <rect className="paper" x="52" y="40" width="142" height="30" rx="15" />
        <circle className="paper" cx="66" cy="55" r="11" />
        <path className="paper-curl" d="M66 49a6 6 0 1 1-5 9" />
        <rect className="ribbon" x="122" y="38.5" width="9" height="33" rx="2" />
      </g>
      <path
        className="glass-edge"
        d="M38 22H196C219 22 229 34 238 40H262V70H238C229 76 219 88 196 88H38C22 88 12 74 12 55S22 22 38 22Z"
      />
      <path className="shine" d="M44 31H190" />
      <path className="shine shine-soft" d="M27 44v20" />
      <g className="cork">
        <rect x="262" y="42" width="24" height="26" rx="4" />
        <path d="M268 45v20M274 45v20M280 45v20" />
      </g>
    </svg>
  )
}

export function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="section-inner">
        <SectionHeading id="projects" copy={sections.projects} />

        <ul className="bottles">
          {projects.map((project, index) => (
            <li
              key={project.id}
              id={`project-${project.id}`}
              data-reveal
              style={{ '--reveal-delay': `${(index % 2) * 110}ms` } as CSSProperties}
            >
              <article className="card bottle-card" data-glass={project.glass} aria-labelledby={`project-${project.id}-title`}>
                <div className="bottle-art" aria-hidden="true">
                  <div className="bottle-light" />
                  <span className="bottle-bubble" />
                  <span className="bottle-bubble" />
                  <span className="bottle-bubble" />
                  <div className="bottle-float">
                    <Bottle />
                  </div>
                </div>

                <div className="bottle-body">
                  <p className="bottle-meta">
                    {project.category}
                    {project.flagship && <span className="bottle-flag">Flagship</span>}
                  </p>
                  <h3 id={`project-${project.id}-title`} className="bottle-title">
                    {project.title}
                  </h3>
                  <p className="bottle-tagline">{project.tagline}</p>
                  {project.event && <p className="bottle-event">{project.event}</p>}
                  <p className="bottle-desc">{project.summary}</p>
                  <ul className="tags" aria-label="Tech stack">
                    {project.stack.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>

                  <div className="bottle-actions">
                    <UncorkLetter project={project} />
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                        aria-label={`Code for ${project.title} on GitHub`}
                      >
                        <GithubIcon className="h-4 w-4" /> Code
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                        aria-label={`Live demo of ${project.title}`}
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" /> Live demo
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
