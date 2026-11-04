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
          {/* Lightweight static embroidery (needle + silk thread + pearls) for phones, tablets and no-WebGL; hidden once 3D loads. */}
          <svg className="hero-stitch" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="heroNeedle" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#F1D6A6" />
                <stop offset="0.5" stopColor="#B9844F" />
                <stop offset="1" stopColor="#6E4824" />
              </linearGradient>
            </defs>
            <path className="hero-stitch__thread" pathLength="1" d="M352 46 C 380 70, 372 130, 360 190 S 372 300, 356 360 S 330 452, 268 468" />
            <path className="hero-stitch__zari" pathLength="1" d="M352 46 C 366 90, 382 160, 370 240 S 378 360, 352 430" />
            <path d="M286 110 L352 44 L356 48 L290 114 Z" fill="url(#heroNeedle)" stroke="#6E4824" strokeWidth="0.6" />
            <ellipse cx="347" cy="51" rx="4" ry="1.3" transform="rotate(-45 347 51)" fill="#FBF0E5" />
            <g className="hero-stitch__pearls">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <circle key={a} cx={32 + Math.cos((a * Math.PI) / 180) * 14} cy={250 + Math.sin((a * Math.PI) / 180) * 14} r="4.2" />
              ))}
              <circle className="hero-stitch__bead" cx="32" cy="250" r="5.5" />
            </g>
          </svg>
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
