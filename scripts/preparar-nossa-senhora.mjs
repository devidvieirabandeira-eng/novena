/**
 * Converte originais/nossa-senhora.png em public/img/nossa-senhora.webp.
 * - Recupera o brilho dourado guardado em pixels transparentes, mas só o contorno
 *   próximo da figura (a aura ampla é desenhada no site, em SVG).
 * - Suaviza as bordas para o brilho não terminar em corte reto.
 * Uso: npm run nossa-senhora
 */
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../originais/nossa-senhora.png', import.meta.url));
const dest = fileURLToPath(new URL('../public/img/nossa-senhora.webp', import.meta.url));
if (!existsSync(src)) {
  console.error('Coloque a imagem em originais/nossa-senhora.png');
  process.exit(1);
}

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const GLOW_CURVE = 2.6; // maior = contorno mais justo
const GLOW_FORCA = 0.9; // 0 a 1

const fade = (d, size) => Math.min(1, d / size);

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    let a = data[i + 3];
    if (a < 255) {
      const m = Math.max(data[i], data[i + 1], data[i + 2]);
      if (m > a) {
        for (let k = 0; k < 3; k++) data[i + k] = Math.min(255, Math.round((data[i + k] * 255) / m));
        // Curva forte: o brilho junto à figura fica; a névoa distante some.
        a = Math.max(a, Math.round(255 * Math.pow(m / 255, GLOW_CURVE) * GLOW_FORCA));
      }
    }
    const edge = fade(x, w * 0.12) * fade(w - 1 - x, w * 0.12) * fade(y, h * 0.06) * fade(h - 1 - y, h * 0.04);
    data[i + 3] = Math.round(a * edge);
  }
}

await sharp(data, { raw: info }).resize(600, 900).webp({ quality: 80, alphaQuality: 85, effort: 6 }).toFile(dest);
console.log('Gerado: public/img/nossa-senhora.webp');
