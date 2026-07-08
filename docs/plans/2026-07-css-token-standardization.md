# 2026-07 · Padronização dos tokens de CSS numa escala canônica

**Status: ✅ CONCLUÍDO.** Regras duráveis migradas para `docs/architecture.md` §2.

## Contexto

Os tokens já existiam em duas camadas (`app/tokens.css` theme-agnóstico + `app/globals.css` cores),
mas a cobertura de spacing/type era parcial e os valores, irregulares: só `--space-xs/md` (8/18px)
existiam, e literais como `6/7/9/10/11/12/14/16/22/24/26/28px`, fontes `14/15/15.5px`, radii
`3/5/7/11px`, line-heights `1.4–1.85` e durações `0.15–0.25s` estavam crus em ~20 `*.module.css`.

## Decisão

Padronizar numa **escala de design canônica** — permitido mudar o pixel (snap para o step mais
próximo), diferente de uma refatoração pura. Escala:

- **spacing** grade de 4px: `2xs 4 · xs 8 · sm 12 · md 16 · lg 24 · xl 32`
- **type** terminal-small: `xs 12 · sm 13 · md 14 · lg 16` (headings em `clamp()` ficam literais)
- **radius** `xs 4 · sm 6 · md 10 · full 50%`
- **leading** `tight 1.1 · snug 1.4 · normal 1.5 · relaxed 1.6 · loose 1.75`
- **motion** `--transition 0.2s · --transition-slow 0.25s`

Como os tokens existentes (`--text-md/lg`, `--space-md`) mudaram de valor, os usos de `var()`
foram **re-apontados** pelo valor original (ex.: quem usava `--text-md`=13 passou a `--text-sm`=13).

## Tabela de snapping (valor original → token)

| Categoria       | Mapeamento                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| **Spacing**     | 6/7/9→`xs`(8) · 10/11/12→`sm`(12) · 14/15/16/18→`md`(16) · 22/24/26/28→`lg`(24) · 30/32→`xl`(32) · 5/3→`2xs`(4) |
| **Type**        | 11/11.5/12→`xs`(12) · 12.5/13→`sm`(13) · 13.5/14→`md`(14) · 15/15.5→`lg`(16)                                    |
| **Radius**      | 3/5→`xs`(4) · 6/7→`sm`(6) · 10/11→`md`(10) · 50%→`full`                                                         |
| **Line-height** | 1.02→`tight` · 1.4→`snug` · 1.5→`normal` · 1.6→`relaxed` · 1.7/1.85→`loose`(1.75)                               |
| **Motion**      | 0.15/0.16/0.18/0.2→`transition` · 0.25→`transition-slow`                                                        |

## Exceções que ficaram literais (por design)

Clamps responsivos (gutter, section, headings), micro-ajustes < 4px (`2px`, `3px`), tamanhos de
componente (ícone check 22px, iconbtn 32px, dot 9px, barra 6px, label 74px), posicionamento
(`left/top`), sombras, `flex-basis`, grid `minmax()` (190/240/258px) e o breakpoint 720px.
O **Terminal** (`Terminal.module.css` + `lib/terminal.ts`) ficou **intocado** — sempre escuro, literais intencionais.

## Verificação

`npm run lint` · `npx tsc --noEmit` · `npm run build` · `npm test` (156 testes) — todos verdes.
Revisão visual em `/` e `/pt/` (tema claro e escuro): layout mantém-se harmônico; Terminal idêntico.
