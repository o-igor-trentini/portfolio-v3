# SEO & i18n — portfolio-v3

Fonte da verdade para **roteamento por idioma, metadata, structured data e social
preview**. Complementa [`architecture.md`](./architecture.md) (que continua sendo
a fonte das convenções gerais). Regras aqui são **duráveis** — mudanças de execução
ficam em [`plans/`](./plans/).

**Contexto que amarra tudo:** o site é **exportado estaticamente** (`output: "export"`
em `next.config.ts`, hospedado no GitHub Pages via `public/CNAME`). Não há runtime
de servidor: **sem middleware, sem redirects/rewrites, sem `generateMetadata` que
dependa de request**. Tudo é resolvido em **build time**.

---

## 1. Roteamento por idioma (route groups + múltiplos root layouts)

- **Inglês na raiz `/` (canônico), português em `/pt/`.** Cada idioma é uma **página
  estática própria** — `out/index.html` (en) e `out/pt/index.html` (pt) — com
  conteúdo já renderizado no idioma certo (**indexável**, não é SPA vazio).
- Estrutura (arquivos-chave):
  ```
  app/
    (en)/layout.tsx          root layout en → <RootShell lang="en">; metadata = buildMetadata("en")
    (en)/page.tsx            → <Portfolio initialLang="en" />
    (en)/opengraph-image.tsx card OG en
    (pt)/pt/layout.tsx       root layout pt → <RootShell lang="pt">; metadata = buildMetadata("pt")
    (pt)/pt/page.tsx         → <Portfolio initialLang="pt" />
    (pt)/pt/opengraph-image.tsx card OG pt
    icon.tsx · apple-icon.tsx · manifest.ts · sitemap.ts · robots.ts · favicon.ico
  components/layout/RootShell.tsx   o <html>/<head>/<body> compartilhado
  ```
