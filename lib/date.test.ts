import { afterEach, describe, expect, it, vi } from "vitest";
import { nowYM } from "./date";

describe("nowYM", () => {
  afterEach(() => vi.useRealTimers());

  it("returns the current year and a 1-based month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-15T12:00:00Z"));
    expect(nowYM()).toEqual({ y: 2026, m: 7 });
  });

  it("maps January to month 1 (not the Date 0-based month)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
    expect(nowYM()).toEqual({ y: 2026, m: 1 });
  });
});
