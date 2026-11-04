import { FOOTER_PROGRAMS, NAV_LINKS } from '../content';
import { SITE_CONFIG } from '../config';

const FOOTER_LABELS = { '#about': 'About AAH', '#results': 'Student Results', '#testimonials': 'Success Stories' };

export default function Footer() {
  const { social, whatsappNumber } = SITE_CONFIG;
  const socials = [
    { label: 'Instagram', short: 'IG', href: social.instagram },
    { label: 'YouTube', short: 'YT', href: social.youtube },
    { label: 'WhatsApp', short: 'WA', href: whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : '' },
  ];
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="footer__logo">AAH</span>
          <span className="footer__logo-sub">Aari Embroidery Artist Hub</span>
          <p>Empowering women to transform creativity into confident, profitable home-based businesses through skills, mentorship and community.</p>
        </div>

        <nav className="footer__links" aria-label="Quick links">
          <h4>Quick Links</h4>
          {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{FOOTER_LABELS[l.href] || l.label}</a>)}
        </nav>

        <nav className="footer__links" aria-label="Programs">
          <h4>Programs</h4>
          {FOOTER_PROGRAMS.map((p) => <a key={p} href="#programs">{p}</a>)}
        </nav>

        <div className="footer__social">
          <h4>Connect</h4>
          <div className="footer__social-icons">
            {socials.map((s) => (
              <a
                key={s.short}
                href={s.href || '#contact'}
                aria-label={s.label}
                {...(s.href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {s.short}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>&copy; 2026 Anika Designers | Aari Embroidery Artist Hub. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
