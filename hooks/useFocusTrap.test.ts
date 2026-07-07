import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createRef } from "react";
import { useFocusTrap } from "./useFocusTrap";

let container: HTMLDivElement;
let first: HTMLButtonElement;
let last: HTMLInputElement;
let outside: HTMLButtonElement;

beforeEach(() => {
  outside = document.createElement("button");
  outside.textContent = "trigger";
  document.body.appendChild(outside);

  container = document.createElement("div");
  first = document.createElement("button");
  last = document.createElement("input");
  container.append(first, last);
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.innerHTML = "";
});

function press(shiftKey: boolean) {
  const e = new KeyboardEvent("keydown", { key: "Tab", shiftKey, bubbles: true, cancelable: true });
  document.dispatchEvent(e);
  return e;
}

describe("useFocusTrap", () => {
  it("wraps Tab from the last focusable back to the first", () => {
    const ref = createRef<HTMLDivElement>();
    ref.current = container;
    renderHook(() => useFocusTrap(ref, true));

    last.focus();
    const e = press(false);

    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it("wraps Shift+Tab from the first focusable to the last", () => {
    const ref = createRef<HTMLDivElement>();
    ref.current = container;
    renderHook(() => useFocusTrap(ref, true));

    first.focus();
    const e = press(true);

    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it("does nothing while inactive", () => {
    const ref = createRef<HTMLDivElement>();
    ref.current = container;
    renderHook(() => useFocusTrap(ref, false));

    last.focus();
    const e = press(false);

    expect(e.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(last);
  });

  it("restores focus to the previously focused element on deactivation", () => {
    const ref = createRef<HTMLDivElement>();
    ref.current = container;
    outside.focus(); // the "trigger" is focused when the trap turns on

    const { rerender } = renderHook(({ active }) => useFocusTrap(ref, active), {
      initialProps: { active: true },
    });
    first.focus(); // focus moves into the modal

    rerender({ active: false }); // close
    expect(document.activeElement).toBe(outside);
  });
});
