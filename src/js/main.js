import '../styles/fonts.css';
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/sections.css';
import '../styles/animations.css';

import { novena } from '../data/novena.js';
import { slots, hojeEmBrasilia } from './render-program.js';
import { initCountdown } from './countdown.js';
import { initMenu } from './menu.js';
import { initReveal } from './reveal.js';
import { initEffects } from './effects.js';
import { initCalendar } from './calendar.js';

/** Preenche os `data-slot` a partir de novena.js (inclui o destaque do dia de hoje). */
function renderSlots() {
  const content = slots(novena, hojeEmBrasilia());
  document.querySelectorAll('[data-slot]').forEach((el) => {
    const html = content[el.dataset.slot];
    if (html !== undefined) el.innerHTML = html;
  });
}

/** Estrelas decorativas com posições estáveis (mesma semente = mesmo céu). */
function renderStars() {
  const rand = (seed) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  document.querySelectorAll('[data-stars]').forEach((layer) => {
    const count = Number(layer.dataset.stars);
    const seed = Number(layer.dataset.seed || 1);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      const size = (1 + rand(seed + i * 3) * 2.4).toFixed(1);
      s.className = 'star';
      s.style.cssText =
        `left:${(rand(seed + i) * 100).toFixed(2)}%;top:${(rand(seed + i * 7 + 1) * 90).toFixed(2)}%;` +
        `width:${size}px;height:${size}px;` +
        `animation-duration:${(3 + rand(seed + i * 11) * 4).toFixed(2)}s;` +
        `animation-delay:${(rand(seed + i * 5) * 4).toFixed(2)}s`;
      frag.appendChild(s);
    }
    layer.replaceChildren(frag);
  });
}

renderSlots();
renderStars();
initMenu();
initCountdown(document.querySelector('.count'), novena);
initReveal();
initEffects();
initCalendar(novena);
