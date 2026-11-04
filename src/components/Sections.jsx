import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { BENEFITS, PROGRAMS, RESULTS, STATS, STORIES, VOICES } from '../content';
import { Floral, Paisley } from './Ornaments';
import { useReducedMotion } from '../hooks';

const d = (i, step = 90) => ({ '--d': `${i * step}ms` });

export function Positioning() {
  return (
    <div className="positioning-line">
      <p>Learn the Skill. Create the Product. Build the Brand. Make the Sale.</p>
    </div>
  );
}

export function Stats() {
  return (
    <section className="stats" aria-label="AAH in numbers">
      <div className="container stats__grid">
        {STATS.map((s, i) => (
          <div key={s.label} className="stat reveal" style={d(i)}>
            <span className="stat__num">{s.num}</span>
            <span className="stat__label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Gentle scroll parallax for the About frame (disabled for reduced motion). */
function useParallax(ref, strength = 0.06) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;
    let raf = 0;
    let visible = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) * strength;
      el.style.setProperty('--parallax', `${offset.toFixed(1)}px`);
    };
    const onScroll = () => { if (visible && !raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) onScroll(); });
    io.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      el.style.removeProperty('--parallax');
    };
  }, [ref, strength, reduced]);
}

export function About() {
  const frame = useRef(null);
  useParallax(frame);
  return (
    <section className="about" id="about">
      <div className="container about__grid">
        <div className="about__visual reveal" aria-hidden="true">
          <div className="about-frame" ref={frame}>
            <div className="about-frame__accent" />
            <div className="about-frame__core">
              <Paisley className="about-frame__paisley about-frame__paisley--tr" />
              <Paisley className="about-frame__paisley about-frame__paisley--bl" />
              <span className="about-frame__quote">"</span>
              <p>Your creativity deserves more than appreciation. It can become your identity, confidence and income.</p>
            </div>
          </div>
        </div>

        <div className="about__content reveal" style={d(1)}>
          <p className="eyebrow">Our Story</p>
          <h2 className="section-title">Built to Help Women Turn Creativity Into Income</h2>
          <p>AAH – Aari Embroidery Artist Hub was created with one simple belief: <strong>women who love creativity should have a clear path to turn their skills into a meaningful business.</strong></p>
          <p>What started with teaching Aari embroidery has grown into a complete learning and business ecosystem where women learn not only how to stitch, but also how to create products, price their work, present their brand, market confidently and generate sales.</p>
          <p>Today, thousands of women have learned through our programs, and our growing community is helping women move from <strong>Learning → Creating → Selling → Building a Brand → Growing a Business.</strong></p>
          <p>Our bigger mission is to empower <strong>1,00,000 women</strong> to build confident and financially independent lives through creativity and entrepreneurship.</p>
          <a href="#programs" className="btn btn--outline">Know Our Story</a>
        </div>
      </div>
    </section>
  );
}

export function Benefits() {
  return (
    <section className="benefits">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">Why AAH</p>
          <h2 className="section-title">Everything You Need to Build Your Aari Business</h2>
          <p className="benefits__tagline">From Aari Artist to Aaripreneur.</p>
        </div>
        <div className="benefits__grid">
          {BENEFITS.map((b, i) => (
            <div key={b.title} className="benefit-card reveal" style={d(i)}>
              <div className="benefit-card__icon" aria-hidden="true">{b.icon}</div>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Programs() {
  return (
    <section className="programs" id="programs">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">Our Programs</p>
          <h2 className="section-title">Choose the Right Path for Your Journey</h2>
        </div>
        <div className="programs__grid">
          {PROGRAMS.map((p, i) => (
            <article key={p.tag} className="program-card reveal" style={d(i % 2)}>
              <Floral className="program-card__ornament" />
              <span className="program-card__tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <p className="program-card__subtitle">{p.subtitle}</p>
              {p.body.map((b) =>
                typeof b === 'string'
                  ? <p key={b}>{b}</p>
                  : <p key={b.flow} className="program-card__flow">{b.flow}</p>
              )}
              <span className="program-card__for">{p.bestFor}</span>
              <a href="#contact" className="program-card__link">
                {p.link} <ArrowRight className="program-card__arrow" size={16} strokeWidth={2.2} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Results() {
  return (
    <section className="results" id="results">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">The AAH Journey</p>
          <h2 className="section-title">Real Transformation, Not Just Learning</h2>
        </div>
        <div className="results__list">
          {RESULTS.map(([before, after]) => (
            <div key={before} className="result-row reveal">
              <span className="result-row__before">{before}</span>
              <span className="result-row__arrow" aria-hidden="true">→</span>
              <span className="result-row__after">{after}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">Student Results</p>
          <h2 className="section-title">From Learning Aari to Building Their Own Identity</h2>
          <p className="contact__sub">Behind every result is a woman who decided to stop waiting and start implementing. Here are a few journeys from the AAH community.</p>
        </div>

        <div className="stories__grid">
          {STORIES.map((s, i) => (
            <article key={s.tag} className="story-card reveal" style={d(i)}>
              <span className="story-card__tag">{s.tag}</span>
              <h3>{s.title}</h3>
              <p>{s.before}</p>
              {s.timeline && (
                <ul className="story-card__timeline">
                  {s.timeline.map(([m, v]) => <li key={m}><span>{m}</span><span>{v}</span></li>)}
                </ul>
              )}
              {s.after && <p>{s.after}</p>}
            </article>
          ))}
        </div>

        <div className="stories__cta">
          <a href="#contact" className="btn btn--outline">See More Student Stories</a>
        </div>

        <div className="section-head reveal">
          <p className="eyebrow">Student Voices</p>
          <h2 className="section-title" style={{ fontSize: 'clamp(24px, 3vw, 34px)' }}>Voices From the AAH Community</h2>
        </div>

        <div className="testimonials__grid testimonials__grid--voices">
          {VOICES.map((v, i) => (
            <figure key={v.quote} className="testimonial-card reveal" style={d(i)}>
              <blockquote><p>{v.quote}</p></blockquote>
              <figcaption>
                <span className="testimonial-card__name">{v.name}</span>
                <span className="testimonial-card__role">{v.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="final-cta">
      <div className="container final-cta__inner reveal">
        <h2>Your Aari Business Journey Can Start Here.</h2>
        <p>You don't need to know everything before you begin. Start with the right skill, follow the right path and build one step at a time — with AAH beside you.</p>
        <a href="#programs" className="btn btn--cta">Explore AAH Programs</a>
        <p className="final-cta__tagline">Learn • Create • Brand • Sell • Grow</p>
      </div>
    </section>
  );
}
