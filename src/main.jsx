import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/base.css';
import './styles/enhance.css';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production HTML is prerendered at build time (scripts/prerender.js), so hydrate it;
// the dev server serves an empty root, so render from scratch there.
// (the dev root only holds the <!--app-html--> placeholder comment, so check for elements).
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
