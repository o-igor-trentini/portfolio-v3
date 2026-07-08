import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { KeyboardEvent, ReactNode } from "react";
import { PortfolioProvider } from "@/components/providers/PortfolioProvider";
import { TerminalProvider, useTerminalControls } from "@/components/providers/TerminalProvider";
import { useTerminalBuffer } from "./useTerminalBuffer";

// The buffer now reads the portfolio + terminal contexts directly, so exercise
// it through the real providers and open the terminal via its controls.
const wrapper = ({ children }: { children: ReactNode }) => (
  <PortfolioProvider initialLang="en">
    <TerminalProvider>{children}</TerminalProvider>
  </PortfolioProvider>
);

function useHarness() {
  return { controls: useTerminalControls(), buffer: useTerminalBuffer() };
}

const renderOpenBuffer = () => {
  const hook = renderHook(() => useHarness(), { wrapper });
  act(() => hook.result.current.controls.openTerm("hero"));
  return hook;
};

const key = (k: string) =>
  ({ key: k, preventDefault: () => {} }) as unknown as KeyboardEvent<HTMLInputElement>;

// Variant that records preventDefault, for asserting whether a key was handled.
const trackedKey = (k: string, shiftKey = false) => {
  const preventDefault = vi.fn();
  return {
    event: { key: k, shiftKey, preventDefault } as unknown as KeyboardEvent<HTMLInputElement>,
    preventDefault,
  };
};

describe("useTerminalBuffer", () => {
  it("seeds the intro lines once the terminal is open", () => {
    const { result } = renderOpenBuffer();
    expect(result.current.buffer.lines.length).toBeGreaterThan(0);
  });

  it("echoes a command and appends its output on Enter", () => {
    const { result } = renderOpenBuffer();
    act(() => result.current.buffer.setInput("help"));
    act(() => result.current.buffer.onInputKey(key("Enter")));

    const text = result.current.buffer.lines.map((l) => l.text).join("\n");
    expect(text).toContain("help"); // the echoed prompt line
    expect(text).toContain("available commands"); // the help output
    expect(result.current.buffer.input).toBe(""); // input cleared after run
  });

  it("clears the buffer on the `clear` control command", () => {
    const { result } = renderOpenBuffer();
    act(() => result.current.buffer.setInput("clear"));
    act(() => result.current.buffer.onInputKey(key("Enter")));
    expect(result.current.buffer.lines).toHaveLength(0);
  });

  it("recalls the previous command with ArrowUp", () => {
    const { result } = renderOpenBuffer();
    act(() => result.current.buffer.setInput("about"));
    act(() => result.current.buffer.onInputKey(key("Enter")));
    act(() => result.current.buffer.onInputKey(key("ArrowUp")));
    expect(result.current.buffer.input).toBe("about");
  });

  it("completes a command prefix on Tab", () => {
    const { result } = renderOpenBuffer();
    act(() => result.current.buffer.setInput("hel"));
    const tab = trackedKey("Tab");
    act(() => result.current.buffer.onInputKey(tab.event));
    expect(result.current.buffer.input).toBe("help");
    expect(tab.preventDefault).toHaveBeenCalled();
  });

  it("leaves Tab to the focus trap when the input is empty (a11y: reach the close button)", () => {
    const { result } = renderOpenBuffer();
    // Input starts empty; Tab must not be hijacked for completion.
    const tab = trackedKey("Tab");
    act(() => result.current.buffer.onInputKey(tab.event));
    expect(result.current.buffer.input).toBe("");
    expect(tab.preventDefault).not.toHaveBeenCalled();
  });

  it("completes a command argument on Tab past the first space", () => {
    const { result } = renderOpenBuffer();
    act(() => result.current.buffer.setInput("lang p"));
    act(() => result.current.buffer.onInputKey(trackedKey("Tab").event));
    expect(result.current.buffer.input).toBe("lang pt");
  });

  it("runs the consent command and echoes the new decision", () => {
    localStorage.clear();
    const { result } = renderOpenBuffer();
    act(() => result.current.buffer.setInput("consent grant"));
    act(() => result.current.buffer.onInputKey(key("Enter")));
    const text = result.current.buffer.lines.map((l) => l.text).join("\n");
    expect(text).toContain("analytics consent → granted");
    expect(localStorage.getItem("pf_consent")).toBe("granted");
    localStorage.clear();
  });
});
