# Arquitetura & Convenções — portfolio-v3

Regras **duráveis** que restringem mudanças futuras. Decisões pontuais de execução
(planos passo-a-passo) ficam arquivadas em [`plans/`](./plans/). **SEO, i18n,
roteamento por idioma, metadata, hreflang, JSON-LD e social preview** têm doc
dedicada em [`seo-i18n.md`](./seo-i18n.md).

---

## 1. Stack & estrutura de pastas

- Next.js 16 (App Router) + React 19 + TypeScript estrito. **CSS puro** (sem Tailwind nem CSS-in-JS), organizado em **CSS Modules co-locados** + um global layer enxuto — ver §2.
- ⚠️ Este Next é modificado — leia o guia relevante em `node_modules/next/dist/docs/` **antes** de escrever código (ver `AGENTS.md`).
- Onde cada coisa vive:
  - `app/` — rotas, `layout`, metadata, `globals.css` (global layer), `tokens.css`.
  - `components/ui/` — primitivos de apresentação reutilizáveis, **sem lógica de domínio** (`Button`, `IconButton`, `Card`, `Section`, `RevealControls`, `ExternalLink`, `TagList`, `EmptyState`, `Icons`, `OpenTerminalButton`).
  - `components/layout/` — chrome de página / shell: `Header`, `Footer`, `Portfolio` (composição) e o overlay `Terminal`.
  - `components/providers/` — provedores de contexto/estado: `PortfolioProvider` (i18n + tema) e `TerminalProvider` (estado do terminal) — ver §4.
  - `components/sections/` — seções da página; consomem `ui/`, `hooks/`, `lib/`. Sub-componentes com lógica de domínio (ex.: `StackGroupCard`) ficam aqui, **não** em `ui/`.
  - `hooks/` — hooks de client reutilizáveis (estado + efeitos).
  - `lib/` — dados e **lógica pura, sem React** (`content`, `date`, `i18n`, `terminal`, `cx`, `locale`, `nav`, `format`).
- Regra de decisão: lógica pura → `lib/`; estado/efeito reutilizável → `hooks/`; apresentação reutilizável sem domínio → `components/ui/`; chrome/shell → `components/layout/`; provedor de estado → `components/providers/`.
- Imports cross-layer usam o alias `@/…`; relativos (`./`, `../`) só entre irmãos da mesma pasta.

## 2. Estilo: CSS Modules co-locados + global layer

- **Estilo de componente vive num `Component.module.css` co-locado**, importado como `styles` e referenciado por `styles.bloco__el` (acesso por ponto funciona com `__`; modificadores com hífen usam bracket: `styles["bloco--mod"]`). Classes condicionais/dinâmicas via `cx()` de `lib/cx.ts` — não concatene template strings.
- **`app/globals.css` é só o _global layer_** — o que não pode ser escopado: tokens de cor theme-reativos (`:root` + `html[data-theme="light"]`), resets de elemento, `@keyframes`, e utilitários usados como spans/elementos avulsos em vários componentes (`.accent`, `.muted`, `.caret`, `kbd`, `.sr-only`). O tema é aplicado pré-hidratação por um script inline no `components/layout/RootShell.tsx` (evita flash).
- **Sizing/spacing/motion são theme-agnósticos** em `app/tokens.css`, numa **escala canônica** que todos os módulos consomem via `var(--…)` (custom properties são globais por natureza):
  - `--space-*` (grade de 4px): `2xs 4` · `xs 8` · `sm 12` · `md 16` · `lg 24` · `xl 32`.
  - `--text-*` (terminal-small): `xs 12` · `sm 13` · `md 14` · `lg 16`. Headings/leads maiores usam `clamp()` literal nos módulos (Hero, About, 404).
  - `--radius-*`: `xs 4` · `sm 6` · `md 10` · `full 50%`.
  - `--leading-*`: `tight 1.1` · `snug 1.4` · `normal 1.5` · `relaxed 1.6` · `loose 1.75`.
  - `--transition` (0.2s) e `--transition-slow` (0.25s, troca de tema); `--gutter`, `--container`, `--hairline`.
- **Não introduza literais avulsos**: uma medida nova faz _snap_ para o step mais próximo da escala. Exceções que ficam literais: **clamps responsivos**, **micro-ajustes < 4px** (ex.: `padding: 2px`), **tamanhos de componente** (ícones 22/32px, dots, alturas de barra), posicionamento, sombras, `flex-basis`, grid `minmax()` e breakpoints.
- Onde adicionar: **estilo de um componente → o `.module.css` dele**; cor nova theme-reativa → `globals.css` (nos dois temas); medida nova → step da escala em `tokens.css` (ou snap para um existente); utilitário realmente transversal → `globals.css`.
- `--hairline` guarda o shorthand `1px solid var(--border)`; o `var(--border)` resolve no ponto de uso, então **segue o tema** mesmo definido uma vez.
- Superfícies compartilhadas usam **`composes`**: ex.: `.cert` em `Certs.module.css` faz `composes: card from "@/components/ui/Card.module.css"` (a superfície da `Card` num `<a>`, sem renderizar `<Card>`).
- **`@keyframes` ficam globais** em `globals.css`. CSS Modules só escopam keyframes definidos _dentro_ de um módulo; referenciar um keyframe por nome a partir de um módulo resolve no global. Assim não há duplicação nem risco de rename.
- Convenção de nomes: **BEM kebab-case** (`bloco__elemento--modificador`), agora escopado por módulo.
- Testes de contrato de `ui/` afirmam sobre os nomes BEM literais — o Vitest usa `css.modules.classNameStrategy: "non-scoped"` (`vitest.config.ts`), então `styles.btn === "btn"` nos testes.
- ⚠️ Comentários em `.css` fecham no primeiro `*/` — não escreva globs como `**/*.css` dentro de `/* … */` (o `*/` embutido corta o comentário).

