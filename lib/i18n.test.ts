import { describe, expect, it } from "vitest";
import { defaultLang, i18n, type Lang } from "./i18n";

// Collect every leaf key path in an object as dotted strings ("nav.about",
// "seo.title", …). The Dict is a fixed depth of nested string records, so a
// simple recursive walk is enough to compare the two locale trees structurally.
function keyPaths(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    keyPaths(v, prefix ? `${prefix}.${k}` : k),
  );
}

// Collect every leaf value paired with its path, for non-empty assertions.
function leafEntries(obj: unknown, prefix = ""): Array<[string, unknown]> {
  if (obj === null || typeof obj !== "object") return [[prefix, obj]];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    leafEntries(v, prefix ? `${prefix}.${k}` : k),
  );
}

const langs: Lang[] = ["en", "pt"];

describe("i18n dictionary parity", () => {
  it("en and pt expose the exact same set of keys", () => {
    const en = keyPaths(i18n.en).sort();
    const pt = keyPaths(i18n.pt).sort();
    // Symmetric diff pinpoints a missing/extra translation key by its path.
    const onlyInEn = en.filter((k) => !pt.includes(k));
    const onlyInPt = pt.filter((k) => !en.includes(k));
    expect(onlyInEn, "keys present only in en").toEqual([]);
    expect(onlyInPt, "keys present only in pt").toEqual([]);
    expect(en).toEqual(pt);
  });

  it("every locale value is a non-empty string", () => {
    for (const lang of langs) {
      for (const [path, value] of leafEntries(i18n[lang])) {
        expect(typeof value, `${lang}.${path} should be a string`).toBe("string");
        expect((value as string).trim(), `${lang}.${path} should not be empty`).not.toBe("");
      }
    }
  });
});

describe("defaultLang", () => {
  it("resolves deterministically to en (SSR-safe)", () => {
    expect(defaultLang()).toBe("en");
  });
});
