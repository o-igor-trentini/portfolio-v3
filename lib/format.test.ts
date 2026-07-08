import { describe, expect, it } from "vitest";
import { format } from "./format";

describe("format", () => {
  it("replaces a single token", () => {
    expect(format("show {n} more", { n: 3 })).toBe("show 3 more");
  });

  it("replaces every occurrence of a token", () => {
    expect(format("{x} and {x}", { x: "a" })).toBe("a and a");
  });

  it("replaces multiple distinct tokens and stringifies values", () => {
    expect(format("{a}-{b}", { a: 1, b: "z" })).toBe("1-z");
  });

  it("leaves unknown tokens untouched", () => {
    expect(format("{a} {b}", { a: "x" })).toBe("x {b}");
  });
});
