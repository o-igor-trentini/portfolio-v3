import { describe, expect, it } from "vitest";
import { NAV_ITEMS } from "./nav";
import { i18n } from "./i18n";

// The header renders NAV_ITEMS via `t.nav[item.label]`, so a label that isn't a
// real `nav` key would render blank at runtime. Catch that dangling key here.
describe("NAV_ITEMS", () => {
  it("maps every item to a real nav label in both locales", () => {
    for (const { label } of NAV_ITEMS) {
      expect(i18n.en.nav[label]).toBeTruthy();
      expect(i18n.pt.nav[label]).toBeTruthy();
    }
  });

  it("has unique section ids", () => {
    const ids = NAV_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
