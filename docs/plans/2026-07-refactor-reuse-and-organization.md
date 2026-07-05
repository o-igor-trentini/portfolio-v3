# Plano — Refatoração para reutilização e organização (jul/2026) · ✅ concluído

> **Registro de execução arquivado.** As convenções duráveis extraídas deste trabalho
> vivem em [`../architecture.md`](../architecture.md). Este arquivo é o histórico de *como*
> chegamos lá — não é um doc vivo.
>
> Refactor **sem alterar comportamento observável** (UI, rotas, dados). Etapas
> pequenas e independentes, uma por commit. Antes do próximo item: `lint` +
> `tsc --noEmit` + `build` verdes e checagem visual no browser. Zero `any`.
>
> ⚠️ AGENTS.md: este é um Next.js modificado — ler o guia relevante em
> `node_modules/next/dist/docs/` **antes** de escrever código.

## Contexto

Portfólio Next.js 16 (App Router) + React 19 + TS, tema "terminal", i18n en/pt,
tema claro/escuro e terminal interativo. Código limpo, mas com duplicação em JSX
(cabeçalho de seção, controles de paginação, links externos, listas de tags),
lógica (paginação, período de experiência, seleção de idioma) e CSS (valores
mágicos, blocos de card/botão copiados).

## Decisões de escopo
- CSS: arquivo global único + **tokens** + classes-base `.card`/`.btn` (sem CSS Modules).
- Server Components: **fora de escopo** (recomendação futura).
- `Terminal.tsx` / `PortfolioProvider.tsx`: refatorados **por último**, isolados.

## Estrutura de pastas alvo
```
components/ui/     # NOVO — Section, RevealControls, ExternalLink, TagList
components/sections/  # passa a consumir ui/ e hooks/
hooks/             # NOVO — usePagination, useNowYM
lib/               # content.ts (+formatExperience), date.ts (+nowYM)
app/tokens.css     # NOVO — :root de design tokens
app/globals.css    # importa tokens.css; usa base .card/.btn
```

---

## Etapa 1 — Tokens de CSS  · risco: baixo  ✅ CONCLUÍDA
Resolve: **C1**
- [x] Criar `app/tokens.css` com `:root`: `--radius-xs/sm/md`, `--text-xs/sm/md/lg`,
      `--space-xs/md`, `--transition:.2s`, `--gutter:clamp(20px,5vw,40px)`,
      `--container:860px`, `--hairline` (cores existentes mantidas).
- [x] Importar `tokens.css` no topo de `globals.css` (`@import "./tokens.css";`).
- [x] Trocar literais repetidos pelos tokens **sem mudar o pixel final**
      (`1px solid var(--border)` ×17 → `--hairline`, gutter ×4, container ×3, `.2s` ×11).
- [x] Font-sizes: só os 4 recorrentes (12/12.5/13/13.5) viraram token, valor idêntico;
      tamanhos únicos (11/11.5/14/15/15.5px) mantidos literais.
- [x] Verificar: lint ✓, `tsc --noEmit` ✓, `build` ✓; computed styles no browser confirmam
      valores originais e `--hairline` seguindo o tema (claro: `1px solid #e7e5e4`).

## Etapa 2 — Classes-base `.card` e `.btn`  · risco: baixo  ✅ CONCLUÍDA
Resolve: **C2**
- [x] Adicionar `.card` (surface) e `.btn` base em `globals.css` (bloco "base primitives"
      no topo, antes dos consumidores, para que regras `:hover`/`--active` vençam por ordem).
- [x] `.card` aplicado a `.langcard` e `.cert` (superfície idêntica). `.project` (sem borda,
      fundo só no hover) e `.empty` (borda tracejada + padding maior) **mantidos fora** —
      compô-los mudaria pixels; documentado em comentário no CSS.
- [x] `.btn` base (`background:transparent;font-family:inherit;cursor:pointer` — único conjunto
      universal) aplicado aos 6 botões (`btn-accent/ghost/link`, `term-btn`, `chip-btn`, `langtoggle__btn`).
- [x] Verificar: lint ✓, `tsc` ✓, `build` ✓. Teste de cascade isolado no browser confirma
      ativo=accent+bold, inativo=transparent+muted e card=18px/1px/10px/branco — idêntico ao original.

