import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "./useCopyToClipboard";

const writeText = vi.fn<(text: string) => Promise<void>>();

beforeEach(() => {
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("useCopyToClipboard", () => {
  it("writes the text and flips `copied` on success", async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy("hello@example.com");
    });

    expect(writeText).toHaveBeenCalledWith("hello@example.com");
    expect(result.current.copied).toBe(true);
  });

  it("resets `copied` back to false after the timeout", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCopyToClipboard(1000));

    await act(async () => {
      await result.current.copy("x");
    });
    expect(result.current.copied).toBe(true);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.copied).toBe(false);
  });

  it("stays not-copied and resolves false when the write fails", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"));
    const { result } = renderHook(() => useCopyToClipboard());

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.copy("x");
    });

    expect(ok).toBe(false);
    await waitFor(() => expect(result.current.copied).toBe(false));
  });
});
