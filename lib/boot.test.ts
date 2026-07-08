import { afterEach, describe, expect, it, vi } from "vitest";
import { buildThemeScript, consentDefaultScript, themeFallback } from "./boot";
import type { ThemePref } from "@/site.config";

// Execute the inline anti-flash IIFE in the jsdom global scope (indirect eval),
// then read back what it wrote to <html data-theme>.
function runThemeScript(pref: ThemePref): string | undefined {
  (0, eval)(buildThemeScript(pref));
  return document.documentElement.dataset.theme;
}

// The script guards on `window.matchMedia`, which jsdom doesn't implement, so we
// stub it. `null` means "no matchMedia support at all".
function stubPrefersColorScheme(prefersLight: boolean | null) {
  if (prefersLight === null) {
    vi.stubGlobal("matchMedia", undefined);
    return;
  }
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: prefersLight && query.includes("light"),
    media: query,
  }));
}

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("themeFallback", () => {
  it("keeps an explicit light preference", () => {
    expect(themeFallback("light")).toBe("light");
  });

  it("collapses dark and system to dark (no server-known system value)", () => {
    expect(themeFallback("dark")).toBe("dark");
    expect(themeFallback("system")).toBe("dark");
  });
});

describe("buildThemeScript", () => {
  it("honors a stored choice over everything else", () => {
    localStorage.setItem("pf_theme", "light");
    stubPrefersColorScheme(false); // system says dark…
    expect(runThemeScript("dark")).toBe("light"); // …but the stored choice wins
  });

  it("uses the configured default when nothing is stored", () => {
    stubPrefersColorScheme(false);
    expect(runThemeScript("light")).toBe("light");
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    expect(runThemeScript("dark")).toBe("dark");
  });

  it("falls back to the OS preference for the system default", () => {
    stubPrefersColorScheme(true);
    expect(runThemeScript("system")).toBe("light");
  });

  it("defaults system to dark when the OS prefers dark or matchMedia is missing", () => {
    stubPrefersColorScheme(false);
    expect(runThemeScript("system")).toBe("dark");
    delete document.documentElement.dataset.theme;
    stubPrefersColorScheme(null);
    expect(runThemeScript("system")).toBe("dark");
  });

  it("falls back safely when storage access throws", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });
    expect(runThemeScript("light")).toBe("light"); // themeFallback('light')
    delete document.documentElement.dataset.theme;
    expect(runThemeScript("system")).toBe("dark"); // themeFallback('system')
  });
});

describe("consentDefaultScript", () => {
  it("denies every storage bucket by default", () => {
    for (const bucket of [
      "ad_storage",
      "analytics_storage",
      "ad_user_data",
      "ad_personalization",
    ]) {
      expect(consentDefaultScript).toContain(`${bucket}:'denied'`);
    }
  });

  it("defines gtag and seeds the dataLayer before granting anything", () => {
    expect(consentDefaultScript).toContain("window.dataLayer=window.dataLayer||[]");
    expect(consentDefaultScript).toContain("function gtag()");
    expect(consentDefaultScript).not.toContain("granted");
  });
});
