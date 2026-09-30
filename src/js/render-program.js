/**
 * Geração do HTML que depende de `novena.js`.
 * Módulo puro (sem DOM): é usado no navegador (main.js) e também pelo
 * plugin do Vite, que pré-renderiza o conteúdo no index.html para que
 * a página funcione e seja indexada mesmo sem JavaScript.
 */

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

export const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const isTbd = (value) => !value || /\[\s*a definir\s*\]/i.test(String(value));

/** Valor pronto para a tela: campos não definidos viram "A definir" discreto. */
export const show = (value) =>
  isTbd(value) ? '<span class="tbd">A definir</span>' : escapeHtml(value);

/** "2027-05-04" → "4 de maio" */
export const dataPorExtenso = (iso) => {
  const [, m, d] = String(iso).split('-').map(Number);
  return `${d} de ${MESES[m - 1]}`;
};

/** Data de hoje (AAAA-MM-DD) no fuso de Brasília. */
export const hojeEmBrasilia = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

export function renderDias(dias, hoje = '') {
  return dias
    .map((dia, i) => {
      const n = i + 1;
      const atual = dia.data === hoje;
      return `
<article id="dia-${n}" class="day rv${atual ? ' is-today' : ''}" style="--i:${i % 3}" data-dia="${n}"${atual ? ' aria-current="date"' : ''}>
  <div class="day-head">
    <span class="day-n serif" aria-hidden="true">${n}</span>
    <span class="day-label caps">${atual ? '<span class="day-today">Hoje</span>' : ''}${n}º dia</span>
  </div>
  <div class="day-rule"></div>
  <h3 class="day-date serif"><time datetime="${escapeHtml(dia.data)}">${dataPorExtenso(dia.data)}</time></h3>
  <p class="day-week">${escapeHtml(dia.diaSemana)}</p>
  <dl class="day-info">
    <div><dt>Tema</dt><dd>${show(dia.tema)}</dd></div>
    <div><dt>Celebrante</dt><dd>${show(dia.celebrante)}</dd></div>
  </dl>
</article>`;
    })
    .join('');
}

/** Terço de nove contas: passadas ficam douradas, a de hoje pulsa. */
export function renderRosario(dias, hoje = '') {
  const primeiro = dias[0].data;
  const ultimo = dias[dias.length - 1].data;
  const idxHoje = dias.findIndex((d) => d.data === hoje);
  let legenda = 'Nove dias, nove contas';
  if (idxHoje >= 0) legenda = `Hoje · ${idxHoje + 1}º dia da novena`;
  else if (hoje && hoje > ultimo) legenda = 'Novena concluída · Obrigado por rezar conosco';

  const contas = dias
    .map((dia, i) => {
      const estado = dia.data === hoje ? 'is-today' : hoje && dia.data < hoje && hoje >= primeiro ? 'is-past' : '';
      return `<li><a class="bead ${estado}" href="#dia-${i + 1}" data-bead="${i + 1}" style="--b:${i}" aria-label="${i + 1}º dia, ${dataPorExtenso(dia.data)}"${
        estado === 'is-today' ? ' aria-current="date"' : ''
      }><span class="bead-dot"></span><span class="bead-n">${i + 1}</span></a></li>`;
    })
    .join('');

  return `<p class="rosary-cap caps">${legenda}</p>
<ol class="rosary-beads">${contas}<li class="rosary-cross" aria-hidden="true"><svg width="18" height="26" viewBox="0 0 18 26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 2v22M3 9h12"/></svg></li></ol>`;
}

export function renderFesta(festa) {
  return festa
    .map(
      (item) => `
<li class="festa-row"><span class="festa-act serif">${show(item.atividade)}</span><span class="festa-time">${show(item.horario)}</span></li>`,
    )
    .join('');
}

export function renderHorario(data) {
  const horario = isTbd(data.horarioDiario)
    ? 'em horário <span class="tbd">a definir</span>'
    : `às ${escapeHtml(data.horarioDiario)}`;
  const local = isTbd(data.localDiario) ? '' : `, na ${escapeHtml(data.localDiario)}`;
  return `Todas as noites: terço, oração da novena e Santa Missa, ${horario}${local}.`;
}

/** Conteúdo de todos os `data-slot` do index.html. */
export function slots(data, hoje = '') {
  const c = data.contato;
  return {
    horario: renderHorario(data),
    dias: renderDias(data.dias, hoje),
    rosario: renderRosario(data.dias, hoje),
    festa: renderFesta(data.festa),
    endereco: `${escapeHtml(c.endereco)}<br>${escapeHtml(c.cidade)} · ${escapeHtml(c.uf)} · ${escapeHtml(c.cep)}`,
    telefone: `<a href="tel:+55${c.telefone.replace(/\D/g, '')}">${escapeHtml(c.telefone)}</a>`,
  };
}
