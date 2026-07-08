import type { Lang } from "./i18n";

export interface LocaleMeta {
  /** Canonical path — English at the root, Portuguese under `/pt/`. */
  path: string;
  /** BCP-47 tag for `<html lang>` and the hreflang cluster. */
  htmlLang: string;
  /** Open Graph locale (e.g. `en_US`). */
  ogLocale: string;
}

/**
 * Single source of truth for per-locale routing/SEO metadata. These values are
 * load-bearing for hreflang/canonical correctness and must stay reciprocal, so
 * everything (`buildMetadata`, the sitemap, `RootShell`'s `<html lang>`, the
 * language toggle and `useLang`'s navigation) derives from here rather than
 * re-declaring the mapping.
 */
export const locales: Record<Lang, LocaleMeta> = {
  en: { path: "/", htmlLang: "en", ogLocale: "en_US" },
  pt: { path: "/pt/", htmlLang: "pt-BR", ogLocale: "pt_BR" },
};

/**
 * Reciprocal hreflang cluster keyed by BCP-47 tag, with English as `x-default`.
 * Same cluster on every page — Google requires the alternates to be reciprocal.
 */
export const languageAlternates: Record<string, string> = {
  [locales.en.htmlLang]: locales.en.path,
  [locales.pt.htmlLang]: locales.pt.path,
  "x-default": locales.en.path,
};
