/*
 * Single source of truth for business facts used in the legal pages, footer and structured data.
 * NOTHING here may be guessed. Empty values render as a visible "To be provided" marker on the
 * policy pages, and structured data simply omits them.
 */
export const SITE_URL = 'https://www.anikadesigners.com';

export const BUSINESS = {
  brandName: 'AAH – Aari Embroidery Artist Hub',
  tradeName: 'Anika Designers',
  founder: 'Umasivasankar',

  // ---- Required before launch ----
  legalName: 'Anika Designers Academy', // Registered name of the proprietor / firm / company operating Anika Designers
  entityType: '', // e.g. "sole proprietorship", "partnership firm", "LLP", "private limited company"
  email: 'admin@anikadesigners.com', // Customer support email
  phone: '+91 85262 14202', // Customer support phone / WhatsApp
  supportHours: '', // e.g. "Monday–Saturday, 10:00 am – 6:00 pm IST"
  jurisdiction: 'Tamil Nadu', // State / city whose courts have jurisdiction
  gstin: '', // Only if GST-registered; leave empty otherwise

  grievanceOfficer: {
    name: '',
    designation: '',
    email: '',
    phone: '',
  },

  // ---- Commercial terms (business decisions — do not guess) ----
  refund: {
    windowDays: '', // e.g. "7" — days after payment within which a cancellation is eligible
    eligibilityCondition: '', // e.g. "provided not more than 2 recorded lessons have been accessed"
    deduction: '', // e.g. "a processing fee of 5%" or "no deduction"
    processingDays: '', // e.g. "7–10 working days" after approval
    liveSessionPolicy: 'Recordings of live sessions are not provided. Which live sessions you can join depends on your membership plan.',
    paymentModes: 'Google Pay (GPay) and PhonePe',
  },

  // Set to true only after a qualified lawyer has reviewed the policy pages.
  policiesReviewed: false,
  policiesLastUpdated: '4 November 2026',
};
