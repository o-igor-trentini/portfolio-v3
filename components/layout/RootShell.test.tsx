import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Lang } from "@/lib/i18n";

// next/font and the GA component need lightweight stand-ins; the GA mock exposes
// a marker attribute so we can assert whether analytics was wired up. RootShell
// emits a full <html> document, so we render it to static markup (jsdom drops the
// <html>/<head> wrappers when a component is mounted inside a container div).
vi.mock("next/font/google", () => ({
  JetBrains_Mono: () => ({ variable: "font-mono", className: "font-mono" }),
}));
vi.mock("@next/third-parties/google", () => ({
  GoogleAnalytics: ({ gaId }: { gaId: string }) => <div data-ga-id={gaId} />,
}));

/**
 * Render RootShell to an HTML string with `siteConfig.gaId` set (or not) — the
 * shell reads it at module load, so each analytics-state case needs a fresh
 * module graph.
 */
async function renderShell(gaId: string | undefined, lang: Lang = "en"): Promise<string> {
  vi.resetModules();
  vi.doMock("@/site.config", async () => {
    const actual = await vi.importActual<typeof import("@/site.config")>("@/site.config");
    return { ...actual, siteConfig: { ...actual.siteConfig, gaId } };
  });
  const { RootShell } = await import("./RootShell");
  return renderToStaticMarkup(
    <RootShell lang={lang}>
      <div>child</div>
    </RootShell>,
  );
}

afterEach(() => {
  vi.doUnmock("@/site.config");
});

describe("RootShell", () => {
  it("emits the JSON-LD @graph with the person and website nodes for each locale", async () => {
    for (const lang of ["en", "pt"] as const) {
      const html = await renderShell("G-TEST123", lang);
      expect(html).toContain('type="application/ld+json"');
      expect(html).toContain("#person");
      expect(html).toContain("#website");
    }
  });

  it("sets <html lang> from the locale metadata", async () => {
    expect(await renderShell("G-X", "en")).toContain('lang="en"');
    expect(await renderShell("G-X", "pt")).toContain('lang="pt-BR"');
  });

  it("wires up GA and the consent-default script only when a gaId is configured", async () => {
    const html = await renderShell("G-TEST123");
    expect(html).toContain('data-ga-id="G-TEST123"');
    // The consent-default script denies buckets before any grant — its presence
    // is the tell that consent mode was seeded.
    expect(html).toContain("analytics_storage:'denied'");
  });

  it("renders neither GA nor the consent-default script without a gaId", async () => {
    const html = await renderShell(undefined);
    expect(html).not.toContain("data-ga-id");
    expect(html).not.toContain("analytics_storage");
  });
});
