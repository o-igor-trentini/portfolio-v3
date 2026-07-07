import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useNowYM } from "./useNowYM";

describe("useNowYM", () => {
  afterEach(() => vi.useRealTimers());

  it("resolves to the current year and a 1-based month after mount", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-15T12:00:00Z"));

    const { result } = renderHook(() => useNowYM());

    // The mount effect flushes during render, so `now` is already filled in.
    expect(result.current).toEqual({ y: 2026, m: 7 });
  });
});
