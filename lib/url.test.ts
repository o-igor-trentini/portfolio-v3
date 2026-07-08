import { describe, expect, it } from "vitest";
import { isExternalHref } from "./url";

describe("isExternalHref", () => {
  it("treats http and https URLs as external", () => {
    expect(isExternalHref("http://example.com")).toBe(true);
    expect(isExternalHref("https://example.com")).toBe(true);
  });

  it("treats mailto and relative paths as not external", () => {
    expect(isExternalHref("mailto:me@example.com")).toBe(false);
    expect(isExternalHref("/resume.pdf")).toBe(false);
    expect(isExternalHref("#top")).toBe(false);
  });
});
