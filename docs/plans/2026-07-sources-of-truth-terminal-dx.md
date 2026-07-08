# 2026-07 — Fontes de verdade, terminal e DX (rodada 3)

Terceira rodada de melhorias, além das duas anteriores (DRY/lazy/a11y/404/SEO/testes).
Regras duráveis migraram para [`../architecture.md`](../architecture.md) (§4) e
[`../seo-i18n.md`](../seo-i18n.md) (§2). Resumo do que foi feito:

- **N — Terminal:** corrigido bug do konami capturando as setas de histórico do input
  (agora ignora keystrokes com `typing`); `help` gerado do registry; `mk` tipado ao
  palette `COLOR`; `neofetch` retorna `Line[]`; removido `String(raw)` morto.
- **L — Fontes únicas de verdade:** `lib/locale.ts` (path/htmlLang/ogLocale + hreflang);
  `stackItems`/`stackHighlight` em `lib/content.ts` alimentam `knowsAbout` e o neofetch;
  `NAV_ITEMS` em `lib/nav.ts` dirige a nav; `canvas` em `site.config.ts` para as cores
  de fundo do tema.
- **O — Contexto:** `TerminalProvider` separado do `PortfolioProvider` para não
  re-renderizar seções ao abrir/fechar o terminal; `useTerminalBuffer` lê os contextos
  direto.
- **M — Reuso:** `OpenTerminalButton` (Hero+Footer); helper `format()` para `{token}`;
  `Section.solo` derivado de `!note`. (M1 ↗/M3 grid/M4 wrapper avaliados e **não**
  feitos — mudariam layout observável por ganho marginal.)
- **P — DX/segurança:** override de `postcss >=8.5.10` (zera as 2 advisories moderadas
  sem o downgrade do `audit fix --force`); coverage no CI com thresholds + lcov;
  `.editorconfig`, `engines`, `LICENSE` (MIT), commitlint + hook `commit-msg`;
  `deploy.yml` não re-roda os checks já feitos no PR.
- **Q — Testes:** Terminal (contrato de dialog/aria/overlay), throw dos dois contextos,
  `StackGroupCard`, e emitters `sitemap`/`robots`/`manifest`. Cobertura ~85% stmts.
- **R — Features:** stylesheet de impressão (`@media print`) para "Salvar como PDF";
  `/.well-known/security.txt` + `/humans.txt`. (View Transitions ficou de fora.)
