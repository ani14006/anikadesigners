/*
 * Enquiry + social settings. Fill these in before going live.
 * The contact form uses the first channel that is configured, in this order:
 *   1. formEndpoint   – e.g. a Formspree / Getform URL that accepts JSON POSTs
 *   2. whatsappNumber – international format, digits only, e.g. '919876543210'
 *   3. email          – opens the visitor's mail app with the enquiry pre-filled
 * If none are set, the form tells the visitor it is unavailable instead of faking success.
 */
export const SITE_CONFIG = {
  formEndpoint: '',
  whatsappNumber: '',
  email: '',
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
