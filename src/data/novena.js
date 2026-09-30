/**
 * DADOS EDITÁVEIS DA NOVENA
 * ------------------------------------------------------------
 * Tudo o que aparece no site (datas, horários, temas, celebrantes,
 * programação da festa e contatos) vem deste arquivo.
 *
 * Qualquer campo com o texto "[A DEFINIR]" aparece na página de forma
 * discreta ("A definir"). Basta trocar pelo valor real quando souber.
 */

const A_DEFINIR = '[A DEFINIR]';

export const novena = {
  ano: 2027,

  /**
   * Endereço público do site, sem barra no final
   * (ex.: "https://novenafatima.netlify.app").
   * Usado nas prévias de compartilhamento (WhatsApp/Facebook).
   * Pode ficar vazio até o site estar publicado.
   */
  siteUrl: '',

  /**
   * Início da contagem regressiva: 1º dia da novena.
   * Formato ISO com fuso de Brasília (-03:00).
   * Quando o horário da missa for definido, ajuste a hora (ex.: T19:30:00-03:00).
   */
  dataInicio: '2027-05-04T00:00:00-03:00',

  /**
   * Dia da Festa da Padroeira. Depois que este dia terminar,
   * o site mostra "Obrigado pela participação".
   */
  dataFesta: '2027-05-13T00:00:00-03:00',

  /** Horário das celebrações diárias da novena (ex.: "19h30"). */
  horarioDiario: A_DEFINIR,

  /** Local das celebrações diárias. */
  localDiario: 'Igreja Matriz',

  /** Os nove dias da novena. `data` no formato AAAA-MM-DD. */
  dias: [
    { data: '2027-05-04', diaSemana: 'Terça-feira', tema: A_DEFINIR, celebrante: A_DEFINIR },
    { data: '2027-05-05', diaSemana: 'Quarta-feira', tema: A_DEFINIR, celebrante: A_DEFINIR },
    { data: '2027-05-06', diaSemana: 'Quinta-feira', tema: A_DEFINIR, celebrante: A_DEFINIR },
    { data: '2027-05-07', diaSemana: 'Sexta-feira', tema: A_DEFINIR, celebrante: A_DEFINIR },
    { data: '2027-05-08', diaSemana: 'Sábado', tema: A_DEFINIR, celebrante: A_DEFINIR },
    { data: '2027-05-09', diaSemana: 'Domingo', tema: A_DEFINIR, celebrante: A_DEFINIR },
    { data: '2027-05-10', diaSemana: 'Segunda-feira', tema: A_DEFINIR, celebrante: A_DEFINIR },
    { data: '2027-05-11', diaSemana: 'Terça-feira', tema: A_DEFINIR, celebrante: A_DEFINIR },
    { data: '2027-05-12', diaSemana: 'Quarta-feira', tema: A_DEFINIR, celebrante: A_DEFINIR },
  ],

  /** Programação do dia 13 de maio, na ordem em que acontece. */
  festa: [
    { atividade: 'Missa Solene', horario: A_DEFINIR },
    { atividade: 'Procissão Luminosa', horario: A_DEFINIR },
  ],

  contato: {
    endereco: 'Av. Senador Salgado Filho, 3871 — Viamópolis',
    cidade: 'Viamão',
    uf: 'RS',
    cep: '94470-000',
    telefone: '(51) 3493-2243',
    facebook: 'https://www.facebook.com/fatimaviamao/',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Par%C3%B3quia+Nossa+Senhora+de+F%C3%A1tima%2C+Av.+Senador+Salgado+Filho+3871%2C+Viam%C3%A3o+RS',
  },
};

export default novena;
