// Injects the server-rendered App markup into dist/index.html for fast first paint + SEO.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('dist');
const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href);
const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
if (!html.includes('<!--app-html-->')) throw new Error('prerender: <!--app-html--> placeholder missing in index.html');
writeFileSync(resolve(dist, 'index.html'), html.replace('<!--app-html-->', render()));
rmSync(resolve('dist-ssr'), { recursive: true, force: true });
console.log('prerender: dist/index.html populated');
