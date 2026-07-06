import type { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";
import { accentMap, siteConfig } from "@/site.config";
import { buildJsonLd } from "@/lib/seo";
import type { Lang } from "@/lib/i18n";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Accent color is a build-time constant; emit it for both themes so the CSS
// custom property is available before any JS runs.
const accent = accentMap[siteConfig.accent];
const accentCss = `:root{--accent:${accent.d}}html[data-theme="light"]{--accent:${accent.l}}`;

// Set data-theme before first paint to avoid a flash of the wrong theme.
const pref = siteConfig.defaultTheme;
const fallback = pref === "light" ? "light" : "dark";
const themeScript = `!function(){try{var d=document.documentElement,s=localStorage.getItem('pf_theme'),t;if(s==='light'||s==='dark'){t=s}else{var p='${pref}';if(p==='light'||p==='dark'){t=p}else if(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches){t='light'}else{t='dark'}}d.dataset.theme=t}catch(e){document.documentElement.dataset.theme='${fallback}'}}();`;

/**
 * The single HTML shell shared by both per-locale root layouts. Each route group
 * ((en) → `/`, (pt) → `/pt/`) renders its own copy at build time, so `lang` and
 * the JSON-LD are baked correctly into each static HTML file.
 */
export function RootShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  const jsonLd = buildJsonLd(lang);
  return (
    <html
      lang={lang === "pt" ? "pt-BR" : "en"}
      data-theme={fallback}
      suppressHydrationWarning
      className={jetbrainsMono.variable}
    >
      {/* Valid App Router root-layout <head>; the rule only fires because this
          lives in a shared component rather than a layout file. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <style dangerouslySetInnerHTML={{ __html: accentCss }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
