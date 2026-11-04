import { BUSINESS } from '../business';
import { SITE_CONFIG } from '../config';
import { openCookieSettings } from '../analytics';
import Logo from '../components/Logo';

const B = BUSINESS;
const R = BUSINESS.refund;
const G = BUSINESS.grievanceOfficer;

/** Renders a business fact, or a clearly visible marker when it has not been provided yet. */
function V({ value, label }) {
  if (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return <a href={`mailto:${value}`}>{value}</a>;
  if (value) return <>{value}</>;
  return <mark className="policy-missing" title="This detail has not been provided yet">[To be provided: {label}]</mark>;
}

const operator = (
  <>
    <V value={B.legalName} label="registered legal name of the business owner / entity" />
    {B.entityType ? `, a ${B.entityType}` : null}
  </>
);

const contactLines = (
  <ul>
    <li>Email: {B.email ? <a href={`mailto:${B.email}`}>{B.email}</a> : <V value="" label="support email" />}</li>
    <li>Phone / WhatsApp: {B.phone ? <><a href={`tel:${B.phone.replace(/\s/g, '')}`}>{B.phone}</a> (<a href={`https://wa.me/${B.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">chat on WhatsApp</a>)</> : <V value="" label="support phone number" />}</li>
  </ul>
);

export function PolicyLayout({ title, intro, children }) {
  return (
    <article className="policy">
      <div className="container policy__inner">
        <header className="policy__head">
          <p className="eyebrow">Legal</p>
          <h1 className="section-title">{title}</h1>
          <p className="policy__updated">Last updated: {B.policiesLastUpdated}</p>
          {!B.policiesReviewed && (
            <p className="policy__draft" role="note">
              This page is a draft awaiting business details and legal review. Items marked “To be provided” will be completed before this policy takes effect.
            </p>
          )}
          {intro && <p className="policy__intro">{intro}</p>}
        </header>
        <div className="policy__body">{children}</div>
        <p className="policy__back"><a href="/" className="btn btn--outline">Back to Home</a></p>
      </div>
    </article>
  );
}

export function PrivacyPolicy() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      intro={<>This Privacy Policy explains how {B.brandName} (“AAH”, “we”, “us”), run by {operator}, collects, uses, shares and protects your personal data when you visit www.anikadesigners.com or contact us about our programs.</>}
    >
      <h2>1. Who is responsible for your data</h2>
      <p>For the purposes of the Digital Personal Data Protection Act, 2023 (“DPDP Act”) and the Information Technology Act, 2000 with the rules made under it, the business named above is the Data Fiduciary responsible for your personal data. You can reach us at:</p>
      {contactLines}

      <h2>2. What personal data we collect</h2>
      <p><strong>Information you send us when you contact us:</strong> when you email us at <a href={`mailto:${B.email}`}>{B.email}</a> or message us on WhatsApp or social media, we receive your name, contact details and whatever you choose to write.</p>
      <p><strong>Information you give us when you enrol in a program:</strong> details needed to register you, deliver the program and communicate with you. Payment details are handled by our payment provider; we do not store your card or bank details on this website.</p>
      <p><strong>Website usage information (only with your consent):</strong> if you accept analytics cookies, Google Analytics collects information such as pages visited, approximate location (city/region), device and browser type, and which buttons you clicked. See our <a href="/cookie-policy/">Cookie Policy</a>.</p>
      <p><strong>Technical information:</strong> like every website, the service that hosts this site (GitHub Pages) receives your IP address and browser details in order to send the page to you.</p>
      <p>We do not intentionally collect sensitive personal data such as health, financial account or biometric information through this website.</p>

      <h2>3. Why we use your data</h2>
      <ul>
        <li>To reply to your enquiry and recommend a suitable AAH program.</li>
        <li>To register you for, deliver and support the programs you join.</li>
        <li>To send you information about your program, schedules and important updates.</li>
        <li>To send you information about other programs, only if you agree to receive it. You can opt out at any time.</li>
        <li>To understand how visitors use the website and improve it (only with your analytics consent).</li>
        <li>To meet legal, tax and accounting obligations and to resolve disputes.</li>
      </ul>

      <h2>4. Consent and how to withdraw it</h2>
      <p>By contacting us you consent to us using the details you provide for the purposes above. Analytics cookies are used only if you choose “Accept” in the cookie banner.</p>
      <p>You can withdraw your consent at any time, as easily as you gave it: email us at <V value={B.email} label="support email" />, or for analytics use the{' '}
        <button type="button" className="policy-link-button" onClick={openCookieSettings}>Cookie settings</button> control. Withdrawal does not affect processing already carried out, and we may still keep data where the law requires it.</p>

      <h2>5. How your messages reach us</h2>
      <p>This website does not have a contact form and does not store anything you type. Links such as “Explore Program” open your own email app addressed to us; you decide whether to send the message. Messages sent through email, WhatsApp, Instagram or YouTube are also subject to those services’ own privacy policies.</p>

      <h2>6. Who we share data with</h2>
      <p>We do not sell your personal data. We share it only with service providers who help us run AAH (for example: hosting, email, messaging, payment processing and Google Analytics), and only as much as they need. We may also disclose data when required by law, a court or a government authority.</p>
      <p>Some of these providers may store data outside India. Where this happens, we rely on transfers that are permitted under Indian law.</p>

      <h2>7. Your rights</h2>
      <p>Subject to the DPDP Act and applicable rules, you have the right to:</p>
      <ul>
        <li>ask for a summary of the personal data we hold about you and how we use it;</li>
        <li>ask us to correct, complete, update or erase your personal data;</li>
        <li>withdraw consent;</li>
        <li>have your grievance addressed by us (see <a href="/contact-grievance/">Contact &amp; Grievance Redressal</a>); and</li>
        <li>nominate another person to exercise your rights in case of death or incapacity.</li>
      </ul>
      <p>If you are not satisfied with our response, you may approach the Data Protection Board of India once it is available to receive complaints.</p>

      <h2>8. Children</h2>
      <p>Our programs and this website are intended for adults (18 years and above). If you are under 18, please ask a parent or lawful guardian to contact us on your behalf; we will process a minor’s data only with verifiable consent from a parent or guardian.</p>

      <h2>9. Security</h2>
      <p>We use reasonable security practices to protect your data, including encrypted (HTTPS) connections, limiting access to people who need it, and using reputable service providers. No method of transmission or storage is completely secure, so we cannot guarantee absolute security. If a personal data breach affects you, we will inform you and the authorities as required by law.</p>

      <h2>10. Changes to this policy</h2>
      <p>We may update this policy from time to time. The “Last updated” date above shows when it was last changed. Significant changes will be highlighted on this website.</p>

      <h2>11. Contact</h2>
      <p>For support, questions about your personal data, or to exercise any of your rights, email us at <a href={`mailto:${B.email}`}>{B.email}</a>.</p>
    </PolicyLayout>
  );
}

export function TermsPage() {
  return (
    <PolicyLayout
      title="Terms and Conditions"
      intro={<>These Terms govern your use of www.anikadesigners.com and your enrolment in any program offered by {B.brandName}, run by {operator}. By using the website or enrolling in a program, you agree to these Terms.</>}
    >
      <h2>1. Eligibility</h2>
      <p>You must be at least 18 years old, or have the consent of a parent or lawful guardian, to enrol in a program.</p>

      <h2>2. Programs and enrolment</h2>
      <p>Program descriptions on this website are a general overview. The exact content, schedule, duration, format (recorded, live or both), fees and access period of each program will be shared with you before you pay. Your enrolment is confirmed only when we receive full payment (or the agreed instalment) and send you a confirmation.</p>

      <h2>3. Fees and payment</h2>
      <p>Fees are payable in Indian Rupees through <V value={R.paymentModes} label="accepted payment methods" />. Please share your payment confirmation with us so we can activate your membership. Prices are inclusive or exclusive of GST as stated at the time of payment.{B.gstin ? ` Our GSTIN is ${B.gstin}.` : null}</p>

      <h2>4. Access to programs</h2>
      <ul>
        <li>Access to program content is for your personal use only. What you can access, and for how long, depends on your membership plan, as confirmed when you enrol.</li>
        <li>Login details, recordings, notes, patterns and community groups must not be shared, resold, recorded, downloaded (unless downloading is expressly permitted) or distributed.</li>
        <li>We may suspend or end access without refund if these Terms are misused, for example by sharing content or behaving abusively in the community.</li>
        <li>Live sessions: <V value={R.liveSessionPolicy} label="policy on missed live sessions, recordings and batch changes" /></li>
      </ul>

      <h2>5. Intellectual property</h2>
      <p>All program content, designs, videos, text, images and materials provided by AAH are owned by or licensed to us and are protected by copyright and other laws. You may use what you learn to create and sell your own embroidery work, but you may not copy, republish or teach our program materials as your own.</p>

      <h2>6. Community conduct</h2>
      <p>Our community is a supportive space. Please be respectful. Harassment, spam, sharing other members’ personal information or posting unlawful content is not allowed and may lead to removal.</p>

      <h2>7. Results and income</h2>
      <p>Student results described on this website are the experiences of individual students and are not typical or guaranteed. Your results depend on your own effort, skill, time, market and many other factors. See our <a href="/disclaimer/">Disclaimer</a>.</p>

      <h2>8. Cancellations and refunds</h2>
      <p>Cancellations and refunds are governed by our <a href="/refund-policy/">Refund and Cancellation Policy</a>.</p>

      <h2>9. Website use</h2>
      <p>You agree not to misuse the website, attempt to gain unauthorised access, introduce malicious code, or use automated tools to collect data from it. We may change or withdraw any part of the website at any time.</p>

      <h2>10. Limitation of liability</h2>
      <p>To the extent permitted by law, AAH is not liable for indirect or consequential losses, including loss of business or income, arising from use of the website or a program. Our total liability for any claim relating to a program is limited to the fee you paid for that program. Nothing in these Terms limits any rights you have as a consumer under Indian law.</p>

      <h2>11. Governing law and disputes</h2>
      <p>These Terms are governed by the laws of India. Please first contact us through the <a href="/contact-grievance/">Grievance Redressal</a> process so we can try to resolve the issue. Subject to your rights under the Consumer Protection Act, 2019, the courts in <V value={B.jurisdiction} label="jurisdiction" /> shall have jurisdiction.</p>

      <h2>12. Changes</h2>
      <p>We may update these Terms. Changes apply from the “Last updated” date and do not affect programs already purchased unless the change is required by law.</p>

      <h2>13. Contact</h2>
      <p>Questions about these Terms? Email us at <a href={`mailto:${B.email}`}>{B.email}</a>.</p>
    </PolicyLayout>
  );
}

export function RefundPolicy() {
  return (
    <PolicyLayout
      title="Refund and Cancellation Policy"
      intro={<>This policy explains when you can cancel an enrolment in an {B.brandName} program and how refunds work. It forms part of our <a href="/terms-and-conditions/">Terms and Conditions</a>.</>}
    >
      <h2>1. Cancelling your enrolment</h2>
      <p>You may request cancellation within <V value={R.windowDays} label="number of days" /> days of your payment date, <V value={R.eligibilityCondition} label="condition, e.g. how much content may have been accessed" />.</p>
      <p>To request cancellation, email <V value={B.email} label="support email" /> or message <V value={B.phone} label="support phone / WhatsApp" /> with your name, the program, your payment date and the payment reference.</p>

      <h2>2. Refund amount</h2>
      <p>Eligible cancellations are refunded in full, less <V value={R.deduction} label="any deduction, e.g. payment-gateway charges, or “no deduction”" />.</p>

      <h2>3. When refunds are not available</h2>
      <p>Refunds are generally not available after the cancellation window above has passed, or where program access has been suspended for misuse under our Terms. This does not affect your statutory rights, for example where a program is not delivered as described.</p>

      <h2>4. If we cancel or change a program</h2>
      <p>If we cancel a program or batch, you can choose a full refund or a transfer to another batch or program of equal value. If we make a material change to a program before it starts, you may cancel and receive a full refund.</p>

      <h2>5. How refunds are paid</h2>
      <p>Approved refunds are made to the original payment method within <V value={R.processingDays} label="refund processing time" /> of approval. Your bank or payment provider may take additional time to show the credit.</p>

      <h2>6. Access after a refund</h2>
      <p>Once a refund is processed, access to the program, its recordings and its community groups ends.</p>

      <h2>7. Questions or disputes</h2>
      <p>If you are unhappy with a refund decision, please use our <a href="/contact-grievance/">Grievance Redressal</a> process.</p>
    </PolicyLayout>
  );
}

export function CookiePolicy() {
  const analyticsOn = !!SITE_CONFIG.ga4MeasurementId;
  return (
    <PolicyLayout
      title="Cookie Policy"
      intro="This policy explains the cookies and similar browser storage used on www.anikadesigners.com and how you can control them."
    >
      <h2>1. What cookies are</h2>
      <p>Cookies are small files stored by your browser. Similar technologies, such as local storage, keep small pieces of information on your device.</p>

      <h2>2. What we use</h2>
      <div className="policy-table" role="region" aria-label="Cookies and storage used" tabIndex={0}>
        <table>
          <thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Purpose</th><th scope="col">Duration</th></tr></thead>
          <tbody>
            <tr><td>aah-consent</td><td>Strictly necessary (local storage)</td><td>Remembers whether you accepted or rejected analytics cookies.</td><td>Until you clear it or change your choice</td></tr>
            {analyticsOn && <tr><td>_ga, _ga_*</td><td>Analytics (optional)</td><td>Google Analytics 4: distinguishes visitors and sessions so we can see how the site is used.</td><td>Up to 2 years</td></tr>}
          </tbody>
        </table>
      </div>
      {!analyticsOn && <p>We do not currently use analytics or advertising cookies. If we add them, they will only be set after you give consent, and this page will be updated.</p>}
      <p>We do not use advertising or cross-site tracking cookies.</p>

      <h2>3. Your choice</h2>
      <p>Optional analytics cookies are set only if you click “Accept” in the cookie banner. Rejecting them does not affect how the website works. You can change your choice at any time:</p>
      <p><button type="button" className="btn btn--outline" onClick={openCookieSettings}>Open cookie settings</button></p>
      <p>You can also delete cookies through your browser settings.</p>

      <h2>4. Third-party services</h2>
      <p>All fonts and images are served from our own website; no third-party content is loaded unless you accept analytics. If you accept analytics, Google’s privacy policy also applies to data collected by Google Analytics.</p>

      <h2>5. More information</h2>
      <p>See our <a href="/privacy-policy/">Privacy Policy</a> for how we handle personal data. Questions about cookies? Email us at <a href={`mailto:${B.email}`}>{B.email}</a>.</p>
    </PolicyLayout>
  );
}

export function Disclaimer() {
  return (
    <PolicyLayout title="Disclaimer" intro="Please read this disclaimer before relying on any information on this website.">
      <h2>1. Results and earnings</h2>
      <p>Figures and stories on this website — including student sales results, community numbers and business revenue — relate to specific individuals or to our business at a particular time. They are not a promise or guarantee that you will earn any particular amount. Most outcomes depend on your own skill, effort, time, pricing, market, and many factors outside our control. Any income targets or community visions mentioned are goals, not guarantees.</p>

      <h2>2. Educational purpose</h2>
      <p>Our programs provide education and mentorship in Aari embroidery, product creation, branding, marketing and selling. They are not legal, tax, financial or accounting advice. Please consult a qualified professional for those matters, for example about GST registration or business licences.</p>

      <h2>3. Accuracy of information</h2>
      <p>We try to keep the website accurate and up to date, but information may change and errors can occur. Program details shared with you at the time of enrolment take priority over general descriptions on this website.</p>

      <h2>4. Testimonials</h2>
      <p>Testimonials reflect the personal experience and opinion of the students who gave them.</p>

      <h2>5. External links</h2>
      <p>Links to other websites or apps (such as WhatsApp, Instagram or YouTube) are provided for convenience. We are not responsible for their content or privacy practices.</p>

      <h2>6. Contact</h2>
      <p>Questions about this disclaimer? Email us at <a href={`mailto:${B.email}`}>{B.email}</a>.</p>
    </PolicyLayout>
  );
}

export function ContactGrievance() {
  return (
    <PolicyLayout
      title="Contact and Grievance Redressal"
      intro="We want every student to have a good experience. If something is not right, here is how to reach us and how we handle complaints."
    >
      <h2>1. Contact us</h2>
      <p>Business: {operator}</p>
      {contactLines}
      <p>Support hours: <V value={B.supportHours} label="support hours" /></p>
      {B.gstin && <p>GSTIN: {B.gstin}</p>}
      <p>For program enquiries, email <a href={`mailto:${B.email}`}>{B.email}</a>.</p>

      <h2>2. Grievance Officer</h2>
      <p>In accordance with the Consumer Protection (E-Commerce) Rules, 2020, the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, our Grievance Officer is:</p>
      <ul>
        <li>Name: <V value={G.name} label="Grievance Officer name" /></li>
        <li>Designation: <V value={G.designation} label="designation" /></li>
        <li>Email: <V value={G.email} label="Grievance Officer email" /></li>
        <li>Phone: <V value={G.phone} label="Grievance Officer phone" /></li>
      </ul>

      <h2>3. How we handle complaints</h2>
      <ol>
        <li>Send your complaint to the Grievance Officer with your name, contact details, the program concerned (if any) and a description of the issue.</li>
        <li>We will acknowledge your complaint within 48 hours.</li>
        <li>We will aim to resolve it within one month of receiving it, and keep you informed of progress.</li>
      </ol>

      <h2>4. If you are not satisfied</h2>
      <p>You may approach the National Consumer Helpline (dial 1915 or visit consumerhelpline.gov.in) or the appropriate Consumer Commission. For personal data complaints, you may approach the Data Protection Board of India once it is available to receive complaints.</p>
    </PolicyLayout>
  );
}

export function NotFound() {
  return (
    <section className="policy policy--404">
      <div className="container policy__inner" style={{ textAlign: 'center' }}>
        <Logo size={88} className="notfound__mark" />
        <p className="eyebrow">Page not found</p>
        <h1 className="section-title">This thread seems to have come loose.</h1>
        <p className="policy__intro">The page you were looking for doesn’t exist or may have moved.</p>
        <p><a href="/" className="btn btn--primary">Go to Home</a></p>
      </div>
    </section>
  );
}
