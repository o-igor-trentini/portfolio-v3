# Analytics & privacidade — portfolio-v3

Como o tráfego é medido e como o consentimento (LGPD/GDPR) é tratado. Complementa
[`architecture.md`](./architecture.md) (convenções gerais).

## Google Analytics 4

O tráfego é medido com **Google Analytics 4**, carregado pelo componente oficial
[`<GoogleAnalytics>`](https://nextjs.org/docs/app/guides/third-party-libraries) do
`@next/third-parties` (`gtag.js`, `afterInteractive` — não bloqueia, então não afeta o LCP).
É montado em `components/layout/RootShell.tsx`, o shell único compartilhado pelos dois locales.

## Habilitando

O analytics **só renderiza quando `NEXT_PUBLIC_GA_ID` está setado** no build. Localmente,
adicione ao `.env.local`. Na CI, o valor vem de uma **repository variable**
(Settings → Secrets and variables → Actions → Variables → `NEXT_PUBLIC_GA_ID`), injetada no
passo de build de `.github/workflows/deploy.yml`. Sem ID, nada é injetado — builds locais e de
preview ficam **sem enviar dados**.

## Consentimento (LGPD / GDPR)

O analytics embarca **Consent Mode v2** com default `denied`, via um script inline que roda
antes do `gtag config`. Até o visitante aceitar, o GA envia apenas pings cookieless e **não**
seta cookies `_ga`. Um banner bilíngue (en / pt-BR) leve (`components/layout/ConsentBanner.tsx`)
permite aceitar ou recusar; a escolha persiste no `localStorage` (`pf_consent`) e, ao aceitar,
vira `granted`. A anonimização de IP é ligada por padrão no GA4.

## Eventos customizados

Um helper tipado (`lib/analytics.ts`, `track()`) envia um conjunto curado de eventos via
`sendGAEvent` — sem payloads `any`. Atualmente rastreados: `terminal_open`, `konami_unlocked`,
`terminal_command`, `theme_toggle`, `language_switch`, `contact_click`, `project_click`,
`show_more`. O tráfego é segmentado por locale automaticamente pelo path da página
(`/` = en, `/pt/` = pt-BR).