- **Por que route groups e não `app/[locale]/`.** Sob `output: export` é a **única**
  forma de ter inglês na raiz `/` (sem duplicar `/en/`, que competiria pelo canônico)
  **e** o `<html lang>` correto renderizado no build. Next permite [múltiplos root
  layouts via route groups](https://nextjs.org/docs/app/api-reference/file-conventions/layout#multiple-root-layouts):
  `(en)` → `/`, `(pt)/pt` → `/pt/`, cada um com seu próprio `<html lang>`. Um
  segmento `[locale]` geraria `/en/` + `/pt/` e precisaria de um redirect em `/`
  (indisponível no export).
- ⚠️ **`RootShell` é o root layout de verdade.** Ele renderiza `<html>`/`<body>` e é
  o único lugar com `next/font`, o script de tema pré-paint, o CSS de accent e o
  JSON-LD. Os dois `layout.tsx` são cascas finas: `export const metadata =
  buildMetadata(lang)` + `export { viewport } from "@/lib/seo"` + `<RootShell
  lang=…>`. O lint `no-head-element` dispara um falso-positivo no `<head>` do
  `RootShell` (por ser componente, não arquivo de layout) — há um
  `eslint-disable-next-line` explicando.
- **`trailingSlash: true`** (em `next.config.ts`) faz o export emitir
  `out/pt/index.html` (servido limpo em `/pt/`) em vez de `out/pt.html`. Todos os
  URLs canônicos/hreflang/sitemap usam a barra final para casar com os arquivos.

### O idioma vem da URL, não de estado

- `hooks/useLang.ts` virou `useLang(initial)`: `lang` é **fixo pela vida da página**
  (o valor vem do `initialLang` que cada `page.tsx` passa). **Não há `localStorage`
  nem sniff de `navigator.language`** — se houvesse, o conteúdo viraria pós-hidratação
  e divergiria do HTML estático que o crawler indexa.
- **Trocar idioma = navegação.** O switcher no `Header` são `<Link>` reais (`/` ↔
  `/pt/`) — links crawláveis que ajudam o Google a descobrir `/pt/`. Cruzar route
  groups é **full reload** (esperado; o tema é restaurado pré-paint pelo script +
  `localStorage("pf_theme")`).
- `setLang` continua no contexto (agora **navega**, preservando o hash) porque o
  comando `lang` do terminal (`lib/terminal.ts`) o usa. Mantenha essa API.

## 2. Metadata por idioma — `lib/seo.ts`

- **`buildMetadata(lang)`** é a fonte única de metadata das duas rotas. Produz:
  `metadataBase`, `title`/`description` (de `Dict.seo`), `alternates.canonical`
  (`/` ou `/pt/`), **`alternates.languages`** (o cluster hreflang) e `openGraph`
  (locale/url/alternateLocale por idioma) + `twitter`.
- **Cluster hreflang recíproco** — idêntico nas duas páginas:
  `{ en: "/", "pt-BR": "/pt/", "x-default": "/" }`. Inglês é o `x-default`. ⚠️ O
  Google exige que o conjunto seja **recíproco**: se mudar um lado, mude o outro.
  Renderiza como `<link rel="alternate" hrefLang="…">` (React grafa `hrefLang`
  camelCase — grep por `hrefLang`, não `hreflang`).
- **Textos de SEO ficam no dicionário**, não no `seo.ts`: `Dict.seo.{title,description}`
  em `lib/i18n.ts`, uma entrada por idioma. Assim toda tradução vive num lugar só.
- `viewport` (theme-color) é compartilhado e re-exportado pelos dois layouts.

## 3. Structured data (JSON-LD) — `buildJsonLd(lang)`

- Em `lib/seo.ts`; emitido pelo `RootShell` num `<script type="application/ld+json">`.
- Um **`@graph`** com **`Person` + `WebSite` + `ProfilePage`**, ligados por `@id`.
  `inLanguage` reflete o locale (`en` / `pt-BR`). Dados de pessoa/organizações saem
  de `lib/content.ts` (`experiences`, `contacts`) — mantêm-se em sincronia sozinhos.

## 4. Social preview (Open Graph / Twitter) — `lib/og.tsx`

- **`renderOgImage(lang)`** gera um card 1200×630 estilo terminal via `ImageResponse`
  do **`next/og`**, no **build** (sem API de request → compatível com `output: export`).
- Um arquivo por segmento: `app/(en)/opengraph-image.tsx` e
  `app/(pt)/pt/opengraph-image.tsx` (Next injeta `og:image` **e** `twitter:image`
  automaticamente). Servem também de Twitter `summary_large_image`.
- ⚠️ **Rotas de imagem precisam de `export const dynamic = "force-static"`** sob o
  export, senão o build falha ("not configured with output: export").
- **Sem fonte custom** de propósito (mantém o build self-contained; a default sans
  fica bem contra a moldura + accent). Se um dia quiser monospace de verdade, carregue
  o `.ttf` via `readFile(join(process.cwd(), …))` — **não** via `fetch` (rede no build
  é frágil).

## 5. Ícones & manifest

- `app/icon.tsx` (32×32) e `app/apple-icon.tsx` (180×180) são **gerados por código**
  (`next/og`, glifo `>_` no accent) — zero assets binários. Precisam de
  `dynamic = "force-static"`.
- ⚠️ **As rotas de ícone são emitidas SEM extensão** (`/icon`, `/apple-icon`). O
  `app/manifest.ts` referencia **esses paths**, não `/icon.png`. Os `<link rel="icon">`
  no `<head>` o Next injeta sozinho a partir dos arquivos de convenção.
- `app/manifest.ts` é mínimo (`force-static`) — é um portfolio, não um app instalável.

## 6. HTML semântico & headings

- `components/ui/Section.tsx` renderiza o label como **`<h2>`** (prefixo `// ` via
  `<span aria-hidden>`) e nomeia a `<section>` com **`aria-labelledby`**. Resultado:
  **1 `<h1>`** (Hero) + um `<h2>` por seção. Ao criar seção nova, passe `id` **e**
  `label` para o `Section` ganhar heading + nome acessível.

---

## Como continuar contribuindo

- **Mudar título/descrição de SEO:** edite `Dict.seo` em `lib/i18n.ts` (os dois
  idiomas). Nada mais — `buildMetadata`, JSON-LD e OG leem de lá.
- **Adicionar um idioma novo (ex.: `es`):** (1) `Lang` + entrada em `i18n` e nos
  campos `_es` de `lib/content.ts`; (2) mapas de `lib/seo.ts` (`localePath`,
  `ogLocale`, `htmlLang`, `languageAlternates`); (3) novo route group
  `app/(es)/es/{layout,page,opengraph-image}.tsx`; (4) `app/sitemap.ts`; (5) um
  `<Link>` novo no `Header`. Mantenha o cluster hreflang recíproco.
- **Adicionar uma página/rota nova:** ela precisa existir **em cada idioma** (um
  arquivo por route group) e entrar no `sitemap.ts` com os alternates. Lembre que
  não há redirect no export — todo URL servido precisa de um `index.html`.
- ⚠️ **Gotchas do `output: export`** (verifique sempre): `force-static` em toda rota
  de imagem/metadata; barra final consistente; hreflang recíproco; **nada** de
  middleware/redirect/`generateMetadata` dependente de request.

### Verificação (portão a cada mudança)

`npm run lint` + `npx tsc --noEmit` + `npm run build` + `npm test`, e inspecione o
`out/`: `index.html` (lang `en`) e `pt/index.html` (lang `pt-BR`) com conteúdo no
idioma certo; canonical + `hrefLang` (en/pt-BR/x-default) recíprocos; `og:image`
por locale; PNGs `opengraph-image*` (1200×630) e `icon`/`apple-icon` emitidos;
`sitemap.xml` com as duas URLs + alternates; JSON-LD `Person`+`WebSite`+`ProfilePage`.
Depois, sirva local (`npx serve out`) e confira a troca de idioma + um Lighthouse.

---

## Para ferramentas de IA

Esta doc e [`architecture.md`](./architecture.md) são as **fontes da verdade**;
ambas estão listadas no `AGENTS.md` da raiz (carregado automaticamente por
assistentes de código). Antes de mexer em roteamento por idioma, metadata, hreflang,
JSON-LD, OG image, ícones ou headings, **leia esta doc**. E, como diz o `AGENTS.md`:
este Next é modificado — confira o guia relevante em `node_modules/next/dist/docs/`
antes de escrever código.
