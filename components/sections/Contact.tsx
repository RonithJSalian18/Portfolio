import { Mail, Phone } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'
import { SectionHeading } from '@/components/SectionHeading'
import { GithubIcon, LinkedinIcon } from '@/components/SocialIcons'
import { profile, sections, socials } from '@/lib/content'

const social = (key: string) => socials.find((s) => s.key === key)!

const channels = [
  { Icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { Icon: Phone, label: 'Phone', value: profile.phone.display, href: profile.phone.href },
  { Icon: LinkedinIcon, label: 'LinkedIn', value: social('linkedin').handle, href: social('linkedin').href },
  { Icon: GithubIcon, label: 'GitHub', value: social('github').handle, href: social('github').href },
]

function Lighthouse() {
  return (
    <div className="lighthouse-scene" aria-hidden="true">
      <div className="lh-stars" />
      <svg className="lighthouse-svg" viewBox="0 0 320 240" preserveAspectRatio="xMidYMax meet" focusable="false">
        <defs>
          <linearGradient id="beam-right" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" className="beam-stop" />
            <stop offset="1" className="beam-stop-fade" />
          </linearGradient>
          <linearGradient id="beam-left" x1="1" x2="0" y1="0" y2="0">
            <stop offset="0" className="beam-stop" />
            <stop offset="1" className="beam-stop-fade" />
          </linearGradient>
          <clipPath id="lighthouse-clip">
            <path d="M138 206 146 90h28l8 116z" />
          </clipPath>
        </defs>
        <g className="lh-beam">
          <path d="M160 70 340 26v88z" fill="url(#beam-right)" />
          <path d="M160 70-20 26v88z" fill="url(#beam-left)" />
        </g>
        <path className="lh-rock" d="M60 240c6-28 28-40 54-34 16-14 46-14 64-2 24-10 50 0 62 36z" />
        <path className="lh-tower" d="M138 206 146 90h28l8 116z" />
        <g className="lh-stripes" clipPath="url(#lighthouse-clip)">
          <rect x="130" y="104" width="60" height="18" />
          <rect x="130" y="140" width="60" height="18" />
          <rect x="130" y="176" width="60" height="18" />
        </g>
        <rect className="lh-door" x="154" y="188" width="12" height="18" rx="6" />
        <rect className="lh-deck" x="140" y="84" width="40" height="7" rx="2" />
        <rect className="lh-room" x="148" y="58" width="24" height="26" rx="3" />
        <circle className="lh-lamp" cx="160" cy="70" r="6" />
        <path className="lh-roof" d="M144 59 160 42l16 17z" />
      </svg>
      <div className="lh-sea">
        <div className="wave lh-wave-back" />
        <div className="wave lh-wave-front" />
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <section id="contact" className="section grain bg-sand-wet" aria-labelledby="contact-title">
      <div className="section-inner">
        <SectionHeading id="contact" copy={sections.contact} />

        <div className="contact-grid">
          <div className="contact-side" data-reveal>
            <Lighthouse />
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
          </div>

          <div data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
