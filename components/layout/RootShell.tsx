import type { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@/app/globals.css";
import { accentMap, siteConfig } from "@/site.config";
import { buildJsonLd } from "@/lib/seo";
import { buildAccentCss, buildThemeScript, consentDefaultScript, themeFallback } from "@/lib/boot";
import { locales } from "@/lib/locale";
import type { Lang } from "@/lib/i18n";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Accent color is a build-time constant; emit it for both themes so the CSS
// custom property is available before any JS runs.
const accentCss = buildAccentCss(accentMap[siteConfig.accent]);

// Set data-theme before first paint to avoid a flash of the wrong theme.
const pref = siteConfig.defaultTheme;
const fallback = themeFallback(pref);
const themeScript = buildThemeScript(pref);

// GA is only wired up when a measurement ID is present (prod builds).
const gaId = siteConfig.gaId;

/**
 * The single HTML shell shared by both per-locale root layouts. Each route group
 * ((en) → `/`, (pt) → `/pt/`) renders its own copy at build time, so `lang` and
 * the JSON-LD are baked correctly into each static HTML file.
 */
export function RootShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  const jsonLd = buildJsonLd(lang);
  return (
    <html
      lang={locales[lang].htmlLang}
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
        {gaId && <script dangerouslySetInnerHTML={{ __html: consentDefaultScript }} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
