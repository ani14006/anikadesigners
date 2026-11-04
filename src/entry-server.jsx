import { renderToString } from 'react-dom/server';
import App from './App';

export { HOME_META, POLICY_ROUTES, NOT_FOUND_META } from './routes';
export { BUSINESS, SITE_URL } from './business';
export { SITE_CONFIG } from './config';

export function render(pathname) {
  return renderToString(<App pathname={pathname} />);
}
