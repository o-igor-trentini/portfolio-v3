<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Projeto: portfolio-v3

Fontes da verdade (leia **antes** de mexer no tema correspondente):

- **`docs/architecture.md`** — estrutura de pastas, CSS/tokens, terminal, estado, testes.
- **`docs/seo-i18n.md`** — SEO, i18n, roteamento por idioma, metadata, hreflang, JSON-LD, OG, ícones.
- **`docs/analytics.md`** — analytics, consentimento, eventos.
- **`CONTRIBUTING.md`** — setup e o portão de verificação (workflow).
- **`docs/README.md`** — índice de toda a documentação.

Guardrails de alto risco (o detalhe está nos docs acima):

- **Portão de verificação a cada mudança**: `npm run check` (lint + typecheck **zero `any`** + test + build). Refactor **não** altera comportamento observável; etapas pequenas. — _ver `CONTRIBUTING.md`._
- **Onde colocar código**: lógica pura sem React → `lib/`; estado/efeito reutilizável → `hooks/`; apresentação reutilizável → `components/ui/`; seções da página → `components/sections/`. — _ver `architecture.md` §1._
- ⚠️ **O terminal é sempre escuro**: as cores em `lib/terminal.ts` (`COLOR`) e em `Terminal.module.css` são hex literais de propósito — **não** troque por tokens theme-reativos (`var(--fg)`…) ou o tema claro quebra. — _ver `architecture.md` §3._
- **i18n vem da URL** (en em `/`, pt em `/pt/`) — trocar idioma é navegação, não estado. Use os helpers de `lib/content.ts` em vez de ternários `lang === "pt" ? …` inline. — _ver `seo-i18n.md`._
- **SEO / export estático** (`output: "export"`): sem middleware/redirect/`generateMetadata` dependente de request; rotas de imagem precisam de `dynamic = "force-static"`; hreflang recíproco. — _ver `seo-i18n.md`._
- **Planos** ficam em `docs/plans/AAAA-MM-<slug>.md`; regra que sobrevive ao plano migra para `docs/architecture.md`.
