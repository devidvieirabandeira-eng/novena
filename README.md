# Novena de Nossa Senhora de Fátima 2027

Site de uma página da Novena de Nossa Senhora de Fátima e da Festa da Padroeira, da **Paróquia Nossa Senhora de Fátima (Viamão/RS)**.

Feito com HTML, CSS e JavaScript puros. O [Vite](https://vitejs.dev) é usado só para testar no computador e gerar a versão final para publicar.

---

## 1. Como rodar no computador

Você precisa do [Node.js](https://nodejs.org) (versão 18 ou mais nova).

```bash
npm install      # só na primeira vez
npm run dev      # abre o site em http://localhost:5173
```

Para gerar a versão de publicação (pasta `dist/`):

```bash
npm run build
npm run preview  # confere a versão final em http://localhost:4173
```

---

## 2. Como editar datas, horários, temas e celebrantes

**Todas as informações ficam em um único arquivo: [`src/data/novena.js`](src/data/novena.js).** Não é preciso mexer no HTML.

| Campo | O que é | Exemplo |
|---|---|---|
| `ano` | Ano da novena | `2027` |
| `siteUrl` | Endereço do site publicado, sem `/` no final (usado nas prévias do WhatsApp/Facebook) | `'https://novenafatima.netlify.app'` |
| `dataInicio` | Início da contagem regressiva (1º dia). Ajuste a hora quando a missa for definida | `'2027-05-04T19:30:00-03:00'` |
| `dataFesta` | Dia da festa. Depois que esse dia termina, o site mostra "Obrigado pela participação" | `'2027-05-13T00:00:00-03:00'` |
| `horarioDiario` | Horário das celebrações da novena | `'19h30'` |
| `localDiario` | Local das celebrações | `'Igreja Matriz'` |
| `dias` | Os 9 dias: `data`, `diaSemana`, `tema`, `celebrante` | `{ data: '2027-05-04', diaSemana: 'Terça-feira', tema: 'Maria, Mãe da Igreja', celebrante: 'Pe. Fulano' }` |
| `festa` | Atividades do dia 13, na ordem: `atividade` e `horario` | `{ atividade: 'Missa Solene', horario: '19h' }` |
| `contato` | Endereço, telefone, Facebook e link do mapa | — |

**Campos ainda não definidos** ficam com o texto `'[A DEFINIR]'`. No site, eles aparecem de forma discreta como *A definir*. Quando souber a informação, é só trocar o texto.

Para **acrescentar uma atividade na festa**, copie uma linha dentro de `festa: [ ... ]`:

```js
festa: [
  { atividade: 'Missa Solene', horario: '19h' },
  { atividade: 'Procissão Luminosa', horario: '20h30' },
  { atividade: 'Bênção final', horario: '21h' },
],
```

Datas e horas usam o fuso de Brasília (`-03:00`). Durante a novena, o cartão do **dia de hoje** fica destacado automaticamente.

> Com `npm run dev` rodando, a página atualiza sozinha ao salvar o arquivo.

---

## 3. Como trocar a imagem de Nossa Senhora e a foto da igreja

Coloque os arquivos na pasta `public/img/` com **exatamente** estes nomes:

| Arquivo | Onde aparece | Tamanho sugerido |
|---|---|---|
| `public/img/nossa-senhora.webp` | Topo do site, no lugar da ilustração | 800 × 1400 px (vertical) |
| `public/img/igreja.webp` | Seção "Como chegar", no lugar do espaço reservado | 1200 × 900 px (horizontal) |

- Enquanto os arquivos não existirem, o site mostra a ilustração de Nossa Senhora e um espaço reservado elegante para a igreja.
- A imagem de Nossa Senhora aparece recortada em arco, com o halo e os raios dourados atrás. Uma foto com fundo transparente fica ainda mais bonita.
- **Como converter para WebP:** use o [Squoosh](https://squoosh.app) (grátis, no navegador): abra a foto, escolha *WebP* com qualidade 75–80 e baixe.
- Depois de colocar as imagens, rode `npm run build` de novo (ou reinicie o `npm run dev`).

### Imagem de compartilhamento e ícone

`public/og-image.png` (a prévia que aparece no WhatsApp/Facebook) e `public/apple-touch-icon.png` são gerados por:

```bash
npm run imagens
```

Rode esse comando de novo se mudar o `ano`.

---

## 4. Como publicar

Antes de publicar, preencha `siteUrl` em `novena.js` com o endereço final do site. Sem ele, as prévias de compartilhamento podem não mostrar a imagem.

### Netlify (mais simples)

**Opção A: arrastar e soltar**
1. Rode `npm run build`.
2. Entre em [app.netlify.com/drop](https://app.netlify.com/drop) e arraste a pasta `dist/`.

**Opção B: ligado ao GitHub (atualiza sozinho a cada alteração)**
1. Envie o projeto para um repositório no GitHub.
2. Na Netlify: *Add new site → Import an existing project* e escolha o repositório.
3. As configurações já vêm do arquivo `netlify.toml` (comando `npm run build`, pasta `dist`). Clique em *Deploy*.

### GitHub Pages

1. Envie o projeto para um repositório no GitHub (branch `main`).
2. No repositório: *Settings → Pages → Source: **GitHub Actions***.
3. O workflow `.github/workflows/deploy.yml` já está pronto: a cada push na `main`, o site é gerado e publicado em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

O site usa caminhos relativos, então funciona na raiz de um domínio ou numa subpasta sem nenhum ajuste.

### Vercel

Importe o repositório em [vercel.com/new](https://vercel.com/new). O Vite é detectado sozinho (build `npm run build`, saída `dist`).

---

## 5. Estrutura do projeto

```
index.html                 Estrutura da página (textos fixos das seções)
src/data/novena.js         ← DADOS EDITÁVEIS
src/styles/
  tokens.css               Cores, fontes e medidas
  base.css                 Estilos gerais, botões, ornamentos
  sections.css             Estilo de cada seção
  animations.css           Animações (respeitam "reduzir movimento")
src/js/
  main.js                  Ponto de entrada
  render-program.js        Gera cartões da programação, lista da festa e contatos
  countdown.js             Contagem regressiva
  reveal.js                Revelação dos blocos ao rolar
  menu.js                  Menu do celular
public/                    Arquivos copiados como estão (ícone, og-image, imagens)
scripts/gerar-imagens.mjs  Gera og-image.png e apple-touch-icon.png
vite.config.js             Pré-renderiza o conteúdo de novena.js no HTML (SEO e JSON-LD)
Main.dc.html               Mockup original de referência (não é publicado)
```

O conteúdo de `novena.js` também é gravado direto no HTML na hora do build. Assim o site aparece completo mesmo sem JavaScript e os buscadores leem a programação. O Google recebe ainda os dados estruturados (schema.org `Event`) da novena e da festa.
