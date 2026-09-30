/**
 * "Adicionar à agenda" (arquivo .ics com os 9 dias e a festa) e "Compartilhar".
 */
import { isTbd, dataPorExtenso } from './render-program.js';

const escIcs = (v) => String(v).replace(/\\/g, '\\\\').replace(/[;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

/** Quebra linhas longas (RFC 5545): no máximo ~60 caracteres por linha. */
const fold = (line) => line.match(/.{1,60}/gu).join('\r\n ');

const ymd = (iso) => iso.replace(/-/g, '');
const nextDay = (iso) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};
const utcStamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** "19h30", "19:30", "19h" → { h, m } ou null. */
function parseHorario(txt) {
  if (isTbd(txt)) return null;
  const m = String(txt).match(/(\d{1,2})\s*[h:]\s*(\d{2})?/i);
  return m ? { h: Number(m[1]), m: Number(m[2] || 0) } : null;
}

function buildIcs(data) {
  const c = data.contato;
  const local = `Paróquia Nossa Senhora de Fátima, ${c.endereco.replace(' — ', ', ')}, ${c.cidade} - ${c.uf}, ${c.cep}`;
  const hora = parseHorario(data.horarioDiario);
  const stamp = utcStamp(new Date());

  const evento = ({ uid, data: dia, titulo, descricao, hora: hh }) => {
    const linhas = ['BEGIN:VEVENT', `UID:${uid}@novena-fatima-viamao`, `DTSTAMP:${stamp}`];
    if (hh) {
      // Brasília não tem horário de verão desde 2019: -03:00 fixo.
      const ini = new Date(`${dia}T${String(hh.h).padStart(2, '0')}:${String(hh.m).padStart(2, '0')}:00-03:00`);
      const fim = new Date(ini.getTime() + 90 * 60_000);
      linhas.push(`DTSTART:${utcStamp(ini)}`, `DTEND:${utcStamp(fim)}`);
    } else {
      linhas.push(`DTSTART;VALUE=DATE:${ymd(dia)}`, `DTEND;VALUE=DATE:${ymd(nextDay(dia))}`);
    }
    linhas.push(`SUMMARY:${escIcs(titulo)}`, `LOCATION:${escIcs(local)}`);
    if (descricao) linhas.push(`DESCRIPTION:${escIcs(descricao)}`);
    linhas.push('END:VEVENT');
    return linhas.map(fold).join('\r\n');
  };

  const eventos = data.dias.map((dia, i) =>
    evento({
      uid: `novena-${data.ano}-dia-${i + 1}`,
      data: dia.data,
      titulo: `Novena de N. Sra. de Fátima · ${i + 1}º dia`,
      descricao: [
        'Terço, oração da novena e Santa Missa.',
        isTbd(dia.tema) ? '' : `Tema: ${dia.tema}`,
        isTbd(dia.celebrante) ? '' : `Celebrante: ${dia.celebrante}`,
      ]
        .filter(Boolean)
        .join('\n'),
      hora,
    }),
  );

  const diaFesta = data.dataFesta.slice(0, 10);
  const programa = data.festa
    .filter((f) => !isTbd(f.atividade))
    .map((f) => (isTbd(f.horario) ? f.atividade : `${f.horario} · ${f.atividade}`))
    .join('\n');
  eventos.push(
    evento({
      uid: `festa-${data.ano}`,
      data: diaFesta,
      titulo: 'Festa de Nossa Senhora de Fátima · Padroeira',
      descricao: `${dataPorExtenso(diaFesta)}\n${programa}`,
    }),
  );

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Paroquia N. Sra. de Fatima Viamao//Novena//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...eventos,
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export function initCalendar(data) {
  const btn = document.querySelector('[data-ics]');
  if (btn) {
    btn.hidden = false;
    btn.addEventListener('click', () => {
      const blob = new Blob([buildIcs(data)], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), { href: url, download: `novena-fatima-${data.ano}.ics` });
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    });
  }

  // Compartilhar: usa o menu nativo do celular quando existe; senão, segue o link do WhatsApp.
  const share = document.querySelector('[data-share]');
  if (share && navigator.share) {
    share.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.share({
          title: `Novena de Nossa Senhora de Fátima ${data.ano}`,
          text: 'De 4 a 12 de maio, com a Festa da Padroeira em 13 de maio. Paróquia N. Sra. de Fátima, Viamão/RS.',
          url: data.siteUrl || location.href,
        });
      } catch {
        /* compartilhamento cancelado */
      }
    });
  }
}
