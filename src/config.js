/*
 * Contact + social settings.
 *   whatsappNumber – international format, digits only, e.g. '919876543210' (enables the footer WhatsApp link)
 *   email          – support email, set in src/business.js
 */
import { BUSINESS } from './business';

export const SITE_CONFIG = {
  whatsappNumber: '918526214202',
  email: BUSINESS.email, // support email (set in src/business.js)
  // Google Analytics 4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty = no analytics and no cookie banner.
  // Analytics loads only after the visitor accepts in the cookie banner.
  ga4MeasurementId: '',
  // Google Search Console HTML-tag verification token (the content="..." value). Empty = not added.
  // DNS (TXT record) verification is preferred for a Domain property and needs no code change.
  googleSiteVerification: '',
  social: {
    instagram: 'https://www.instagram.com/anika.designers/',
    youtube: 'https://www.youtube.com/@anikadesigners',
  },
};
