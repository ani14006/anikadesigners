import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../content';
import Logo from './Logo';

export default function Navbar({ isHome = true }) {
  // On the legal pages, section links point back to the home page.
  const to = (href) => (isHome ? href : `/${href}`);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(isHome ? '#home' : '');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: underline the link for the section currently in view.
  useEffect(() => {
    if (!isHome) return undefined;
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [isHome]);

  // While the mobile menu is open: lock background scroll, close on Escape or when resized to desktop.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const mql = window.matchMedia('(min-width: 901px)');
    const onWide = () => mql.matches && setOpen(false);
    document.documentElement.classList.add('menu-open');
    window.addEventListener('keydown', onKey);
    mql.addEventListener('change', onWide);
    return () => {
      document.documentElement.classList.remove('menu-open');
      window.removeEventListener('keydown', onKey);
      mql.removeEventListener('change', onWide);
    };
  }, [open]);

  // Release the scroll lock synchronously so the browser can perform the anchor jump for this same tap.
  const close = () => {
    document.documentElement.classList.remove('menu-open');
    setOpen(false);
  };
  const linkClass = (href) => `nav-link${active === href ? ' is-active' : ''}`;

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="container navbar__inner">
        <a href={isHome ? '#home' : '/'} className="navbar__logo" aria-label="AAH – Aari Embroidery Artist Hub, home"><Logo size={46} className="navbar__mark" /><span className="navbar__logo-text">AAH<span className="navbar__logo-sub">Aari Embroidery Artist Hub</span></span></a>

        <nav className="navbar__links" id="navLinks" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={to(l.href)} className={linkClass(l.href)} aria-current={active === l.href ? 'true' : undefined}>{l.label}</a>
          ))}
        </nav>

        <a href={to('#programs')} className="btn btn--primary navbar__cta">Explore Programs</a>

        <button
          className={`navbar__toggle${open ? ' active' : ''}`}
          id="navToggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="navMobile"
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`navbar__mobile${open ? ' open' : ''}`} id="navMobile">
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={to(l.href)} className={linkClass(l.href)} onClick={close}>{l.label}</a>
        ))}
        <a href={to('#programs')} className="btn btn--primary" style={{ marginTop: 8 }} onClick={close}>Explore Programs</a>
      </div>
    </header>
  );
}
