import { describe, expect, it } from "vitest";
import { ogAlt, ogSize, ogContentType } from "./og";
import { i18n } from "./i18n";

describe("ogAlt", () => {
  it("uses the locale's seo title as the OG image alt text", () => {
    expect(ogAlt("en")).toBe(i18n.en.seo.title);
    expect(ogAlt("pt")).toBe(i18n.pt.seo.title);
  });
});

describe("og constants", () => {
  it("declares the standard 1200x630 PNG card", () => {
    expect(ogSize).toEqual({ width: 1200, height: 630 });
    expect(ogContentType).toBe("image/png");
  });
});
