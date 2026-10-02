import { Code2, Mail } from 'lucide-react'
import { HeroParallax } from '@/components/HeroParallax'
import { GithubIcon, LinkedinIcon } from '@/components/SocialIcons'
import { profile, socials, type SocialKey } from '@/lib/content'

const socialIcons: Record<SocialKey, React.ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  leetcode: Code2,
  email: Mail,
}

export function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero-sky" aria-hidden="true">
        <div className="hero-stars" />
        <div className="hero-clouds">
          <span className="cloud cloud-1" />
          <span className="cloud cloud-2" />
          <span className="cloud cloud-3" />
        </div>
        <div className="hero-dusk" />
        <div className="celestial">
          <div className="sun" />
          <div className="moon" />
        </div>
      </div>

      <div className="hero-content">
        <p className="hero-hello">Hi, I&apos;m</p>
        <h1 id="hero-title" className="hero-name" tabIndex={-1}>
          {profile.name}
        </h1>
        <p className="hero-role">{profile.role}</p>
        <p className="hero-tagline">{profile.tagline}</p>
        <ul className="hero-roles">
          {profile.roles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">
            View Projects
          </a>
          <a href="#contact" className="btn btn-ghost">
            Get in Touch
          </a>
        </div>
        <ul className="hero-socials">
          {socials.map((social) => {
            const Icon = socialIcons[social.key]
            const external = social.href.startsWith('http')
            return (
              <li key={social.key}>
                <a
                  href={social.href}
                  aria-label={`${social.label}: ${social.handle}`}
                  title={social.label}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <Icon aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="hero-scene" aria-hidden="true">
        <div className="reflection reflection-sun" />
        <div className="reflection reflection-moon" />
        <div className="layer layer-far">
          <div className="wave wave-far" />
        </div>
        <div className="layer layer-mid">
          <div className="wave wave-mid" />
        </div>
        <div className="layer layer-near">
          <div className="wave wave-near" />
          <div className="wave-glow">
            <div className="wave wave-edge" />
          </div>
        </div>
        <div className="layer layer-shore">
          <div className="wave wave-shore" />
          <div className="wave wave-shore-foam" />
        </div>
        <div className="layer layer-sand">
          <div className="wave wave-sand" />
        </div>
      </div>

      <HeroParallax />
    </section>
  )
}
