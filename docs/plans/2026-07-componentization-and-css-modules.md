# Plano — Componentização, pastas e CSS Modules (jul/2026) · ✅ concluído

> **Registro de execução arquivado.** As convenções duráveis extraídas deste trabalho
> vivem em [`../architecture.md`](../architecture.md) (§1 estrutura de pastas, §2 estilo).
> Este arquivo é o histórico de *como* chegamos lá — não é um doc vivo.
>
> Refactor **sem alterar comportamento observável** (UI, temas, i18n, rotas). Etapas
> pequenas e independentes, uma por commit. Portão a cada passo: `lint` +
> `tsc --noEmit` (zero `any`) + `build` + `test` + checagem visual no browser.

## Contexto

Continuação do refactor de reutilização anterior
([`2026-07-refactor-reuse-and-organization.md`](./2026-07-refactor-reuse-and-organization.md)).
Sobravam três problemas de organização: (1) HTML repetido sem primitivo — 6 `<button className="btn …">`
à mão, botões de ícone e cards montados manualmente; (2) `Header`, `Footer`, `Portfolio`,
`Terminal`, `PortfolioProvider`, `EmptyState` soltos na raiz de `components/`; (3) todo o
estilo num único `app/globals.css` (~221 linhas). O usuário pediu primitivos (`Button`/`Card`),
pastas de layout e a saída do CSS global rumo a CSS Modules co-locados.

## Decisões de escopo
- **CSS Modules co-locados** (Next 16 nativo, zero deps). `globals.css` vira global layer enxuto.
  Muda a regra antiga "sem CSS Modules" — migrada em `architecture.md` §2.
- Pastas: **`components/layout/` + `components/providers/` + `components/ui/`**.
- Keyframes ficam **globais** (CSS Modules só escopa keyframes definidos no módulo).
- `StackGroupCard` sai para `sections/` (tem lógica de domínio) — **não** vai para `ui/`.
- Botão `term-close` do terminal **não** vira `IconButton` (visual diferente do `.iconbtn`).

## Passos executados
1. **`lib/cx.ts`** — helper puro de junção de classes (+ teste). Base para modificadores com `styles[...]`.
2. **Reorganização de pastas** — `Header`/`Footer`/`Portfolio`/`Terminal` → `layout/`,
   `PortfolioProvider` → `providers/`, `EmptyState` → `ui/`. Imports cross-layer no alias `@/`.
3. **Primitivos** `ui/Button`, `ui/IconButton`, `ui/Card` (+ testes de contrato) e extração de
   `sections/StackGroupCard`. Consumidores (Hero, Footer, Header, RevealControls, Languages, Stack)
   passam a usar os primitivos; classes preservadas 1:1.
4. **Button → CSS Module** como spike de tooling; `vitest.config.ts` ganha
   `css.modules.classNameStrategy: "non-scoped"` (testes afirmam nomes BEM literais). Validado em tsc/vitest/build.
5. **Migração CSS Modules do resto** — um `Component.module.css` por componente; `globals.css`
   reduzido ao global layer (tokens de cor, resets, keyframes, `.accent`/`.muted`/`.caret`/`kbd`/`.sr-only`).
   `Certs` reusa a superfície `Card` via `composes`. Terminal mantém hex literais.

## Estado final
- Estrutura: `components/{ui,layout,providers,sections}/`, cada componente com seu `.module.css`.
- `app/globals.css`: ~60 linhas (só global layer). Nenhum bloco de componente restante.
- Testes: 53 verdes (inclui novos contratos de `Button`/`IconButton`/`Card` e `cx`).
- `lint` + `tsc --noEmit` + `build` verdes; sem mudança visual (verificado em claro/escuro, en/pt,
  paginação, expand do Stack, terminal, menu mobile).

## Fora de escopo (futuro)
- Conversão de seções em Server Components — segue bloqueada pelo `lang` client-reativo (ver §4).
- Possível `utils.module.css` para `.accent`/`.muted` caso o global layer cresça.
