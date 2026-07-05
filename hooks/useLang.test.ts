import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useLang } from "./useLang";

afterEach(() => localStorage.clear());

describe("useLang", () => {
  it("reads a stored language on mount", () => {
    localStorage.setItem("pf_lang", "pt");
    const { result } = renderHook(() => useLang());
    expect(result.current.lang).toBe("pt");
  });

  it("setLang updates the language and persists it", () => {
    const { result } = renderHook(() => useLang());

    act(() => result.current.setLang("pt"));

    expect(result.current.lang).toBe("pt");
    expect(localStorage.getItem("pf_lang")).toBe("pt");
  });
});
