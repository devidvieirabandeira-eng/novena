/**
 * Efeitos de movimento. Tudo anima só transform/opacity e é desligado
 * quando o sistema pede "reduzir movimento".
 */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const rand = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

/** Partículas decorativas (poeira dourada no hero, brasas das velas). */
function particles(selector, dataKey, cls, build) {
  document.querySelectorAll(selector).forEach((layer) => {
    const n = Number(layer.dataset[dataKey]);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = cls;
      s.style.cssText = build(i);
      frag.appendChild(s);
    }
    layer.replaceChildren(frag);
  });
}

function initParticles() {
  particles('[data-dust]', 'dust', 'mote', (i) => {
    const size = (2 + rand(i * 3 + 5) * 3).toFixed(1);
    return (
      `left:${(18 + rand(i + 2) * 64).toFixed(1)}%;top:${(35 + rand(i * 7) * 55).toFixed(1)}%;` +
      `width:${size}px;height:${size}px;--dx:${((rand(i * 13) - 0.5) * 60).toFixed(0)}px;` +
      `animation-duration:${(7 + rand(i * 11) * 7).toFixed(1)}s;animation-delay:-${(rand(i * 5) * 12).toFixed(1)}s`
    );
  });
  particles('[data-embers]', 'embers', 'ember', (i) => {
    const size = (2 + rand(i * 17) * 2.5).toFixed(1);
    return (
      `left:${(20 + rand(i * 3 + 1) * 60).toFixed(1)}%;bottom:${(55 + rand(i * 7 + 3) * 25).toFixed(1)}%;` +
      `width:${size}px;height:${size}px;--dx:${((rand(i * 19) - 0.5) * 40).toFixed(0)}px;` +
      `animation-duration:${(3.5 + rand(i * 23) * 3.5).toFixed(1)}s;animation-delay:-${(rand(i * 29) * 6).toFixed(1)}s`
    );
  });
}

/** Divide um texto em palavras (para revelar/iluminar uma a uma), preservando a leitura. */
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  // Spans simples: leitores de tela continuam lendo o texto normalmente.
  el.innerHTML = words.map((w, i) => `<span class="word" style="--k:${i}">${w}</span>`).join(' ');
  return [...el.querySelectorAll('.word')];
}

function initWords() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('words-in');
        io.unobserve(e.target);
      }
    },
    { threshold: 0.4 },
  );
  document.querySelectorAll('[data-words]').forEach((el) => {
    splitWords(el);
    el.classList.add('words');
    io.observe(el);
  });
}

/** Barra de progresso, parallax do hero e oração que se ilumina ao rolar. */
function initScroll() {
  const bar = document.querySelector('.progress span');
  const hero = document.querySelector('.hero');
  const heroStars = hero?.querySelector('.stars');
  const heroArt = hero?.querySelector('.hero-svg');
  const prayer = document.querySelector('[data-illuminate]');
  const prayerWords = prayer ? splitWords(prayer) : [];
  const amen = document.querySelector('.amen');
  if (prayer) prayer.classList.add('illuminate');

  let pointer = { x: 0, y: 0 };
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;

    if (hero && y < hero.offsetHeight) {
      if (heroStars) heroStars.style.transform = `translate3d(0, ${(y * 0.28).toFixed(1)}px, 0)`;
      if (heroArt)
        heroArt.style.transform = `translate3d(${(pointer.x * 14).toFixed(1)}px, ${(y * 0.12 + pointer.y * 10).toFixed(1)}px, 0)`;
    }

    if (prayerWords.length) {
      const r = prayer.getBoundingClientRect();
      // 0 quando o topo da oração entra a 85% da tela; 1 quando o fim chega a 55%.
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3), 0, 1);
      const lit = Math.round(p * prayerWords.length);
      prayerWords.forEach((w, i) => w.classList.toggle('lit', i < lit));
      amen?.classList.toggle('lit', lit >= prayerWords.length);
    }
  };

  const request = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });

  if (finePointer && hero) {
    const light = hero.querySelector('.hero-light');
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      pointer = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
      if (light) light.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`;
      hero.classList.add('has-light');
      request();
    });
    hero.addEventListener('pointerleave', () => {
      pointer = { x: 0, y: 0 };
      hero.classList.remove('has-light');
      request();
    });
  }

  update();
}

/** Destaca no menu a seção que está na tela. */
function initScrollSpy() {
  const links = new Map(
    [...document.querySelectorAll('.nav-links a')].map((a) => [a.getAttribute('href').slice(1), a]),
  );
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const link = links.get(e.target.id);
        if (!link) continue;
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  links.forEach((_, id) => {
    const sec = document.getElementById(id);
    if (sec) io.observe(sec);
  });
}

/** Cartões com leve inclinação 3D e reflexo dourado que segue o cursor. */
function initTilt() {
  const grid = document.querySelector('.days');
  if (!grid) return;
  grid.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.day');
    if (!card || card.classList.contains('rv')) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
    card.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`);
    card.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
    card.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
  });
  grid.addEventListener(
    'pointerleave',
    (e) => {
      const card = e.target.closest?.('.day');
      if (card) ['--rx', '--ry'].forEach((p) => card.style.removeProperty(p));
    },
    true,
  );
}

/** Passar o mouse num cartão acende a conta correspondente do terço (e vice-versa). */
function initRosaryLink() {
  const section = document.getElementById('programacao');
  if (!section) return;
  const toggle = (n, on) => {
    section.querySelector(`[data-bead="${n}"]`)?.classList.toggle('is-hover', on);
    section.querySelector(`[data-dia="${n}"]`)?.classList.toggle('is-linked', on);
  };
  section.addEventListener('pointerover', (e) => {
    const el = e.target.closest('[data-bead],[data-dia]');
    if (el) toggle(el.dataset.bead || el.dataset.dia, true);
  });
  section.addEventListener('pointerout', (e) => {
    const el = e.target.closest('[data-bead],[data-dia]');
    if (el && !el.contains(e.relatedTarget)) toggle(el.dataset.bead || el.dataset.dia, false);
  });
}

/** Botões "magnéticos": acompanham levemente o cursor. */
function initMagnetic() {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--bx', `${(((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(1)}px`);
      btn.style.setProperty('--by', `${(((e.clientY - r.top) / r.height - 0.5) * 6).toFixed(1)}px`);
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.removeProperty('--bx');
      btn.style.removeProperty('--by');
    });
  });
}

/** As velas se acendem uma a uma quando a seção aparece. */
function initCandles() {
  const candles = document.querySelector('.candles');
  if (!candles) return;
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        candles.classList.add('lit');
        io.disconnect();
      }
    },
    { threshold: 0.35 },
  );
  io.observe(candles);
}

/** "Acender uma vela": acende uma quarta vela pela intenção do visitante. */
function initVela() {
  const btn = document.querySelector('[data-vela]');
  const candles = document.querySelector('.candles');
  const msg = document.querySelector('.vela-msg');
  if (!btn || !candles) return;
  btn.hidden = false;
  btn.addEventListener('click', () => {
    candles.classList.add('lit', 'mine');
    btn.disabled = true;
    btn.textContent = 'Vela acesa';
    if (msg) msg.textContent = 'Sua vela está acesa. Nossa Senhora de Fátima, rogai por nós.';
  });
}

export function initEffects() {
  initVela();
  initScrollSpy();
  initRosaryLink();

  if (reduce) {
    document.querySelector('.candles')?.classList.add('lit');
    return;
  }

  document.documentElement.classList.add('fx');
  initParticles();
  initWords();
  initScroll();
  initCandles();

  if (finePointer) {
    initTilt();
    initMagnetic();
  }
}
