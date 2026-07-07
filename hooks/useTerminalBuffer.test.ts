import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { KeyboardEvent } from "react";
import { useTerminalBuffer, type TerminalBufferDeps } from "./useTerminalBuffer";

const deps: TerminalBufferDeps = {
  termOpen: true,
  bonusNonce: 0,
  lang: "en",
  theme: "dark",
  name: "Igor",
  setLang: vi.fn(),
  toggleTheme: vi.fn(),
  closeTerm: vi.fn(),
};

const key = (k: string) =>
  ({ key: k, preventDefault: () => {} }) as unknown as KeyboardEvent<HTMLInputElement>;

describe("useTerminalBuffer", () => {
  it("seeds the intro lines once the terminal is open", () => {
    const { result } = renderHook(() => useTerminalBuffer(deps));
    expect(result.current.lines.length).toBeGreaterThan(0);
  });

  it("echoes a command and appends its output on Enter", () => {
    const { result } = renderHook(() => useTerminalBuffer(deps));
    act(() => result.current.setInput("help"));
    act(() => result.current.onInputKey(key("Enter")));

    const text = result.current.lines.map((l) => l.text).join("\n");
    expect(text).toContain("help"); // the echoed prompt line
    expect(text).toContain("available commands"); // the help output
    expect(result.current.input).toBe(""); // input cleared after run
  });

  it("clears the buffer on the `clear` control command", () => {
    const { result } = renderHook(() => useTerminalBuffer(deps));
    act(() => result.current.setInput("clear"));
    act(() => result.current.onInputKey(key("Enter")));
    expect(result.current.lines).toHaveLength(0);
  });

  it("recalls the previous command with ArrowUp", () => {
    const { result } = renderHook(() => useTerminalBuffer(deps));
    act(() => result.current.setInput("about"));
    act(() => result.current.onInputKey(key("Enter")));
    act(() => result.current.onInputKey(key("ArrowUp")));
    expect(result.current.input).toBe("about");
  });
});
