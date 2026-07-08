import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { siteConfig } from "@/site.config";
import { lastUpdated } from "@/lib/content";
import { locales } from "@/lib/locale";

describe("sitemap", () => {
  const entries = sitemap();
  const abs = (p: string) => new URL(p, siteConfig.url).toString();

  it("emits both locale URLs, English first at higher priority", () => {
    expect(entries.map((e) => e.url)).toEqual([abs(locales.en.path), abs(locales.pt.path)]);
    expect(entries[0].priority).toBe(1);
    expect(entries[1].priority).toBeLessThan(entries[0].priority as number);
  });

  it("stamps every entry with the derived lastModified", () => {
    for (const e of entries) expect(e.lastModified).toBe(lastUpdated);
  });

  it("carries the reciprocal hreflang cluster (en / pt-BR / x-default) on each entry", () => {
    const expected = {
      [locales.en.htmlLang]: abs(locales.en.path),
      [locales.pt.htmlLang]: abs(locales.pt.path),
      "x-default": abs(locales.en.path),
    };
    for (const e of entries) expect(e.alternates?.languages).toEqual(expected);
  });
});
