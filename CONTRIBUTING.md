# Contribuindo — portfolio-v3

Guia de workflow para trabalhar neste repositório. As **convenções de código** (onde cada
coisa vive, CSS, estado, testes) são fonte da verdade em [`docs/architecture.md`](./docs/architecture.md);
**SEO/i18n** em [`docs/seo-i18n.md`](./docs/seo-i18n.md). Um mapa de toda a documentação está em
[`docs/README.md`](./docs/README.md).

## Setup

```bash
nvm use          # Node da versão em .nvmrc (>= 20)
npm install      # instala deps e ativa os hooks do husky (script prepare)
npm run dev      # dev server em http://localhost:3000
```

## Portão de verificação

**Rode antes de todo commit/PR.** É o gate canônico do projeto:

```bash
npm run check    # = lint + typecheck + test + build
```

Ou individualmente: `npm run lint`, `npm run typecheck` (`tsc --noEmit`, **zero `any`**),
`npm test` (`vitest run`), `npm run build` (export estático → `out/`). Para mudanças de
SEO/i18n, inspecione também o `out/` (ver a seção de verificação em
[`docs/seo-i18n.md`](./docs/seo-i18n.md)).

> ⚠️ Este Next é **modificado** — leia o guia relevante em `node_modules/next/dist/docs/`
> **antes** de escrever código. APIs, convenções e estrutura de arquivos podem divergir do
> que você conhece.

## Disciplina de mudança

- **Refactor = sem mudança de comportamento observável** (UI, rotas, dados). Trabalhe em
  **etapas pequenas e independentes**, um commit por unidade.
- Decisões locais não-óbvias vivem como **comentário co-localizado** ao código, não em doc
  solta (comentário junto do código não sofre _drift_).

## Commits

O histórico segue **[Conventional Commits](https://www.conventionalcommits.org/)**
(`feat`, `fix`, `chore`, `refactor`, `docs`…), verificado pelo hook `commit-msg` (commitlint).
No `git commit`, o hook `pre-commit` roda `lint-staged` (eslint `--fix` + Prettier) nos
arquivos em stage — então a formatação é automática.

- Formatar tudo à mão: `npm run format` · checar: `npm run format:check`.

## Planos de trabalho

Mudanças maiores começam como um plano em `docs/plans/AAAA-MM-<slug>.md` (contexto → passos →
verificação). Ao concluir, o plano é **congelado** como histórico e as **regras que sobrevivem
a ele migram** para [`docs/architecture.md`](./docs/architecture.md) (ou `seo-i18n.md`). Veja os
planos existentes em [`docs/plans/`](./docs/plans/) como referência de formato.
