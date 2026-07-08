/**
 * Site-wide configuration. These were component props in the original
 * Claude Design source (`accent`, `defaultTheme`); here they become
 * build-time constants that are easy to edit.
 */

import type { Lang } from "@/lib/i18n";

export type Accent = "green" | "blue" | "amber" | "violet" | "mono";
export type ThemePref = "dark" | "light" | "system";

/** Accent color per theme (d = dark, l = light). */
export const accentMap: Record<Accent, { d: string; l: string }> = {
  green: { d: "#4ade80", l: "#16a34a" },
  // Go / Golang brand blue ("Gopher Blue" #00ADD8) with its darker variant for light mode.
  blue: { d: "#00ADD8", l: "#007D9C" },
  amber: { d: "#fbbf24", l: "#d97706" },
  violet: { d: "#c084fc", l: "#7c3aed" },
  mono: { d: "#e4e4e7", l: "#3f3f46" },
};

/**
 * Page canvas (background) per theme — mirrors `--bg` in `app/globals.css`. The
 * single source for the web-manifest colors, the viewport `theme-color` meta and
 * the generated OG/icon backgrounds. (globals.css keeps its own literal because
 * CSS can't import from TS — keep the two in sync.)
 */
export const canvas = { dark: "#0c0c0e", light: "#fafaf9" } as const;

export const siteConfig = {
  name: "Igor Trentini",
  handle: "igor.trentini",
  /** Short role used in <title> / structured data. */
  roleShort: "Backend Developer",

  // Feature flags / theming
  accent: "blue" as Accent,
  defaultTheme: "dark" as ThemePref,

  /**
   * Per-locale résumé/CV path served from `public/`. Optional per language: a
   * missing entry hides the Contact download link and makes the terminal
   * `resume` command print the shared WIP line. Drop the matching PDFs in
   * `public/` (e.g. `public/resume.pdf`, `public/curriculo.pdf`) or edit the
   * paths below to your filenames.
   */
  resume: {
    en: "/resume.pdf",
    pt: "/curriculo.pdf",
  } as Partial<Record<Lang, string>>,

  /**
   * Canonical site URL — used for metadata, Open Graph, sitemap and canonical
   * links. Override with NEXT_PUBLIC_SITE_URL at build time, or edit here.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://igortrentini.dev",

  /**
   * Google Analytics 4 measurement ID (e.g. "G-XXXXXXX"). Provided at build
   * time via NEXT_PUBLIC_GA_ID. Intentionally has no fallback: when unset
   * (dev / local / preview) analytics is not rendered at all, so those visits
   * never pollute the data.
   */
  gaId: process.env.NEXT_PUBLIC_GA_ID,
};

// Start of professional experience ("YYYY-MM"). The bio's "N years" is derived
// from this and rounded to the nearest year, so no fixed number goes stale.
export const CAREER_START = "2021-09";

// Behavior constants (ported from the original component)
export const PAGE = 4; // projects/certs revealed per "show more"
export const ITEM_CAP = 8; // stack items shown before a group collapses
export const PROMPT = "visitor@portfolio:~$";
