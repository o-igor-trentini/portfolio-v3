import { describe, expect, it } from "vitest";
import { cx } from "./cx";

describe("cx", () => {
  it("joins truthy class names with a single space", () => {
    expect(cx("a", "b", "c")).toBe("a b c");
  });

  it("drops false, null and undefined entries", () => {
    expect(cx("a", false, null, undefined, "b")).toBe("a b");
  });

  it("keeps only the surviving class when a conditional short-circuits", () => {
    const active = false;
    expect(cx("base", active && "base--active")).toBe("base");
  });

  it("returns an empty string when nothing survives", () => {
    expect(cx(false, null, undefined)).toBe("");
  });
});
