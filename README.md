# portfolio-v3

Terminal-themed personal portfolio for **Igor Trentini — Backend Developer (Go)**.

Built with **Next.js (App Router) + React + TypeScript**, chosen for SEO: the page
is statically pre-rendered so crawlers receive the full HTML (content, projects,
certs) plus metadata and JSON-LD structured data. It was implemented from a
Claude Design source component (`Portfolio.dc.html`).

## Features

- Dark / light theme with no flash on load (pre-hydration inline script), persisted to `localStorage`
- English / Portuguese (`en` / `pt`) selected by **URL** — English at `/`, Portuguese
  at `/pt/`; each locale is its own statically-exported page, so switching language is
  navigation (a full reload), and crawlers index exactly what users see
- Sections: hero, about, experience, languages, stack, projects, certifications, contact
- Interactive terminal modal — open with the **`` ` ``** key, the "open terminal"
  button, or the Konami code; close with **Esc**. Commands: `help`, `about`, `whoami`,
  `experience`, `skills`, `languages`, `projects`, `certs`, `contact`, `theme`, `lang`,
  `neofetch`, `ls`, `clear`, `exit`, and a few easter eggs. Focus is trapped while open
  and restored to the trigger on close.
- Accessibility: skip-to-content link, keyboard focus ring, a custom `404` page
- SEO: per-page `<title>`/description, Open Graph, Twitter card, `sitemap.xml`,
  `robots.txt`, `Person` + `ProfilePage` JSON-LD

## Getting started

```bash
npm run dev            # dev server at http://localhost:3000
npm run build          # production static export → out/
npm run start          # serve the production build
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
npm test               # vitest run
npm run test:coverage  # vitest with coverage report
npm run format         # prettier --write .
```

A husky pre-commit hook runs `lint-staged` (eslint --fix + prettier) on staged files.

## Project layout

English lives at `/` and Portuguese at `/pt/` via route groups, each with its own root
layout — the only way to get English at the root with a correct `<html lang>` under
`output: export`. `RootShell` is the real shared shell.

```
app/
  (en)/layout.tsx (page.tsx)   English root layout + page → <Portfolio initialLang="en"/>
  (pt)/pt/layout.tsx (page.tsx)  Portuguese mirror at /pt/
  globals.css                  theme-reactive color tokens, resets, keyframes, utilities
  tokens.css                   theme-agnostic sizing / spacing / motion tokens
  sitemap.ts robots.ts manifest.ts icon.tsx apple-icon.tsx
  global-not-found.tsx         custom 404 (emitted as out/404.html)
components/
  layout/       RootShell, Portfolio, Header, Footer, Terminal, ConsentBanner
  sections/     Hero, About, Experience, Languages, Stack, Projects, Certs, Contact
  providers/    PortfolioProvider (theme, language, terminal, global shortcuts)
  ui/           reusable presentational primitives (Button, Card, Section, …) + contract tests
hooks/          useTheme, useLang, useTerminal(+Buffer), usePagination, useFocusTrap, useNowYM
lib/
  content.ts    stack, projects, certs, languages, contacts (+ i18n helpers)
  i18n.ts       en / pt dictionary          seo.ts / og.tsx   metadata, JSON-LD, OG image
  terminal.ts   command registry            analytics.ts / consent.ts / date.ts / cx.ts
site.config.ts  name, accent, default theme, canonical URL, behavior constants
```

## Configuration

Edit `site.config.ts`:

- `accent` — `green | blue | amber | violet | mono`
- `defaultTheme` — `dark | light | system`
- `url` — canonical site URL (or set `NEXT_PUBLIC_SITE_URL` at build time)

### Environment variables

Copy the template and fill in what you need for local development (optional — every
variable has a safe default):

```bash
cp .env.example .env.local
```

All variables are `NEXT_PUBLIC_*`, read at build time and inlined into the static
export. None are secrets.

| Variable               | Required | Description                                                                                                                                                                                 |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | Canonical site URL. Defaults to the `url` in `site.config.ts`.                                                                                                                              |
| `NEXT_PUBLIC_GA_ID`    | No       | Google Analytics 4 measurement ID (`G-XXXXXXX`). When unset, no analytics script is rendered — so dev/local/preview builds never send data. See [Analytics & privacy](#analytics--privacy). |

## Analytics & privacy

Traffic is measured with **Google Analytics 4**, loaded through the official
[`@next/third-parties`](https://nextjs.org/docs/app/guides/third-party-libraries)
`<GoogleAnalytics>` component (`gtag.js`, `afterInteractive` — non-blocking, so it
doesn't affect LCP). It's wired up in `components/layout/RootShell.tsx`, the single
shell shared by both locales.

**Enabling it.** Analytics only renders when `NEXT_PUBLIC_GA_ID` is set at build
time. Locally, add it to `.env.local`. In CI it comes from a **repository variable**
(Settings → Secrets and variables → Actions → Variables → `NEXT_PUBLIC_GA_ID`),
injected in the build step of `.github/workflows/deploy.yml`. With no ID, nothing is
injected — local and preview builds stay data-free.

**Consent (LGPD / GDPR).** Analytics ships with **Consent Mode v2** defaulted to
`denied` via an inline script that runs before the `gtag` config. Until the visitor
accepts, GA sends only cookieless pings and sets **no** `_ga` cookies. A lightweight
bilingual (en / pt-BR) banner (`components/layout/ConsentBanner.tsx`) lets them
accept or decline; the choice persists in `localStorage` (`pf_consent`) and, on
accept, flips consent to `granted`. IP anonymization is on by default in GA4.

**Custom events.** A small typed helper (`lib/analytics.ts`, `track()`) sends a
curated set of events via `sendGAEvent` — no `any` payloads. Currently tracked:
`terminal_open`, `konami_unlocked`, `terminal_command`, `theme_toggle`,
`language_switch`, `contact_click`, `project_click`, `show_more`. Traffic is
segmented by locale automatically through the page path (`/` = en, `/pt/` = pt-BR).
