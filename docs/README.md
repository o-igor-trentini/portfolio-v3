# Documentação — portfolio-v3

Índice da documentação. Comece por aqui para saber **onde acha cada coisa**.

## Onde acho o quê

| Se você quer…                                                                  | Vá para                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------ |
| Visão geral, features, como rodar, configuração/env                            | [`../README.md`](../README.md)             |
| Contribuir: setup, o portão de verificação, commits, disciplina de mudança     | [`../CONTRIBUTING.md`](../CONTRIBUTING.md) |
| Convenções duráveis: estrutura de pastas, CSS/tokens, terminal, estado, testes | [`architecture.md`](./architecture.md)     |
| SEO, i18n, roteamento por idioma, metadata, hreflang, JSON-LD, OG, ícones      | [`seo-i18n.md`](./seo-i18n.md)             |
| Analytics, consentimento (LGPD/GDPR), eventos, variável de CI                  | [`analytics.md`](./analytics.md)           |
| Histórico: como chegamos ao estado atual (planos de execução)                  | [`plans/`](./plans/)                       |
| Guardrails para ferramentas de IA (entrada automática)                         | [`../AGENTS.md`](../AGENTS.md)             |

## Como esta documentação é organizada

Três camadas, separadas por **audiência + responsabilidade**:

- **Entrada (raiz):** `README.md` (público/humano), `CONTRIBUTING.md` (contribuidor),
  `AGENTS.md` (ferramentas de IA; `CLAUDE.md` só o inclui).
- **Referência (`docs/`):** as **fontes da verdade** duráveis — `architecture.md`,
  `seo-i18n.md`, `analytics.md`. Restringem mudanças futuras.
- **Histórico (`docs/plans/`):** planos de execução **datados e congelados**
  (`AAAA-MM-<slug>.md`). Registram _como_ uma mudança foi feita, não regras vivas.

## Convenções

- **Idioma:** o `README.md` é em **inglês** (a cara pública do repositório); toda a
  documentação interna (`docs/`, `CONTRIBUTING.md`, `AGENTS.md`) é em **português**.
- **Fonte única da verdade:** cada regra vive em **um** lugar. `AGENTS.md` resume e
  aponta para os docs — não os reescreve. Ao mudar uma regra, mude-a na fonte.
- **Promoção de plano → arquitetura:** quando uma regra sobrevive a um plano específico,
  ela **migra** do `plans/` para `architecture.md` (ou `seo-i18n.md`); o plano vira
  histórico congelado. Não desduplique os planos — eles são um registro do passado.
