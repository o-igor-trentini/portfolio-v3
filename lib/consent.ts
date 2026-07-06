/**
 * Consent Mode v2 helpers (pure, framework-free — see ConsentBanner for the UI).
 *
 * The default consent state is set to `denied` by an inline script in RootShell,
 * before gtag config runs. These helpers persist the visitor's choice and push
 * a `consent update` so GA switches between cookieless pings and full measurement.
 */

export type ConsentValue = "granted" | "denied";

const KEY = "pf_consent";

// `Window.dataLayer` is declared globally by @next/third-parties/google.

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
 * Push a Consent Mode v2 `update` to the dataLayer. gtag.js reads the pushed
 * command by index, so an array is equivalent to the `arguments` object the
 * gtag() shim would push.
 */
export function applyConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push([
    "consent",
    "update",
    {
      analytics_storage: value,
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
    },
  ]);
}
