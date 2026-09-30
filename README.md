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

### Nossa Senhora (topo do site)

1. Salve a imagem em **`originais/nossa-senhora.png`**. Ela deve ser vertical (proporção 2:3, por exemplo 1024 × 1536) e ter **fundo transparente**.
2. Rode:

   ```bash
   npm run nossa-senhora
   ```

   O comando gera `public/img/nossa-senhora.webp`: recupera o brilho dourado em volta da figura, suaviza as bordas e reduz o arquivo para carregar rápido.
3. Rode `npm run build` (ou reinicie o `npm run dev`).

A imagem aparece dentro da aura dourada, com os raios girando, a flutuação e a poeira dourada. Se `public/img/nossa-senhora.webp` não existir, o site usa a ilustração em SVG.

### Foto da Igreja Matriz ("Como chegar")

Coloque a foto em **`public/img/igreja.webp`**, na horizontal (sugestão: 1200 × 900 px). Enquanto ela não existir, aparece um espaço reservado elegante.

Para converter uma foto em WebP, use o [Squoosh](https://squoosh.app) (grátis, no navegador): abra a foto, escolha *WebP* com qualidade 75–80 e baixe.

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

## 5. O que o site faz (movimento e recursos)

- **Topo:** céu com estrelas piscando e estrelas cadentes, título que surge palavra por palavra, brilho que passa por "Fátima", poeira dourada ao redor de Nossa Senhora e luz que acompanha o mouse. Ao rolar, as camadas se movem em profundidades diferentes.
- **Contagem regressiva** com segundos e números que "rolam" ao mudar.
- **Menu:** barra dourada de progresso de leitura e destaque da seção atual.
- **Programação:** terço de nove contas (as passadas ficam douradas e a de hoje pulsa), cartões com inclinação 3D e reflexo dourado, botões **Adicionar à agenda** (arquivo .ics com os 9 dias e a festa) e **Compartilhar** (menu do celular ou WhatsApp).
- **Festa:** as velas se acendem uma a uma, com brasas subindo, e o visitante pode **acender uma vela** pela sua intenção.
- **Oração:** o texto se ilumina palavra por palavra conforme a leitura.

Tudo respeita a opção "reduzir movimento" do sistema: com ela ligada, o site fica estático e continua completo.

## 6. Estrutura do projeto

```
index.html                 Estrutura da página (textos fixos das seções)
src/data/novena.js         ← DADOS EDITÁVEIS
src/styles/
  fonts.css                Fontes auto-hospedadas (public/fonts/)
  tokens.css               Cores, fontes e medidas
  base.css                 Estilos gerais, botões, ornamentos
  sections.css             Estilo de cada seção
  animations.css           Animações (respeitam "reduzir movimento")
src/js/
  main.js                  Ponto de entrada
  render-program.js        Gera cartões da programação, lista da festa e contatos
  countdown.js             Contagem regressiva
  reveal.js                Revelação dos blocos ao rolar
  effects.js               Efeitos: parallax, partículas, terço, velas, oração
  calendar.js              "Adicionar à agenda" e "Compartilhar"
  menu.js                  Menu do celular
public/                    Arquivos copiados como estão (ícone, og-image, imagens)
scripts/gerar-imagens.mjs  Gera og-image.png e apple-touch-icon.png
scripts/preparar-nossa-senhora.mjs  Converte originais/nossa-senhora.png em WebP
originais/                 Imagens originais (não são publicadas)
vite.config.js             Pré-renderiza o conteúdo de novena.js no HTML (SEO e JSON-LD)
Main.dc.html               Mockup original de referência (não é publicado)
```

O conteúdo de `novena.js` também é gravado direto no HTML na hora do build. Assim o site aparece completo mesmo sem JavaScript e os buscadores leem a programação. O Google recebe ainda os dados estruturados (schema.org `Event`) da novena e da festa.
