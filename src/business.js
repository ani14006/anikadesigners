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
  legalName: '', // Registered name of the proprietor / firm / company operating Anika Designers
  entityType: '', // e.g. "sole proprietorship", "partnership firm", "LLP", "private limited company"
  address: '', // Registered / communication address (full postal address)
  email: '', // Customer support email
  phone: '', // Customer support phone / WhatsApp
  supportHours: '', // e.g. "Monday–Saturday, 10:00 am – 6:00 pm IST"
  jurisdictionCity: '', // City whose courts have jurisdiction, e.g. "Chennai"
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
    accessDuration: '', // e.g. "12 months from the date of enrolment"
    liveSessionPolicy: '', // what happens to missed live sessions / batch transfers
    paymentModes: '', // e.g. "UPI, debit/credit card and net banking via Razorpay"
  },

  // Set to true only after a qualified lawyer has reviewed the policy pages.
  policiesReviewed: false,
  policiesLastUpdated: '4 November 2026',
};
