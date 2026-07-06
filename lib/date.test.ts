import { afterEach, describe, expect, it, vi } from "vitest";
import { nowYM, yearsOfExperience } from "./date";

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

describe("yearsOfExperience", () => {
  it("rounds up once past the half-year mark", () => {
    // Sep 2021 → Jul 2026 is ~4 yrs 11 mos, which rounds to 5.
    expect(yearsOfExperience("2021-09", { y: 2026, m: 7 })).toBe(5);
  });

  it("rounds down below the half-year mark", () => {
    // Sep 2021 → Jan 2025 is ~3 yrs 5 mos, which rounds to 3.
    expect(yearsOfExperience("2021-09", { y: 2025, m: 1 })).toBe(3);
  });

  it("rounds a half year to the nearest (up)", () => {
    // Jan 2022 → Jun 2026 inclusive = 54 months = exactly 4.5 years → 5.
    expect(yearsOfExperience("2022-01", { y: 2026, m: 6 })).toBe(5);
  });

  it("treats a just-started career as zero whole years", () => {
    expect(yearsOfExperience("2026-07", { y: 2026, m: 7 })).toBe(0);
  });
});