## 3. O terminal é sempre escuro ⚠️ (regra fácil de violar sem querer)

- A janela do terminal **não segue o tema** — `--termbg` não é sobrescrito no tema claro.
- Por isso as cores de saída em `lib/terminal.ts` (`COLOR`) **e** as cores de superfície/borda/texto em `components/layout/Terminal.module.css` (`#16161a`, `#2a2a30`, `#8a8a93`, `#e4e4e7`) são **hex literais**, não tokens theme-reativos. Trocar `#e4e4e7`/`#71717a` por `var(--fg)`/`var(--muted)` deixaria texto escuro sobre fundo escuro no tema claro. Só `accent` usa token (funciona bem no escuro).
- Comandos ficam num **registry** (array de `{ name, handler?, description? }`) em `lib/terminal.ts`. A lista do `help` é **gerada** do registry (entradas com `description`), então não pode divergir dos handlers; aliases e easter eggs (sem `description`) não aparecem. `clear`/`exit` ficam no componente (controlam buffer/visibilidade), mas carregam `description` para constar no `help`.

## 4. Estado global: dois contextos

- **Dois provedores**, compostos em `Portfolio.tsx` (`<PortfolioProvider><TerminalProvider>…`):
  - `PortfolioProvider` compõe `useTheme` + `useLang` e expõe i18n + tema por `usePortfolio()`.
  - `TerminalProvider` isola o estado do terminal (abrir/fechar + konami) em `useTerminalControls()`.
  - **Por quê a divisão:** abrir/fechar o terminal é um toggle frequente; num contexto único ele re-renderizava toda seção que só lê `t`/`lang`. Separado, só os três consumidores do terminal (Hero, Footer, `Terminal`) reagem. `useTerminalBuffer` lê os dois contextos direto (sem prop bag).
  - Mantenha as **APIs de `usePortfolio` e `useTerminalControls` estáveis** — há muitos consumidores.
- Um **único listener de keydown** em `useTerminal` cuida de backtick/Esc/konami. Não separe o konami: backtick/Esc passariam a ser gravados no buffer, mudando o comportamento. O konami **ignora keystrokes digitados num campo** (`typing`), senão as setas de histórico do próprio terminal poderiam disparar o easter egg.
- **Fontes únicas de verdade (derive, não duplique):** metadados de locale (`path`/`htmlLang`/`ogLocale` + cluster hreflang) em `lib/locale.ts`; lista de tecnologias em `lib/content.ts` (`stackItems`/`stackHighlight` → `knowsAbout` e neofetch derivam daí); cores de canvas do tema em `site.config.ts` (`canvas`); itens de navegação em `lib/nav.ts` (`NAV_ITEMS`). Interpolação de `{token}` em copy via `format()` de `lib/format.ts`.
- i18n: dicionários em `lib/i18n.ts` (inclui `seo.title`/`seo.description`); seleção de campo via helpers em `lib/content.ts` (`stackLabel`, `projectDesc`, `langName`, `langLevel`, `formatExperience`). **Use os helpers** em vez de ternários `lang === "pt" ? … : …` inline.
- **O `lang` vem da URL, não de estado.** Cada idioma é uma rota estática própria (`/` en, `/pt/` pt) via route groups + múltiplos root layouts; `useLang(initial)` recebe o locale da rota e ele é **fixo pela vida da página**. Trocar idioma é **navegação** (full reload entre root layouts), não toggle de `useState`. As seções continuam Client Components porque vivem sob os provedores (theme/terminal reativos); a reatividade do `lang` deixou de ser o bloqueio, mas converter em Server Components segue fora de escopo. **Detalhes completos de roteamento/metadata/hreflang/OG em [`seo-i18n.md`](./seo-i18n.md).**

## 5. Disciplina de mudança & testes

- **Refactor = sem mudança de comportamento observável** (UI, rotas, dados). Etapas pequenas e independentes, um commit por unidade.
- Portão a cada mudança: `npm run lint` + `npx tsc --noEmit` (**zero `any`**) + `npm run build` + `npm test` + verificação no browser.
- Testes (Vitest + Testing Library, jsdom): teste **lógica pura** (`lib/`) e **hooks** (`hooks/`), e o **contrato** de componentes `ui/`. Não teste CSS puro nem markup trivial.
- Datas dinâmicas: `nowYM()` em `lib/date.ts`; nos testes use `vi.setSystemTime` para determinismo.

---

## Comentários no código

Decisões locais não-óbvias vivem como comentário **co-localizado** ao código (ex.: por que `--hairline`,
por que `.card` não se aplica a `.project`/`.empty`, por que `clear`/`exit` ficam fora do registry). Prefira
isso a documentar o óbvio aqui — comentário junto do código não sofre _drift_.
