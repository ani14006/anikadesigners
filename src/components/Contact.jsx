import { useState } from 'react';
import { CircleAlert, CircleCheck, Send } from 'lucide-react';
import { JOURNEY_STAGES } from '../content';
import { SITE_CONFIG } from '../config';

const MESSAGES = {
  sent: 'Thank you! Your enquiry has been sent. Our team will get back to you soon.',
  whatsapp: 'WhatsApp has opened with your enquiry filled in — please tap Send there to reach our team.',
  email: 'Your email app has opened with your enquiry filled in — please press Send there to reach our team.',
  error: 'Sorry, your enquiry could not be sent. Please check your connection and try again.',
  unavailable: 'Online enquiries are not available at the moment. Please try again later.',
};

function buildText(data) {
  return [
    'New AAH enquiry',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.whatsapp && `WhatsApp: ${data.whatsapp}`,
    data.stage && `Journey stage: ${data.stage}`,
    data.message && `Message: ${data.message}`,
  ].filter(Boolean).join('\n');
}

export default function Contact() {
  const [status, setStatus] = useState('idle');

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = Object.fromEntries(new FormData(form).entries());
    const { formEndpoint, whatsappNumber, email } = SITE_CONFIG;

    if (formEndpoint) {
      setStatus('sending');
      try {
        const res = await fetch(formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        form.reset();
        setStatus('sent');
      } catch (err) {
        console.error('[contact] submission failed:', err);
        setStatus('error');
      }
      return;
    }
    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(buildText(data))}`, '_blank', 'noopener');
      setStatus('whatsapp');
      return;
    }
    if (email) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent('AAH Enquiry')}&body=${encodeURIComponent(buildText(data))}`;
      setStatus('email');
      return;
    }
    console.warn('[contact] No enquiry channel configured. Set formEndpoint, whatsappNumber or email in src/config.js.');
    setStatus('unavailable');
  };

  const ok = ['sent', 'whatsapp', 'email'].includes(status);
  const sending = status === 'sending';

  return (
    <section className="contact" id="contact">
      <div className="container contact__inner">
        <div className="section-head reveal">
          <p className="eyebrow">Contact</p>
          <h2 className="section-title">Have a Question? Let's Help You Find the Right Path.</h2>
          <p className="contact__sub">Whether you are completely new to Aari embroidery, already learning, or ready to grow your existing business, tell us where you are currently in your journey. Our team will help you understand the most suitable AAH program.</p>
        </div>

        <form className="contact__form reveal" onSubmit={onSubmit} noValidate aria-describedby="contact-status">
          <div className="contact__row">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Your name" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="you@example.com" autoComplete="email" required />
            </div>
          </div>
          <div className="contact__row">
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp Number</label>
              <input type="tel" id="whatsapp" name="whatsapp" placeholder="+91 00000 00000" autoComplete="tel" />
            </div>
            <div className="field">
              <label htmlFor="stage">Where are you currently in your Aari journey?</label>
              <select id="stage" name="stage" defaultValue="">
                <option value="">Select an option</option>
                {JOURNEY_STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="4" placeholder="Tell us what you would like help with..." />
          </div>
          <button type="submit" className="btn btn--primary contact__submit" disabled={sending} aria-busy={sending}>
            {sending
              ? <><span className="stitch-loader stitch-loader--light" aria-hidden="true" /> Sending…</>
              : <>Send My Enquiry <Send size={16} strokeWidth={2.2} aria-hidden="true" /></>}
          </button>
          <p id="contact-status" className={`contact__status${status !== 'idle' && !sending ? (ok ? ' is-ok' : ' is-error') : ''}`} role="status" aria-live="polite">
            {status !== 'idle' && !sending && (
              <>
                {ok ? <CircleCheck size={18} aria-hidden="true" /> : <CircleAlert size={18} aria-hidden="true" />}
                <span>{MESSAGES[status]}</span>
              </>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}
