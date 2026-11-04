import { FOOTER_PROGRAMS, NAV_LINKS } from '../content';
import { SITE_CONFIG } from '../config';
import { POLICY_ROUTES } from '../routes';
import { analyticsEnabled, openCookieSettings } from '../analytics';
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from './SocialIcons';

const FOOTER_LABELS = { '#about': 'About AAH', '#results': 'Student Results', '#testimonials': 'Success Stories' };

export default function Footer({ isHome = true }) {
  const to = (href) => (isHome ? href : `/${href}`);
  const { social, whatsappNumber } = SITE_CONFIG;
  const socials = [
    { label: 'Instagram', Icon: InstagramIcon, href: social.instagram },
    { label: 'YouTube', Icon: YouTubeIcon, href: social.youtube },
    { label: 'WhatsApp', Icon: WhatsAppIcon, href: whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : '' },
  ];
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="footer__logo">AAH</span>
          <span className="footer__logo-sub">Aari Embroidery Artist Hub</span>
          <p>Empowering women to transform creativity into confident, profitable home-based businesses through skills, mentorship and community.</p>
        </div>

        <nav className="footer__links" aria-labelledby="footer-quick">
          <h2 id="footer-quick" className="footer__heading">Quick Links</h2>
          {NAV_LINKS.map((l) => <a key={l.href} href={to(l.href)}>{FOOTER_LABELS[l.href] || l.label}</a>)}
        </nav>

        <nav className="footer__links" aria-labelledby="footer-programs">
          <h2 id="footer-programs" className="footer__heading">Programs</h2>
          {FOOTER_PROGRAMS.map((p) => <a key={p} href={to('#programs')}>{p}</a>)}
        </nav>

        <div className="footer__social">
          <h2 className="footer__heading">Connect</h2>
          <div className="footer__social-icons">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href || to('#contact')}
                aria-label={s.href ? `${s.label} (opens in a new tab)` : `${s.label} – contact us`}
                title={s.label}
                {...(s.href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <s.Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <nav className="footer__legal container" aria-label="Legal">
        {POLICY_ROUTES.map((r) => <a key={r.path} href={r.path}>{r.label}</a>)}
        {analyticsEnabled && <button type="button" onClick={openCookieSettings}>Cookie Settings</button>}
      </nav>

      <div className="footer__bottom container">
        <p>&copy; 2026 Anika Designers | Aari Embroidery Artist Hub. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
