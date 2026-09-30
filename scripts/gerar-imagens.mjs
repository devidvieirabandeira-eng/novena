/**
 * Gera public/og-image.png (1200×630) e public/apple-touch-icon.png (180×180).
 * Uso: npm run imagens  (rode de novo se mudar o ano em src/data/novena.js)
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { novena } from '../src/data/novena.js';

const out = (p) => fileURLToPath(new URL(`../public/${p}`, import.meta.url));

const star = (x, y, s, fill) =>
  `<polygon transform="translate(${x} ${y}) scale(${s})" points="0,-1 0.2245,-0.309 0.951,-0.309 0.363,0.118 0.588,0.809 0,0.382 -0.588,0.809 -0.363,0.118 -0.951,-0.309 -0.2245,-0.309" fill="${fill}"/>`;

let seed = 7;
const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const stars = Array.from({ length: 70 }, () => {
  const r = (0.6 + rand() * 1.6).toFixed(1);
  return `<circle cx="${(rand() * 1200).toFixed(0)}" cy="${(rand() * 630).toFixed(0)}" r="${r}" fill="#fff6dc" opacity="${(0.25 + rand() * 0.6).toFixed(2)}"/>`;
}).join('');

const rays = Array.from({ length: 36 }, (_, i) =>
  `<line x1="0" y1="-250" x2="0" y2="${i % 2 ? -200 : -225}" stroke-width="${i % 2 ? 1.2 : 2.2}" transform="rotate(${i * 10})"/>`,
).join('');

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg" cx="72%" cy="45%" r="75%"><stop offset="0" stop-color="#23427a"/><stop offset=".45" stop-color="#12284f"/><stop offset="1" stop-color="#0a1830"/></radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff3cf" stop-opacity=".55"/><stop offset=".4" stop-color="#e8c778" stop-opacity=".18"/><stop offset="1" stop-color="#e8c778" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  ${stars}
  <g transform="translate(930 315)">
    <circle r="260" fill="url(#glow)"/>
    <g stroke="#f1d796" stroke-linecap="round" opacity=".45">${rays}</g>
    <circle r="120" fill="none" stroke="#d9bd7a" stroke-width="2"/>
    <path d="M0 -78 V78 M-40 -34 H40" stroke="#d9bd7a" stroke-width="7" stroke-linecap="round"/>
  </g>
  <rect x="24" y="24" width="1152" height="582" rx="18" fill="none" stroke="#c9a24f" stroke-opacity=".45"/>
  <g font-family="Cinzel, 'Cormorant Garamond', Georgia, serif" fill="#d9bd7a" font-size="22" letter-spacing="5">
    <text x="90" y="170">VIAMÃO · 4 A 13 DE MAIO DE ${novena.ano}</text>
  </g>
  <g font-family="'Cormorant Garamond', Georgia, 'Times New Roman', serif" font-weight="500">
    <text x="86" y="270" font-size="82" fill="#fbf6e8">Novena de</text>
    <text x="86" y="358" font-size="82" fill="#fbf6e8">Nossa Senhora de</text>
    <text x="86" y="452" font-size="92" fill="#e3c985" font-style="italic" font-weight="400">Fátima</text>
  </g>
  <line x1="90" y1="505" x2="190" y2="505" stroke="#c9a24f" stroke-width="1.5"/>
  ${star(212, 505, 9, '#c9a24f')}
  <text x="240" y="512" font-family="Jost, 'Helvetica Neue', Arial, sans-serif" font-size="22" fill="#d8d3c4">Paróquia Nossa Senhora de Fátima</text>
</svg>`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0a1830"/><circle cx="32" cy="32" r="20" fill="none" stroke="#d9bd7a" stroke-width="2.2"/><path d="M32 18v28M25 25.5h14" stroke="#d9bd7a" stroke-width="2.8" stroke-linecap="round"/></svg>`;

await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(out('og-image.png'));
await sharp(Buffer.from(icon)).png().toFile(out('apple-touch-icon.png'));
console.log('Gerados: public/og-image.png e public/apple-touch-icon.png');
