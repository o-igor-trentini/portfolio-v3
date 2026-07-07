/**
 * Consent Mode v2 helpers (pure, framework-free — see ConsentBanner for the UI).
 *
 * The default consent state is set to `denied` by an inline script in RootShell,
 * before gtag config runs. These helpers persist the visitor's choice and push
 * a `consent update` so GA switches between cookieless pings and full measurement.
 */

export type ConsentValue = "granted" | "denied";

const KEY = "pf_consent";

// `Window.dataLayer` is declared globally by @next/third-parties/google. `gtag`
// is the shim installed by the inline consent-default script in RootShell
// (`function gtag(){dataLayer.push(arguments)}`), so it exists whenever GA does.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Read the stored decision, or `null` if the visitor hasn't chosen yet. */
export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** Persist the visitor's decision. */
export function storeConsent(value: ConsentValue): void {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* ignore — storage may be unavailable (private mode, blocked) */
  }
}

/**
 * Push a Consent Mode v2 `update` through the `gtag()` shim. This MUST go
 * through gtag(), not `dataLayer.push([...])`: gtag.js only recognises consent
 * commands pushed as the `arguments` object the shim produces, and silently
 * ignores array-form pushes (verified in production — an array push left
 * `gcs=G100`/denied, while gtag() flipped it to `gcs=G111`/granted).
 */
export function applyConsent(value: ConsentValue): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}
