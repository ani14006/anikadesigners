import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
// Self-hosted fonts (same families/weights as before; unicode-range subsets load on demand).
import '@fontsource/playfair-display/500.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/800.css';
import '@fontsource/playfair-display/500-italic.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import './styles/base.css';
import './styles/enhance.css';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <App pathname={window.location.pathname} />
  </StrictMode>
);

// Production HTML is prerendered at build time (scripts/prerender.js), so hydrate it;
// the dev server serves an empty root, so render from scratch there.
// (the dev root only holds the <!--app-html--> placeholder comment, so check for elements).
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
