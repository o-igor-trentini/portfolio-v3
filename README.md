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

## ⚠️ Placeholders to replace before going live

These came from the design and are **not real values yet**:

- **`lib/content.ts` → `contacts`**: `hello@example.com`, `github.com/your-handle`,
  `linkedin.com/in/your-handle` — replace with your real email / profiles.
  (These also feed the `sameAs` field of the JSON-LD.)
- **`lib/content.ts` → `projects`**: every `link` is `"#"` — point them at real repos/demos.
- **`lib/content.ts` → `certs`**: every `link` is `"#"` — point them at real credential URLs.
- **`site.config.ts` → `url`**: `https://igortrentini.dev` is a placeholder domain.
- Add an Open Graph image (e.g. `app/opengraph-image.png`) — the Twitter card is
  set to `summary_large_image` but no image is provided yet.
