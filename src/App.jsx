import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { About, Benefits, FinalCta, Positioning, Programs, Results, Stats, Testimonials } from './components/Sections';
import Contact from './components/Contact';
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
        <Contact />
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
