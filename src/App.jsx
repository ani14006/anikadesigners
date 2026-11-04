import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { About, Benefits, FinalCta, Positioning, Programs, Results, Stats, Testimonials } from './components/Sections';
import Footer from './components/Footer';
import NeedleCursor from './components/NeedleCursor';
import ConsentBanner from './components/ConsentBanner';
import { NotFound } from './pages/Legal';
import { resolveRoute } from './routes';
import { useRevealOnScroll } from './hooks';
import { initAnalytics, installClickTracking } from './analytics';

export default function App({ pathname = '/' }) {
  useRevealOnScroll();
  useEffect(() => {
    initAnalytics();
    return installClickTracking();
  }, []);

  // In-page links (#section): scroll explicitly. The browser skips the jump when the URL
  // already ends in the same #hash (e.g. a second click on a "#contact" link after scrolling back up).
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
      const hash = a?.getAttribute('href');
      if (!hash || hash.length < 2) return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (location.hash !== hash) history.pushState(null, '', hash);
      // Wait two frames so a closing mobile menu has released its scroll lock and collapsed first.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      }));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const route = resolveRoute(pathname);
  const isHome = route.kind === 'home';

  let page;
  if (isHome) {
    page = (
      <>
        <Hero />
        <Positioning />
        <Stats />
        <About />
        <Benefits />
        <Programs />
        <Results />
        <Testimonials />
        <FinalCta />
      </>
    );
  } else if (route.kind === 'policy') {
    const { Component } = route.route;
    page = <Component />;
  } else {
    page = <NotFound />;
  }

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar isHome={isHome} />
      <main id="main">{page}</main>
      <Footer isHome={isHome} />
      <NeedleCursor />
      <ConsentBanner />
    </>
  );
}
