import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePagination } from "./usePagination";

const items = ["a", "b", "c", "d", "e", "f"]; // 6 items
const PAGE = 4;

describe("usePagination", () => {
  it("shows the first page and reports what remains", () => {
    const { result } = renderHook(() => usePagination(items, PAGE));

    expect(result.current.shown).toEqual(["a", "b", "c", "d"]);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.remaining).toBe(2);
    expect(result.current.canCollapse).toBe(false);
  });

  it("reveals another page on showMore and clamps at the end", () => {
    const { result } = renderHook(() => usePagination(items, PAGE));

    act(() => result.current.showMore());

    expect(result.current.shown).toEqual(items);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.remaining).toBe(0);
    expect(result.current.canCollapse).toBe(true);
  });

  it("collapses back to the first page", () => {
    const { result } = renderHook(() => usePagination(items, PAGE));

    act(() => result.current.showMore());
    act(() => result.current.collapse());

    expect(result.current.shown).toEqual(["a", "b", "c", "d"]);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.canCollapse).toBe(false);
  });

  it("handles a list shorter than one page", () => {
    const { result } = renderHook(() => usePagination(["a", "b"], PAGE));

    expect(result.current.shown).toEqual(["a", "b"]);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.remaining).toBe(0);
    expect(result.current.canCollapse).toBe(false);
  });

  it("handles an empty list", () => {
    const { result } = renderHook(() => usePagination([], PAGE));

    expect(result.current.shown).toEqual([]);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.remaining).toBe(0);
    expect(result.current.canCollapse).toBe(false);
  });
});
