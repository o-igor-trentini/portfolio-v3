import { sendGAEvent } from "@next/third-parties/google";
import { siteConfig } from "@/site.config";
import type { Lang } from "@/lib/i18n";

/** Where a terminal-open originated, so we can tell easter-egg paths apart. */
export type TerminalSource = "hero" | "footer" | "key" | "konami";

/**
 * The full set of custom analytics events. A discriminated union keeps event
 * names and their parameters in lockstep — the call sites can't drift, and
 * there's no untyped `any` payload reaching GA.
 */
export type AnalyticsEvent =
  | { name: "terminal_open"; params: { source: TerminalSource } }
  | { name: "konami_unlocked" }
  | { name: "terminal_command"; params: { command: string } }
  | { name: "theme_toggle"; params: { to: "light" | "dark" } }
  | { name: "language_switch"; params: { to: Lang } }
  | { name: "contact_click"; params: { label: string } }
  | { name: "contact_copy"; params: { label: string } }
  | { name: "project_click"; params: { name: string } }
  | { name: "show_more"; params: { section: string } };

/**
 * Send a custom event to GA4 via the official `sendGAEvent` helper (pushes to
 * the same `dataLayer` that <GoogleAnalytics> initialises). No-ops when no
 * measurement ID is configured, so dev/local builds neither send data nor log
 * "GA not initialised" warnings.
 */
export function track(event: AnalyticsEvent): void {
  if (!siteConfig.gaId) return;
  const params = "params" in event ? event.params : {};
  sendGAEvent("event", event.name, params);
}

/**
 * Single source of truth for the language-switch event. Both entry points fire
 * it — the header's `<a href>` locale links (kept as real anchors for hreflang
 * crawlability) and the terminal's `lang` command (programmatic navigation) —
 * so centralising the event name/params here keeps them from drifting apart.
 */
export const trackLanguageSwitch = (to: Lang): void =>
  track({ name: "language_switch", params: { to } });
