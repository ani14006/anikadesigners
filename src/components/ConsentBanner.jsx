import { useEffect, useState } from 'react';
import { analyticsEnabled, getConsent, setConsent } from '../analytics';

/** Shown only when GA4 is configured. Accept and Reject are equally prominent; no pre-ticked choices. */
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!analyticsEnabled) return undefined;
    if (!getConsent()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener('aah-open-cookie-settings', reopen);
    return () => window.removeEventListener('aah-open-cookie-settings', reopen);
  }, []);

  if (!analyticsEnabled || !open) return null;
  const choose = (v) => { setConsent(v); setOpen(false); };
  const current = getConsent();

  return (
    <section className="consent" role="dialog" aria-modal="false" aria-labelledby="consent-title" aria-describedby="consent-text">
      <div className="consent__inner">
        <h2 id="consent-title" className="consent__title">Your privacy</h2>
        <p id="consent-text" className="consent__text">
          We’d like to use Google Analytics cookies to understand how visitors use this website. They are optional and only set if you accept.
          {current && <> Current choice: <strong>{current === 'granted' ? 'accepted' : 'rejected'}</strong>.</>}{' '}
          <a href="/cookie-policy/">Cookie Policy</a>
        </p>
        <div className="consent__actions">
          <button type="button" className="btn btn--outline" onClick={() => choose('denied')}>Reject</button>
          <button type="button" className="btn btn--primary" onClick={() => choose('granted')}>Accept</button>
        </div>
      </div>
    </section>
  );
}
