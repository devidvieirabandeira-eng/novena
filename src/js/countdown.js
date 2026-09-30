const DIA = 86_400_000;
const pad = (v) => String(v).padStart(2, '0');

/**
 * Contagem regressiva até `dataInicio`.
 * Depois do início: "A novena começou". Depois do dia da festa: "Obrigado pela participação".
 */
export function initCountdown(root, { dataInicio, dataFesta }) {
  if (!root) return;
  const inicio = new Date(dataInicio).getTime();
  const fimFesta = new Date(dataFesta).getTime() + DIA;
  if (Number.isNaN(inicio)) return;

  const boxes = {
    d: root.querySelector('[data-cd="d"]'),
    h: root.querySelector('[data-cd="h"]'),
    m: root.querySelector('[data-cd="m"]'),
  };
  const status = root.querySelector('[data-cd-status]');
  let timer;

  const finish = (text) => {
    root.dataset.state = 'done';
    status.textContent = text;
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

    boxes.d.textContent = String(d);
    boxes.h.textContent = pad(h);
    boxes.m.textContent = pad(m);
    root.setAttribute('aria-label', `Faltam ${d} dias, ${h} horas e ${m} minutos`);
  };

  tick();
  timer = setInterval(tick, 15_000);
}
