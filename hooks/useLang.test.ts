import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLang } from "./useLang";

const assign = vi.fn();
const originalLocation = window.location;

beforeEach(() => {
  assign.mockClear();
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { assign, hash: "" },
  });
});

afterEach(() => {
  Object.defineProperty(window, "location", { configurable: true, value: originalLocation });
});

describe("useLang", () => {
  it("returns the URL-derived locale unchanged", () => {
    expect(renderHook(() => useLang("pt")).result.current.lang).toBe("pt");
    expect(renderHook(() => useLang("en")).result.current.lang).toBe("en");
  });

  it("setLang navigates to the other locale, carrying the current hash", () => {
    window.location.hash = "#projects";
    const { result } = renderHook(() => useLang("en"));

    result.current.setLang("pt");

    expect(assign).toHaveBeenCalledWith("/pt/#projects");
  });

  it("setLang to the current locale is a no-op", () => {
    const { result } = renderHook(() => useLang("en"));

    result.current.setLang("en");

    expect(assign).not.toHaveBeenCalled();
  });
});
