import { defineConfig } from 'vite';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const fromRoot = (...p) => resolve(root, ...p);

/** Importa um módulo sempre do disco (sem cache), para refletir edições em novena.js. */
const freshImport = (file) => import(`${pathToFileURL(fromRoot(file)).href}?t=${Date.now()}`);

const attr = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// Imagem recortada (fundo transparente, proporção 2:3) ocupando toda a área, dentro da aura.
const NOSSA_SENHORA_IMG = `<g class="figure">
          <image class="ns-img" href="/img/nossa-senhora.webp" x="0" y="0" width="400" height="600" preserveAspectRatio="xMidYMid meet"/>
        </g>`;

const NOSSA_SENHORA_PRELOAD =
  '<link rel="preload" href="/img/nossa-senhora.webp" as="image" type="image/webp" fetchpriority="high">';

const IGREJA_IMG = `<div class="photo"><img src="/img/igreja.webp" width="960" height="720" loading="lazy" decoding="async" alt="Fachada da Igreja Matriz da Paróquia Nossa Senhora de Fátima, em Viamão"></div>`;

function jsonLd(data) {
  const c = data.contato;
  const place = {
    '@type': 'Place',
    name: 'Paróquia Nossa Senhora de Fátima — Igreja Matriz',
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.endereco.replace(' — ', ', '),
      addressLocality: c.cidade,
      addressRegion: c.uf,
      postalCode: c.cep,
      addressCountry: 'BR',
    },
    telephone: `+55 ${c.telefone}`,
  };
  const organizer = {
    '@type': 'Organization',
    name: 'Paróquia Nossa Senhora de Fátima',
    url: c.facebook,
  };
  const base = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    isAccessibleForFree: true,
    location: place,
    organizer,
    image: data.siteUrl ? [`${data.siteUrl}/og-image.png`] : undefined,
  };
  const inicio = data.dias[0].data;
  const fim = data.dias[data.dias.length - 1].data;
  const events = [
    {
      ...base,
      name: `Novena de Nossa Senhora de Fátima ${data.ano}`,
      description:
        'Nove noites de oração, terço e Santa Missa preparando a comunidade para a festa da Padroeira.',
      startDate: inicio,
      endDate: fim,
    },
    {
      ...base,
      name: `Festa de Nossa Senhora de Fátima ${data.ano}`,
      description: `Festa da Padroeira, encerramento da novena: ${data.festa.map((f) => f.atividade).join(', ')}.`,
      startDate: data.dataFesta.slice(0, 10),
      endDate: data.dataFesta.slice(0, 10),
    },
  ];
  return `<script type="application/ld+json">${JSON.stringify(events).replace(/</g, '\\u003c')}</script>`;
}

/** Pré-renderiza no index.html tudo o que vem de novena.js (SEO e funcionamento sem JS). */
function novenaHtml() {
  return {
    name: 'novena-html',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const { novena } = await freshImport('src/data/novena.js');
        const { slots } = await freshImport('src/js/render-program.js');
        const content = slots(novena);
        const site = novena.siteUrl.replace(/\/$/, '');

        const tokens = {
          ano: novena.ano,
          mapsUrl: attr(novena.contato.mapsUrl),
          facebook: attr(novena.contato.facebook),
          ogImage: site ? `${site}/og-image.png` : '/og-image.png',
          canonical: site ? `<link rel="canonical" href="${attr(site)}/">` : '',
          ogUrl: site ? `<meta property="og:url" content="${attr(site)}/">` : '',
          jsonLd: jsonLd(novena),
          whatsapp: attr(
            'https://wa.me/?text=' +
              encodeURIComponent(
                `Novena de Nossa Senhora de Fátima ${novena.ano}: de 4 a 12 de maio, com a Festa da Padroeira em 13 de maio. ` +
                  `Paróquia N. Sra. de Fátima, Viamão/RS.${site ? ` ${site}/` : ''}`,
              ),
          ),
        };

        let out = html
          .replace(/\{\{slot:(\w+)\}\}/g, (_, k) => content[k] ?? '')
          .replace(/\{\{(\w+)\}\}/g, (m, k) => (k in tokens ? String(tokens[k]) : m));

        if (existsSync(fromRoot('public/img/nossa-senhora.webp'))) {
          out = out
            .replace(/<!-- nossa-senhora:inicio[\s\S]*?<!-- nossa-senhora:fim -->/, NOSSA_SENHORA_IMG)
            .replace('</title>', `</title>\n${NOSSA_SENHORA_PRELOAD}`);
        }
        if (existsSync(fromRoot('public/img/igreja.webp'))) {
          out = out.replace(/<!-- igreja:inicio[\s\S]*?<!-- igreja:fim -->/, IGREJA_IMG);
        }
        return out;
      },
    },
  };
}

/** Embute o CSS final no <head>: evita uma requisição que bloqueia a renderização. */
function inlineCss() {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = Object.values(bundle).find((f) => f.fileName === 'index.html');
      if (!html) return;
      let source = String(html.source);
      for (const [name, file] of Object.entries(bundle)) {
        if (!name.endsWith('.css')) continue;
        const link = (source.match(/<link rel="stylesheet"[^>]*>/g) || []).find((tag) => tag.includes(name));
        if (!link) continue;
        // As URLs do CSS eram relativas a assets/; no <style> passam a ser relativas ao index.html.
        const css = String(file.source)
          .replace(/url\(\.\/(?!\.)/g, 'url(./assets/')
          .replace(/url\(\.\.\//g, 'url(./');
        source = source.replace(link, () => '<style>' + css + '</style>');
        delete bundle[name];
      }
      html.source = source;
    },
  };
}

export default defineConfig({
  // Caminhos relativos: funciona na raiz do domínio (Netlify/Vercel)
  // e em subpasta (GitHub Pages: usuario.github.io/repositorio/).
  base: './',
  plugins: [novenaHtml(), inlineCss()],
  server: {
    watch: { ignored: ['**/Main.dc.html'] },
  },
  build: {
    target: 'es2020',
    cssMinify: true,
  },
});
