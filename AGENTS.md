<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Projeto: portfolio-v3

Convenções completas em **`docs/architecture.md`** (fonte da verdade — leia antes de mudanças estruturais). Guardrails essenciais:

- **Verificação a cada mudança**: `npm run lint` + `npx tsc --noEmit` (zero `any`) + `npm run build` + `npm test`. Refactor **não** pode alterar comportamento observável (UI, rotas, dados); trabalhe em etapas pequenas.
- **Onde colocar código**: lógica pura sem React → `lib/`; estado/efeito reutilizável → `hooks/`; apresentação reutilizável → `components/ui/`; seções da página → `components/sections/`.
- **CSS**: cores theme-reativas em `app/globals.css`; sizing/spacing/motion em `app/tokens.css`. BEM kebab-case. Sem Tailwind/CSS-in-JS/CSS Modules.
- ⚠️ **O terminal é sempre escuro**: as cores em `lib/terminal.ts` (`COLOR`) são hex literais de propósito — **não** troque por tokens theme-reativos (`var(--fg)`, `var(--muted)`…) ou o tema claro quebra (texto escuro sobre fundo escuro).
- **i18n**: use os helpers de `lib/content.ts` (`stackLabel`, `projectDesc`, `langName`, `langLevel`, `formatExperience`) em vez de ternários `lang === "pt" ? … : …` inline.
- **Testes** (Vitest + Testing Library, jsdom): teste lógica pura (`lib/`), hooks (`hooks/`) e o contrato de `components/ui/`; não teste CSS puro nem markup trivial. Datas: `nowYM()` + `vi.setSystemTime`.
- **Planos de trabalho** ficam em `docs/plans/AAAA-MM-<slug>.md`; regras que valem além de um plano migram para `docs/architecture.md`.
