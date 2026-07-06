import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTerminal } from "./useTerminal";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const press = (key: string) => window.dispatchEvent(new KeyboardEvent("keydown", { key }));

describe("useTerminal", () => {
  it("opens and closes via the returned callbacks", () => {
    const { result } = renderHook(() => useTerminal());
    expect(result.current.termOpen).toBe(false);

    act(() => result.current.openTerm("hero"));
    expect(result.current.termOpen).toBe(true);

    act(() => result.current.closeTerm());
    expect(result.current.termOpen).toBe(false);
  });

  it("opens on backtick and closes on Escape", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => press("`"));
    expect(result.current.termOpen).toBe(true);

    act(() => press("Escape"));
    expect(result.current.termOpen).toBe(false);
  });

  it("opens and bumps the bonus nonce on the Konami code", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => KONAMI.forEach(press));

    expect(result.current.termOpen).toBe(true);
    expect(result.current.bonusNonce).toBe(1);
  });
});
