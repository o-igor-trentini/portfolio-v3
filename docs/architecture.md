# Arquitetura & Convenções — portfolio-v3

Regras **duráveis** que restringem mudanças futuras. Decisões pontuais de execução
(planos passo-a-passo) ficam arquivadas em [`plans/`](./plans/).

---

## 1. Stack & estrutura de pastas

- Next.js 16 (App Router) + React 19 + TypeScript estrito. **CSS puro** — sem Tailwind, CSS-in-JS ou CSS Modules.
- ⚠️ Este Next é modificado — leia o guia relevante em `node_modules/next/dist/docs/` **antes** de escrever código (ver `AGENTS.md`).
- Onde cada coisa vive:
  - `app/` — rotas, `layout`, metadata, `globals.css`, `tokens.css`.
  - `components/ui/` — primitivos de apresentação reutilizáveis, **sem lógica de domínio** (`Section`, `RevealControls`, `ExternalLink`, `TagList`).
  - `components/sections/` — seções da página; consomem `ui/`, `hooks/`, `lib/`.
  - `hooks/` — hooks de client reutilizáveis (estado + efeitos).
  - `lib/` — dados e **lógica pura, sem React** (`content`, `date`, `i18n`, `terminal`).
- Regra de decisão: lógica pura → `lib/`; estado/efeito reutilizável → `hooks/`; apresentação reutilizável → `components/ui/`.

## 2. Design tokens & tema

- **Cores são theme-reativas** via CSS custom properties em `globals.css` (`:root` + `html[data-theme="light"]`). O tema é aplicado pré-hidratação por um script inline no `layout.tsx` (evita flash).
- **Sizing/spacing/motion são theme-agnósticos** em `app/tokens.css` (`--radius-*`, `--text-*`, `--space-*`, `--transition`, `--gutter`, `--container`, `--hairline`).
- Onde adicionar: cor nova → `globals.css` (nos dois temas, se aplicável); medida repetida → `tokens.css`.
- `--hairline` guarda o shorthand `1px solid var(--border)`; o `var(--border)` resolve no ponto de uso, então **segue o tema** mesmo definido uma vez.
- Classes-base `.card` (superfície com borda) e `.btn` (reset universal) ficam no topo do `globals.css`, **antes dos consumidores**, para que regras `:hover`/`--active` vençam por ordem de origem (todas têm a mesma especificidade).
- Convenção de nomes: **BEM kebab-case** (`bloco__elemento--modificador`).

## 3. O terminal é sempre escuro ⚠️ (regra fácil de violar sem querer)

- A janela do terminal **não segue o tema** — `--termbg` não é sobrescrito no tema claro.
- Por isso as cores de saída em `lib/terminal.ts` (`COLOR`) são **hex literais**, não tokens theme-reativos. Trocar `#e4e4e7`/`#71717a` por `var(--fg)`/`var(--muted)` deixaria texto escuro sobre fundo escuro no tema claro. Só `accent` usa token (funciona bem no escuro).
- Comandos ficam num **registry** `Record<cmd, Handler>` em `lib/terminal.ts`. `clear`/`exit` são exceções que ficam no componente (controlam buffer/visibilidade).

## 4. Estado global: um único contexto

- `PortfolioProvider` **compõe** `useTheme` + `useLang` + `useTerminal` e expõe tudo por `usePortfolio()`. Mantenha a **API pública de `usePortfolio` estável** — há muitos consumidores.
- Um **único listener de keydown** em `useTerminal` cuida de backtick/Esc/konami. Não separe o konami: backtick/Esc passariam a ser gravados no buffer, mudando o comportamento.
- i18n: dicionários em `lib/i18n.ts`; seleção de campo via helpers em `lib/content.ts` (`stackLabel`, `projectDesc`, `langName`, `langLevel`, `formatExperience`). **Use os helpers** em vez de ternários `lang === "pt" ? … : …` inline.
- **Seções são Client Components por causa do `lang`.** O `lang` é Context client-reativo (`useLang`: `useState`+`localStorage`), trocado em runtime **sem navegação**. Um Server Component renderiza uma vez no servidor e não reage a esse toggle — até `About` lê `t.about` = `i18n[lang]` reativo. Por isso **converter seções em Server Components está bloqueado**: extrair a parte interativa em ilha não basta (o bloqueio é a *fonte* do `lang`). Habilitar exigiria mover `lang` para roteamento por locale (`app/[lang]/…`), o que muda URLs e torna a troca de idioma uma navegação — grande e com mudança de comportamento observável. Os primitivos `ui/Section`, `ui/ExternalLink`, `ui/TagList` já são server-safe (sem `"use client"`); só o `lang` prende a árvore no client.

## 5. Disciplina de mudança & testes

- **Refactor = sem mudança de comportamento observável** (UI, rotas, dados). Etapas pequenas e independentes, um commit por unidade.
- Portão a cada mudança: `npm run lint` + `npx tsc --noEmit` (**zero `any`**) + `npm run build` + `npm test` + verificação no browser.
- Testes (Vitest + Testing Library, jsdom): teste **lógica pura** (`lib/`) e **hooks** (`hooks/`), e o **contrato** de componentes `ui/`. Não teste CSS puro nem markup trivial.
- Datas dinâmicas: `nowYM()` em `lib/date.ts`; nos testes use `vi.setSystemTime` para determinismo.

---

## Comentários no código

Decisões locais não-óbvias vivem como comentário **co-localizado** ao código (ex.: por que `--hairline`,
por que `.card` não se aplica a `.project`/`.empty`, por que `clear`/`exit` ficam fora do registry). Prefira
isso a documentar o óbvio aqui — comentário junto do código não sofre *drift*.
