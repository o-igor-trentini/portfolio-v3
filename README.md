# portfolio-v3

Terminal-themed personal portfolio for **Igor Trentini — Backend Developer (Go)**.

Built with **Next.js (App Router) + React + TypeScript**, chosen for SEO: the page
is statically pre-rendered so crawlers receive the full HTML (content, projects,
certs) plus metadata and JSON-LD structured data. It was implemented from a
Claude Design source component (`Portfolio.dc.html`).

## Features

- Dark / light theme with no flash on load (pre-hydration inline script), persisted to `localStorage`
- English / Portuguese (`en` / `pt`), persisted and auto-detected from the browser
- Sections: hero, about, languages, stack, projects, certifications, contact
- Interactive terminal modal — open with the **`` ` ``** key, the "open terminal"
  button, or the Konami code. Commands: `help`, `about`, `whoami`, `skills`,
  `projects`, `certs`, `contact`, `theme`, `lang`, `neofetch`, `ls`, `clear`,
  `exit`, and a few easter eggs.
- SEO: per-page `<title>`/description, Open Graph, Twitter card, `sitemap.xml`,
  `robots.txt`, `Person` JSON-LD.

## Getting started

```bash
npm run dev     # dev server at http://localhost:3000
npm run build   # production build (all routes prerender statically)
npm run start   # serve the production build
npm run lint    # eslint
```

## Project layout

```
app/
  layout.tsx        metadata, fonts, theme-init script, accent CSS, JSON-LD
  page.tsx          renders <Portfolio/>
  globals.css       design system (CSS custom properties, theming, all component styles)
  sitemap.ts        robots.ts
components/
  PortfolioProvider.tsx   client state: theme, language, terminal, global shortcuts
  Portfolio.tsx           page composition
  Header.tsx  Footer.tsx  Terminal.tsx  Icons.tsx
  sections/               Hero, About, Languages, Stack, Projects, Certs, Contact
lib/
  content.ts        stack, projects, certs, languages, contacts (+ i18n helpers)
  i18n.ts           en / pt dictionary
site.config.ts      name, accent, default theme, feature flags, canonical URL
```

## Configuration

Edit `site.config.ts`:

- `accent` — `green | blue | amber | violet | mono`
- `defaultTheme` — `dark | light | system`
- `showProjects`, `showCerts` — toggle whole sections
- `url` — canonical site URL (or set `NEXT_PUBLIC_SITE_URL` at build time)

### Environment variables

Copy the template and fill in what you need for local development (optional — every
variable has a safe default):

```bash
cp .env.example .env.local
```

All variables are `NEXT_PUBLIC_*`, read at build time and inlined into the static
export. None are secrets.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL. Defaults to the `url` in `site.config.ts`. |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4 measurement ID (`G-XXXXXXX`). When unset, no analytics script is rendered — so dev/local/preview builds never send data. See [Analytics & privacy](#analytics--privacy). |

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
