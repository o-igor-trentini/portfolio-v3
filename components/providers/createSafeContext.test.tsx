import { render, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { createSafeContext } from "./createSafeContext";

describe("createSafeContext", () => {
  it("throws a helpful, named error when the hook runs outside its provider", () => {
    const [, useThing] = createSafeContext<number>("useThing", "ThingProvider");
    // Silence React's expected error-boundary console noise for this render.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Outside() {
      useThing();
      return null;
    }
    expect(() => render(<Outside />)).toThrow("useThing must be used within <ThingProvider>");
    spy.mockRestore();
  });

  it("returns the provided value when read inside its provider", () => {
    const [Ctx, useThing] = createSafeContext<number>("useThing", "ThingProvider");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Ctx.Provider value={42}>{children}</Ctx.Provider>
    );
    const { result } = renderHook(() => useThing(), { wrapper });
    expect(result.current).toBe(42);
  });
});
