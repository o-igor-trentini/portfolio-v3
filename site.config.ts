/**
 * Site-wide configuration. These were component props in the original
 * Claude Design source (`accent`, `defaultTheme`, `showProjects`, `showCerts`);
 * here they become build-time constants that are easy to edit.
 */

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

export const siteConfig = {
  name: "Igor Trentini",
  handle: "igor.trentini",
  /** Short role used in <title> / structured data. */
  roleShort: "Backend Developer",

  // Feature flags / theming
  accent: "blue" as Accent,
  defaultTheme: "dark" as ThemePref,
  showProjects: true,
  showCerts: true,

  /**
   * Canonical site URL — used for metadata, Open Graph, sitemap and canonical
   * links. Override with NEXT_PUBLIC_SITE_URL at build time, or edit here.
   * TODO: replace the fallback with your real production domain.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://igortrentini.dev",
};

// Behavior constants (ported from the original component)
export const PAGE = 4; // projects/certs revealed per "show more"
export const ITEM_CAP = 8; // stack items shown before a group collapses
export const PROMPT = "visitor@portfolio:~$";
