import type { ThemePref } from "@/site.config";

/**
 * The concrete theme applied before JS runs and whenever theme detection throws
 * — `system` has no server-known value, so it degrades to dark.
 */
export function themeFallback(pref: ThemePref): "light" | "dark" {
  return pref === "light" ? "light" : "dark";
}

/**
 * Self-contained IIFE (as a string) that sets `data-theme` on <html> before the
 * first paint, avoiding a flash of the wrong theme. Resolution order: stored
 * choice (`pf_theme`) → configured default → OS `prefers-color-scheme` → dark.
 * Any error falls back to `themeFallback(pref)`. Kept as an inline string because
 * it must run before hydration, so it can't import anything at runtime.
 */
export function buildThemeScript(pref: ThemePref): string {
  const fallback = themeFallback(pref);
  return `!function(){try{var d=document.documentElement,s=localStorage.getItem('pf_theme'),t;if(s==='light'||s==='dark'){t=s}else{var p='${pref}';if(p==='light'||p==='dark'){t=p}else if(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches){t='light'}else{t='dark'}}d.dataset.theme=t}catch(e){document.documentElement.dataset.theme='${fallback}'}}();`;
}

/**
 * Consent Mode v2 defaults: deny every storage *before* the gtag config command
 * runs (config is injected afterInteractive by <GoogleAnalytics>), so GA sends
 * cookieless pings until the visitor accepts in ConsentBanner, which flips the
 * relevant grants to `granted`.
 */
export const consentDefaultScript =
  `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
  `gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`;
