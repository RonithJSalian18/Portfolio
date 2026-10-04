import { Code2, Download, Mail } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'
import { SectionHeading } from '@/components/SectionHeading'
import { GithubIcon, LinkedinIcon } from '@/components/SocialIcons'
import { RESUME_URL, sections, socials, type SocialKey } from '@/data/profile'

const channelIcons: Record<SocialKey, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  leetcode: Code2,
}
const channelOrder: SocialKey[] = ['email', 'linkedin', 'github', 'leetcode']
const channels = channelOrder.map((key) => {
  const social = socials.find((s) => s.key === key)!
  return { Icon: channelIcons[key], label: social.label, value: social.handle, href: social.href }
})

/** The bottom of the sea: a sunken wreck and a half-open treasure chest, lit by a few glowing specks */
function DeepScene() {
  return (
    <div className="deep-scene" aria-hidden="true">
      <div className="deep-specks" />
      <svg className="deep-wreck" viewBox="0 0 260 120" focusable="false">
        <path d="M6 112 34 66l178 8 42 38z" />
        <path d="M70 70 92 6M128 72l12-58M150 30h-36" fill="none" strokeWidth="3" />
        <path d="M60 80h22v10H60zM100 82h22v10h-22zM140 84h22v10h-22z" className="deep-wreck-ports" />
      </svg>
      <svg className="deep-chest" viewBox="0 0 120 92" focusable="false">
        <ellipse className="chest-glow" cx="60" cy="42" rx="58" ry="22" />
        <path className="chest-lid" d="M12 42 24 10Q60-2 96 10l12 32z" />
        <path className="chest-band" d="M24 10l-8 32M96 10l8 32" fill="none" strokeWidth="5" />
        <ellipse className="chest-gold" cx="60" cy="43" rx="44" ry="8" />
        <circle className="chest-gold" cx="44" cy="38" r="5" />
        <circle className="chest-gold" cx="70" cy="37" r="6" />
        <circle className="chest-gold" cx="58" cy="34" r="4" />
        <rect className="chest-body" x="10" y="42" width="100" height="42" rx="4" />
        <path className="chest-plank" d="M10 56h100M10 70h100" fill="none" strokeWidth="2" />
        <path className="chest-band" d="M26 42v42M94 42v42" fill="none" strokeWidth="6" />
        <rect className="chest-lock" x="53" y="46" width="14" height="14" rx="2" />
      </svg>
      <div className="deep-floor" />
    </div>
  )
}

export function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="section-inner">
        <SectionHeading id="contact" copy={sections.contact} />

        <div className="contact-grid">
          <div className="contact-side" data-reveal>
            <DeepScene />
            <ul className="channels">
              {channels.map(({ Icon, label, value, href }) => {
                const external = href.startsWith('http')
                return (
                  <li key={label}>
                    <a
                      href={href}
                      className="card channel"
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <span className="channel-icon">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="channel-text">
                        <span className="channel-label">{label}</span>
                        <span className="channel-value">{value}</span>
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
            <a
              href={RESUME_URL}
              className="btn btn-primary contact-resume"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download résumé (PDF, opens in a new tab)"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Resume
            </a>
          </div>

          <div data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
