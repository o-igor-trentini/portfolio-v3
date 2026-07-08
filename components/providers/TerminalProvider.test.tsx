import { render, renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { TerminalProvider, useTerminalControls } from "./TerminalProvider";

const wrapper = ({ children }: { children: ReactNode }) => (
  <TerminalProvider>{children}</TerminalProvider>
);

describe("useTerminalControls", () => {
  it("throws when used outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Outside() {
      useTerminalControls();
      return null;
    }
    expect(() => render(<Outside />)).toThrow(/within <TerminalProvider>/);
    spy.mockRestore();
  });

  it("opens and closes the terminal via its callbacks", () => {
    const { result } = renderHook(() => useTerminalControls(), { wrapper });
    expect(result.current.termOpen).toBe(false);

    act(() => result.current.openTerm("hero"));
    expect(result.current.termOpen).toBe(true);

    act(() => result.current.closeTerm());
    expect(result.current.termOpen).toBe(false);
  });
});
