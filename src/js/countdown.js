const DIA = 86_400_000;
const pad = (v) => String(v).padStart(2, '0');
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Troca o número com um leve "rolar" vertical (Web Animations: só transform/opacity). */
function setDigit(el, value) {
  if (!el || el.textContent === value) return;
  el.textContent = value;
  if (reduce() || !el.animate) return;
  el.animate(
    [
      { transform: 'translateY(-38%)', opacity: 0 },
      { transform: 'none', opacity: 1 },
    ],
    { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)' },
  );
}

/**
 * Contagem regressiva até `dataInicio`.
 * Depois do início: "A novena começou". Depois do dia da festa: "Obrigado pela participação".
 */
export function initCountdown(root, { dataInicio, dataFesta }) {
  if (!root) return;
  const inicio = new Date(dataInicio).getTime();
  const fimFesta = new Date(dataFesta).getTime() + DIA;
  if (Number.isNaN(inicio)) return;

  const boxes = ['d', 'h', 'm', 's'].map((k) => root.querySelector(`[data-cd="${k}"]`));
  const status = root.querySelector('[data-cd-status]');
  let timer;
  let lastLabel = '';

  const finish = (text) => {
    root.dataset.state = 'done';
    status.textContent = text;
    root.setAttribute('aria-label', text);
    clearInterval(timer);
  };

  const tick = () => {
    const now = Date.now();
    if (now >= fimFesta) return finish('Obrigado pela participação');
    if (now >= inicio) return finish('A novena começou');

    let diff = inicio - now;
    const d = Math.floor(diff / DIA);
    diff -= d * DIA;
    const h = Math.floor(diff / 3_600_000);
    diff -= h * 3_600_000;
    const m = Math.floor(diff / 60_000);
    diff -= m * 60_000;
    const s = Math.floor(diff / 1000);

    [String(d), pad(h), pad(m), pad(s)].forEach((v, i) => setDigit(boxes[i], v));

    // O rótulo acessível muda só a cada minuto, para não "falar" demais.
    const label = `Faltam ${d} dias, ${h} horas e ${m} minutos`;
    if (label !== lastLabel) root.setAttribute('aria-label', (lastLabel = label));
  };

  tick();
  timer = setInterval(tick, 1000);
}
