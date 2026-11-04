import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../content';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: underline the link for the section currently in view.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);
  const linkClass = (href) => `nav-link${active === href ? ' is-active' : ''}`;

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="container navbar__inner">
        <a href="#home" className="navbar__logo">AAH<span className="navbar__logo-sub">Aari Embroidery Artist Hub</span></a>

        <nav className="navbar__links" id="navLinks" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={linkClass(l.href)} aria-current={active === l.href ? 'true' : undefined}>{l.label}</a>
          ))}
        </nav>

        <a href="#programs" className="btn btn--primary navbar__cta">Explore Programs</a>

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
          <a key={l.href} href={l.href} className={linkClass(l.href)} onClick={close}>{l.label}</a>
        ))}
        <a href="#programs" className="btn btn--primary" style={{ marginTop: 8 }} onClick={close}>Explore Programs</a>
      </div>
    </header>
  );
}
