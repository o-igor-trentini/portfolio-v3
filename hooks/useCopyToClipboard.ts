import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCopyToClipboard {
  /** True for `resetMs` after a successful copy, so the UI can flash feedback. */
  copied: boolean;
  /** Write `text` to the clipboard; resolves to whether it succeeded. */
  copy: (text: string) => Promise<boolean>;
}

/**
 * Copy text to the clipboard with a transient `copied` flag that auto-resets.
 * The reset timer is cleared on unmount so it never fires on a gone component.
 */
export function useCopyToClipboard(resetMs = 1500): UseCopyToClipboard {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetMs);
        return true;
      } catch {
        return false;
      }
    },
    [resetMs],
  );

  return { copied, copy };
}