## Etapa 3 — `usePagination` + `<RevealControls>`  · risco: baixo · ganho: alto  ✅ CONCLUÍDA
Resolve: **L1 + J2**
- [x] `hooks/usePagination.ts` genérico `<T>`: `{ shown, hasMore, canCollapse, remaining, showMore, collapse }`.
- [x] `components/ui/RevealControls.tsx` (i18n-agnóstico: recebe `moreLabel`/`lessLabel`).
- [x] Aplicado em `Projects.tsx` e `Certs.tsx` (removido o `useState` + JSX duplicado dos controles).
- [x] **Vitest configurado** (`vitest.config.ts` + `vitest.setup.ts`, alias `@/*` nativo, jsdom, jest-dom;
      scripts `test`/`test:watch`) + **9 testes** (`usePagination` 5 · `RevealControls` 4).
- [x] Verificar: lint ✓, `tsc` ✓, `build` ✓, `test` 9/9 ✓; browser confirma 4→6→4 e more/less idênticos.

## Etapa 4 — `<Section>` wrapper  · risco: baixo · ganho: alto  ✅ CONCLUÍDA
Resolve: **J1**
- [x] `components/ui/Section.tsx`: props `id?`, `label?`, `note?`, `solo?`, `variant?`("hero"), `children`.
      Renderiza o wrapper `section`, o header `// label` e o `note` opcionais.
- [x] Aplicado nas 8 seções: Hero (`variant="hero"`, sem id/label), About (`solo`, sem note),
      e as 6 com id + label + note (Experience/Languages/Stack/Projects/Certs/Contact).
- [x] **+3 testes** (`Section`): header com prefixo `//` + note + children; `solo` sem note; `hero` sem id/label.
- [x] Verificar: lint ✓, `tsc` ✓, `build` ✓, `test` 12/12 ✓; browser confirma 8 seções com ids
      corretos e todas as âncoras da nav resolvendo (`missingAnchors: []`).

## Etapa 5 — `formatExperience()` + `useNowYM()`  · risco: médio  ✅ CONCLUÍDA
Resolve: **L2 + L3**
- [x] `lib/date.ts`: `nowYM()` puro (`{y, m}` com m 1-12); `hooks/useNowYM.ts` (client, null no SSR → preenche no mount).
- [x] `lib/content.ts`: `formatExperience(e, lang, now) => { present, period, duration, tags }`
      (usa `i18n[lang].experience.present` internamente, desacoplado do contexto).
- [x] Aplicado em `Experience.tsx` (removida a lógica inline de datas; o Terminal consome na Etapa 8).
- [x] **+7 testes**: `nowYM` (2, com fake timers) · `formatExperience` (5: en/pt, now null, role finalizado, tags vazias).
- [x] Verificar: browser confirma "mai 2026 — presente · 3 meses" (ao vivo) e "set 2021 — mai 2026 · 4 anos 9 meses".

## Etapa 6 — `<ExternalLink>` + `<TagList>`  · risco: baixo  ✅ CONCLUÍDA
Resolve: **J3 + J4**
- [x] `components/ui/ExternalLink.tsx` — encapsula `target="_blank"`/`rel="noopener noreferrer"`.
      O `↗` **ficou nos filhos** de cada seção (posições/classes diferentes: `project__ext`, `cert__verify`, `contact-row__ext`) — forçá-lo mudaria o markup.
- [x] `components/ui/TagList.tsx` (`items`, `className`) — sem wrapper, para o Stack manter o botão irmão.
- [x] ExternalLink em Projects/Certs/Contact; TagList em Projects/Experience/Stack.
- [x] **+3 testes**: `ExternalLink` (garante o `rel` de segurança) · `TagList` (spans por item; vazio → nada).
- [x] Verificar: lint ✓, `tsc` ✓, `build` ✓, `test` 22/22 ✓; browser confirma links `_blank`+`noopener noreferrer` e pills idênticas.

## Etapa 7 — Reuso dos helpers de i18n  · risco: baixo  ✅ CONCLUÍDA
Resolve: **L4**
- [x] `Terminal.tsx`: 4 ternárias de campo de conteúdo trocadas pelos helpers
      (`stackLabel`, `projectDesc`, `langName`, `langLevel`). Stack já usava `stackLabel`;
      suas outras ternárias são microcopy de UI (`"menos"`/`"mostrar mais N"`), sem helper — mantidas.
