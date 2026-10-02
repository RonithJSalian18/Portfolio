import { BackToTop } from '@/components/BackToTop'
import { WaveDivider } from '@/components/WaveDivider'
import { footer, navLinks, profile, socials } from '@/lib/content'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <WaveDivider from="sand-wet" to="sea-deep" variant="surf" />
      <div className="footer-sea grain">
        <div className="footer-plankton" aria-hidden="true" />
        <div className="footer-inner">
          <div className="footer-brand">
            <p className="footer-name">{profile.name}</p>
            <p className="footer-blurb">{footer.blurb}</p>
          </div>
          <nav aria-labelledby="footer-nav-title">
            <h2 id="footer-nav-title" className="footer-heading">
              Navigation
            </h2>
            <ul>
              {[{ label: 'Home', href: '#hero' }, ...navLinks].map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="footer-heading">Connect</h2>
            <ul>
              {socials.map((social) => (
                <li key={social.key}>
                  <a
                    href={social.href}
                    {...(social.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {year} {profile.name}. All rights reserved.
          </p>
          <p>{footer.credit}</p>
        </div>
      </div>
      <BackToTop />
    </footer>
  )
}
