import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { About, Benefits, FinalCta, Positioning, Programs, Results, Stats, Testimonials } from './components/Sections';
import Contact from './components/Contact';
import Footer from './components/Footer';
import NeedleCursor from './components/NeedleCursor';
import { useRevealOnScroll } from './hooks';

export default function App() {
  useRevealOnScroll();
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main">
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
      </main>
      <Footer />
      <NeedleCursor />
    </>
  );
}
