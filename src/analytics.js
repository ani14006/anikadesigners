import { SITE_CONFIG } from './config';

/*
 * Consent-gated Google Analytics 4.
 * - Nothing from Google Analytics loads until the visitor clicks "Accept".
 * - Rejecting (or withdrawing later) disables GA and removes its cookies.
 * - track() is a no-op without consent or without a measurement ID.
 */
const KEY = 'aah-consent';
const ID = SITE_CONFIG.ga4MeasurementId;
export const analyticsEnabled = !!ID;
let loaded = false;

export function getConsent() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

function deleteGaCookies() {
  const host = location.hostname;
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
  document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => n === '_ga' || n.startsWith('_ga_')).forEach((name) => {
    domains.forEach((d) => { document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`; });
  });
}

function loadGA() {
  if (!ID || loaded || typeof window === 'undefined') return;
  loaded = true;
  window[`ga-disable-${ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); }; // eslint-disable-line prefer-rest-params
  window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
  window.gtag('js', new Date());
  window.gtag('config', ID);
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ID)}`;
  document.head.appendChild(s);
}

export function setConsent(value) {
  try { localStorage.setItem(KEY, value); } catch { /* storage blocked: choice applies to this page view only */ }
  if (value === 'granted') loadGA();
  else {
    if (ID) window[`ga-disable-${ID}`] = true;
    if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
    deleteGaCookies();
  }
  window.dispatchEvent(new CustomEvent('aah-consent-change', { detail: value }));
}

export function initAnalytics() {
  if (ID && getConsent() === 'granted') loadGA();
}

export function openCookieSettings() {
  window.dispatchEvent(new Event('aah-open-cookie-settings'));
}

export function track(name, params = {}) {
  if (!ID || getConsent() !== 'granted' || !window.gtag) return;
  window.gtag('event', name, params);
}

/** Delegated click tracking for WhatsApp, phone, email and program-interest links. */
export function installClickTracking() {
  const onClick = (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!a) return;
    const href = a.getAttribute('href');
    if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) track('whatsapp_click', { link_location: a.closest('footer') ? 'footer' : 'page' });
    else if (href.startsWith('tel:')) track('phone_click');
    else if (href.startsWith('mailto:')) track('email_click');
    if (a.classList.contains('program-card__link')) {
      track('program_interest', { program_name: a.closest('.program-card')?.querySelector('h3')?.textContent || '' });
    }
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
