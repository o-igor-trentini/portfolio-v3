import { describe, expect, it } from "vitest";
import { languageAlternates, locales } from "./locale";
import type { Lang } from "./i18n";

const LANGS = Object.keys(locales) as Lang[];

// hreflang/canonical correctness hinges on `languageAlternates` staying
// reciprocal with `locales` — the module documents this as load-bearing, so it
// gets a direct test rather than being covered only indirectly by seo.test.
describe("locales / languageAlternates", () => {
  it("exposes an hreflang entry pointing at each locale's own path", () => {
    for (const lang of LANGS) {
      const { htmlLang, path } = locales[lang];
      expect(languageAlternates[htmlLang]).toBe(path);
    }
  });

  it("points x-default at the English root", () => {
    expect(languageAlternates["x-default"]).toBe(locales.en.path);
  });

  it("has no alternate key that isn't backed by a locale (besides x-default)", () => {
    const known = new Set(LANGS.map((l) => locales[l].htmlLang));
    for (const key of Object.keys(languageAlternates)) {
      if (key === "x-default") continue;
      expect(known.has(key)).toBe(true);
    }
  });

  it("gives each locale a distinct path and htmlLang", () => {
    const paths = LANGS.map((l) => locales[l].path);
    const tags = LANGS.map((l) => locales[l].htmlLang);
    expect(new Set(paths).size).toBe(paths.length);
    expect(new Set(tags).size).toBe(tags.length);
  });
});
