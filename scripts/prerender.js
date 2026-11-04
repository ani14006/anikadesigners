// Build-time prerender: writes one static HTML file per route with its own <head> metadata,
// plus 404.html, sitemap.xml and a Content-Security-Policy meta tag.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('dist');
const ssr = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href);
const { render, HOME_META, POLICY_ROUTES, NOT_FOUND_META, BUSINESS, SITE_URL, SITE_CONFIG } = ssr;
const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('prerender: <!--app-html--> placeholder missing');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// GitHub Pages cannot send HTTP headers, so the CSP is delivered as a meta tag (production only;
// the Vite dev server needs inline scripts). frame-ancestors is not supported in meta CSP.
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com",
  "connect-src 'self' https:",
  "form-action 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  'upgrade-insecure-requests',
].join('; ');

const org = {
  '@type': 'EducationalOrganization',
  '@id': `${SITE_URL}/#organization`,
  name: BUSINESS.brandName,
  alternateName: [BUSINESS.tradeName, 'AAH'],
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-512.png`, width: 512, height: 512 },
  image: `${SITE_URL}/assets/og-image.jpg`,
  description: HOME_META.description,
  founder: { '@type': 'Person', name: BUSINESS.founder },
};
if (BUSINESS.email) org.email = BUSINESS.email;
if (BUSINESS.phone) org.telephone = BUSINESS.phone;
const sameAs = [SITE_CONFIG.social.instagram, SITE_CONFIG.social.youtube].filter(Boolean);
if (sameAs.length) org.sameAs = sameAs;
const jsonld = {
  '@context': 'https://schema.org',
  '@graph': [
    org,
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: BUSINESS.brandName, publisher: { '@id': `${SITE_URL}/#organization` }, inLanguage: 'en-IN' },
  ],
};

const PRELOAD = '<link rel="preload" as="image" type="image/webp" imagesrcset="/assets/coach-portrait-480.webp 480w, /assets/coach-portrait-720.webp 720w, /assets/coach-portrait.webp 1000w" imagesizes="(max-width: 480px) 66vw, 360px" fetchpriority="high">';

function page({ path, title, description, html, robots, isHome }) {
  const url = `${SITE_URL}${path === '/404.html' ? '/' : path}`;
  let out = template
    .replace('<!--app-html-->', html)
    .replace('<!--csp-->', `<meta http-equiv="Content-Security-Policy" content="${CSP}">`)
    .replace('<!--verification-->', SITE_CONFIG.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(SITE_CONFIG.googleSiteVerification)}">` : '')
    .replace('<!--preload-->', isHome ? PRELOAD : '')
    .replace('<!--jsonld-->', `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`);
  if (robots) out = out.replace(/(<meta name="robots" content=")[^"]*/, `$1${robots}`);
  if (!isHome) out = out.replace('<meta property="og:type" content="website">', '<meta property="og:type" content="article">');
  return out;
}

function write(rel, content) {
  const file = resolve(dist, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

write('index.html', page({ ...HOME_META, html: render('/'), isHome: true }));
for (const r of POLICY_ROUTES) {
  // Draft policies (unreviewed / missing details) are kept out of search results until finalised.
  const robots = BUSINESS.policiesReviewed ? undefined : 'noindex, follow';
  write(`${r.path.slice(1)}index.html`, page({ ...r, html: render(r.path), robots }));
}
write('404.html', page({ ...NOT_FOUND_META, html: render('/404.html'), robots: 'noindex, follow' }));

const today = new Date().toISOString().slice(0, 10);
const urls = [{ loc: `${SITE_URL}/`, priority: '1.0' }];
if (BUSINESS.policiesReviewed) POLICY_ROUTES.forEach((r) => urls.push({ loc: `${SITE_URL}${r.path}`, priority: '0.3' }));
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`);

rmSync(resolve('dist-ssr'), { recursive: true, force: true });
console.log(`prerender: ${2 + POLICY_ROUTES.length} pages, sitemap with ${urls.length} URL(s)`);
