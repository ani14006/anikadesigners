import { PrivacyPolicy, TermsPage, RefundPolicy, CookiePolicy, Disclaimer, ContactGrievance } from './pages/Legal';

const BRAND = 'AAH – Aari Embroidery Artist Hub';

export const HOME_META = {
  path: '/',
  title: 'Aari Embroidery Courses for Women | AAH – Anika Designers',
  description: 'Learn Aari embroidery and turn it into a home-based business with AAH by Anika Designers: beginner to advanced courses, mentorship and a women’s community.',
};

/** Legal pages: each is prerendered to /<slug>/index.html with its own title, description and canonical. */
export const POLICY_ROUTES = [
  { path: '/privacy-policy/', label: 'Privacy Policy', title: `Privacy Policy | ${BRAND}`, description: 'How AAH – Aari Embroidery Artist Hub collects, uses and protects your personal data, and how to exercise your rights under Indian data protection law.', Component: PrivacyPolicy },
  { path: '/terms-and-conditions/', label: 'Terms & Conditions', title: `Terms and Conditions | ${BRAND}`, description: 'Terms for using the AAH website and enrolling in AAH Aari embroidery programs, including access, fees, intellectual property and disputes.', Component: TermsPage },
  { path: '/refund-policy/', label: 'Refund Policy', title: `Refund and Cancellation Policy | ${BRAND}`, description: 'When and how you can cancel an AAH Aari embroidery program enrolment and receive a refund.', Component: RefundPolicy },
  { path: '/cookie-policy/', label: 'Cookie Policy', title: `Cookie Policy | ${BRAND}`, description: 'The cookies and browser storage used on the AAH website and how to manage your consent.', Component: CookiePolicy },
  { path: '/disclaimer/', label: 'Disclaimer', title: `Disclaimer | ${BRAND}`, description: 'Important information about student results, earnings, and the educational nature of AAH programs.', Component: Disclaimer },
  { path: '/contact-grievance/', label: 'Contact & Grievance', title: `Contact and Grievance Redressal | ${BRAND}`, description: 'Contact details and the grievance redressal process for AAH – Aari Embroidery Artist Hub students and website visitors.', Component: ContactGrievance },
];

export const NOT_FOUND_META = { path: '/404.html', title: `Page Not Found | ${BRAND}`, description: 'The page you were looking for could not be found.' };

export function resolveRoute(pathname) {
  const p = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (p === '/' || p === '/index.html/') return { kind: 'home' };
  const policy = POLICY_ROUTES.find((r) => r.path === p || `${r.path}index.html/` === p);
  return policy ? { kind: 'policy', route: policy } : { kind: '404' };
}