- [x] `Localized<T>` **não** generalizado — aumentaria o diff sem reduzir código real agora (helpers já enxutos).
- [x] **+3 testes**: `stackLabel`/`projectDesc`/`langName`+`langLevel` com objetos sintéticos (guardam a seleção en/pt).
- [x] Verificar: lint ✓, `tsc` ✓, `build` ✓, `test` 25/25 ✓; terminal do app confirma `skills`/`projects`/`languages` idênticos (pt).

## Etapa 8 — Refatorar `Terminal.tsx`  · risco: médio · por último  ✅ CONCLUÍDA
- [x] Lógica de comandos extraída para `lib/terminal.ts` (sem React): `switch` → registry
      `Record<cmd, Handler>` + `runTerminalCommand`. `clear`/`exit` seguem no componente (controlam buffer/visibilidade).
- [x] `experience` reusa `formatExperience` (elimina a duplicação de datas L2); componente ficou fino (~130 → estado + efeitos + wrapping do echo).
- [x] Cores: `COLOR` **mantido literal** (o terminal é sempre escuro; tokens theme-reativos quebrariam o tema claro) — só `accent` usa token, como já era. Documentado.
- [x] **+9 testes** (`runTerminalCommand`): not-found, help, alias whoami→about, skills padEnd (pt), echo, lang (callback), theme, neofetch, experience (fake timers).
- [x] Verificar: lint ✓, `tsc` ✓, `build` ✓, `test` 34/34 ✓; terminal do app confirma help/experience/neofetch/not-found/echo e `clear` zera o buffer.

## Etapa 9 — Dividir `PortfolioProvider.tsx`  · risco: médio · por último  ✅ CONCLUÍDA
- [x] Extraídos `hooks/useTheme.ts`, `hooks/useLang.ts`, `hooks/useTerminal.ts`; provider só compõe os 3 + monta o `value`.
- [x] Konami ficou dentro do `useTerminal` (um único listener de keydown) — separar mudaria o buffer (backtick/Esc passariam a ser gravados). Documentado.
- [x] `usePortfolio()` com a **mesma API pública** (nenhum consumidor alterado).
- [x] **+7 testes**: `useTheme` (2), `useLang` (2), `useTerminal` (3: callbacks, backtick/Esc, konami).
- [x] Verificar: lint ✓, `tsc` ✓, `build` ✓, `test` 41/41 ✓; browser confirma backtick/Esc, toggle de tema (flip+persist) e idioma (pt→en+persist).

---

## Checklist de verificação (repetir a cada etapa)
- [x] `npm run lint` sem erros
- [x] `npx tsc --noEmit` sem erros · zero `any`
- [x] `npm run build` verde
- [x] Browser: tema claro/escuro, idioma en/pt, paginação, expand/collapse, terminal — **sem mudança visível**
- [x] Diff resumido apresentado antes de seguir

> **Todas as 9 etapas concluídas.** Suíte final: **41 testes** verdes (Vitest). Cobertura nova:
> `hooks/` (usePagination, useNowYM via content, useTheme, useLang, useTerminal),
> `lib/` (nowYM, formatExperience, helpers i18n, runTerminalCommand), `components/ui/`
> (Section, RevealControls, ExternalLink, TagList).

## Fora de escopo (futuro)
- Converter seções (About/Stack/Projects/Contact) em Server Components: **bloqueado** enquanto o `lang`
  for Context client-reativo (troca em runtime, sem navegação). Pré-requisito = roteamento por locale
  (`app/[lang]/…`), que muda URLs e comportamento do toggle. Detalhes na regra durável em
  [`../architecture.md`](../architecture.md) §4.
- ~~Alinhar `Icons.tsx` com `"use client"`~~ · **resolvido (jul/2026):** não era diretiva a fazer — `Icons.tsx`
  é SVG puro e adicionar `"use client"` o desalinharia dos primitivos puros (`ui/ExternalLink`, `ui/Section`,
  `ui/TagList`). Movido para `components/ui/Icons.tsx` (alinhamento organizacional), permanecendo sem a diretiva.
