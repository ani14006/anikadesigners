import { Component, lazy, Suspense, useEffect, useState } from 'react';
import { HERO_CARDS } from '../content';
import { supportsWebGL, useMediaQuery, useReducedMotion } from '../hooks';

// Portrait renders at most 360 CSS px wide (~66vw on phones).
const SIZES = '(max-width: 480px) 66vw, 360px';

const HeroScene = lazy(() => import('./HeroScene'));

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { console.warn('[hero-scene] disabled:', err); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function Hero() {
  const reduced = useReducedMotion();
  // 3D only on larger, mouse-driven screens; phones and tablets keep the static CSS visual.
  const desktop = useMediaQuery('(min-width: 1025px) and (pointer: fine)');
  const [load3D, setLoad3D] = useState(false);

  useEffect(() => {
    if (!desktop || !supportsWebGL()) { setLoad3D(false); return undefined; }
    // Defer until the browser is idle so the 3D chunk never competes with first paint.
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 600));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => setLoad3D(true), { timeout: 2000 });
    return () => cancel(id);
  }, [desktop]);

  return (
    <section className="hero" id="home">
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="eyebrow enter" style={{ '--d': '0ms' }}>Welcome to Aari Embroidery Artist Hub</p>
          <h1 className="hero__headline enter" style={{ '--d': '90ms' }}>Turn Your Aari Embroidery Skill Into a <span>Confident Home-Based Business</span></h1>
          <p className="hero__sub enter" style={{ '--d': '180ms' }}>Learn the right skills, create beautiful products, build your brand and start getting paid for your creativity — with step-by-step guidance, mentorship and a supportive community.</p>
          <p className="hero__sub enter" style={{ '--d': '240ms' }}>Whether you are a complete beginner or already taking orders, AAH gives you a clear path to move forward.</p>
          <div className="hero__ctas enter" style={{ '--d': '320ms' }}>
            <a href="#contact" className="btn btn--primary">Start Your Journey</a>
            <a href="#programs" className="btn btn--outline">Explore Programs</a>
          </div>
        </div>

        <div className={`hero__visual${load3D ? ' has-3d' : ''}`}>
          <div className="blob blob--1" aria-hidden="true" />
          <div className="blob blob--2" aria-hidden="true" />
          <div className="ring ring--1" aria-hidden="true" />
          <div className="ring ring--2" aria-hidden="true" />
          <figure className="coach-portrait">
            <div className="coach-portrait__outline" aria-hidden="true" />
            <div className="coach-portrait__media">
              <picture>
                <source type="image/webp" srcSet="/assets/coach-portrait-480.webp 480w, /assets/coach-portrait-720.webp 720w, /assets/coach-portrait.webp 1000w" sizes={SIZES} />
                <img src="/assets/coach-portrait-720.jpg" srcSet="/assets/coach-portrait-480.jpg 480w, /assets/coach-portrait-720.jpg 720w, /assets/coach-portrait.jpg 1000w" sizes={SIZES} alt="Umasivasankar, Founder and Mentor of AAH – Aari Embroidery Artist Hub" width="1000" height="1300" fetchPriority="high" decoding="async" />
              </picture>
            </div>
            <figcaption className="coach-portrait__badge"><span className="coach-portrait__name">Umasivasankar</span><span className="coach-portrait__role">Founder &amp; Mentor</span></figcaption>
          </figure>
          {load3D && (
            <SceneBoundary>
              <Suspense fallback={<span className="stitch-loader hero-scene__loader" aria-hidden="true" />}>
                <HeroScene reduced={reduced} />
              </Suspense>
            </SceneBoundary>
          )}
          {HERO_CARDS.map((c, i) => (
            <div key={c.label} className={`hero-card hero-card--${i + 1}`}>
              <span className="hero-card__num">{c.num}</span>
              <span className="hero-card__label">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
