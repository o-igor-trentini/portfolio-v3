<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Projeto: portfolio-v3

Convenções completas em **`docs/architecture.md`** (fonte da verdade — leia antes de mudanças estruturais). **SEO, i18n, roteamento por idioma, metadata, hreflang, JSON-LD e social preview** têm doc dedicada em **`docs/seo-i18n.md`** (leia antes de mexer nesses temas). Guardrails essenciais:

- **Verificação a cada mudança**: `npm run lint` + `npx tsc --noEmit` (zero `any`) + `npm run build` + `npm test`. Refactor **não** pode alterar comportamento observável (UI, rotas, dados); trabalhe em etapas pequenas.
- **Onde colocar código**: lógica pura sem React → `lib/`; estado/efeito reutilizável → `hooks/`; apresentação reutilizável → `components/ui/`; seções da página → `components/sections/`.
- **CSS**: **CSS Modules co-locados** (`Component.module.css`) — sem Tailwind nem CSS-in-JS. Cores theme-reativas em `app/globals.css`; sizing/spacing/motion em `app/tokens.css`. BEM kebab-case.
- ⚠️ **O terminal é sempre escuro**: as cores em `lib/terminal.ts` (`COLOR`) são hex literais de propósito — **não** troque por tokens theme-reativos (`var(--fg)`, `var(--muted)`…) ou o tema claro quebra (texto escuro sobre fundo escuro).
- **i18n**: o idioma vem da **URL** (inglês em `/`, português em `/pt/` via route groups + múltiplos root layouts) — trocar idioma é navegação, não estado. Use os helpers de `lib/content.ts` (`stackLabel`, `projectDesc`, `langName`, `langLevel`, `formatExperience`) em vez de ternários `lang === "pt" ? … : …` inline. Detalhes em `docs/seo-i18n.md`.
- **SEO / export estático**: `output: "export"` → sem middleware/redirect e `generateMetadata` não pode depender de request. Metadata/hreflang em `lib/seo.ts` (`buildMetadata`), JSON-LD em `buildJsonLd`, OG em `lib/og.tsx`. ⚠️ Rotas de imagem (`opengraph-image`, `icon`, `apple-icon`) precisam de `export const dynamic = "force-static"`; hreflang deve ser recíproco; ícones gerados são servidos **sem** extensão (`/icon`, `/apple-icon`).
- **Testes** (Vitest + Testing Library, jsdom): teste lógica pura (`lib/`), hooks (`hooks/`) e o contrato de `components/ui/`; não teste CSS puro nem markup trivial. Datas: `nowYM()` + `vi.setSystemTime`.
- **Planos de trabalho** ficam em `docs/plans/AAAA-MM-<slug>.md`; regras que valem além de um plano migram para `docs/architecture.md`.
