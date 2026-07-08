"use client";

import { useRef } from "react";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useTerminalControls } from "@/components/providers/TerminalProvider";
import { useTerminalBuffer } from "@/hooks/useTerminalBuffer";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cx } from "@/lib/cx";
import { PROMPT } from "@/site.config";
import styles from "./Terminal.module.css";

export function Terminal() {
  const { t } = usePortfolio();
  const { termOpen, closeTerm } = useTerminalControls();

  const windowRef = useRef<HTMLDivElement>(null);
  const { lines, input, setInput, onInputKey, bodyRef, inputRef } = useTerminalBuffer();

  // Keep focus inside the modal while open and restore it to the trigger on close.
  useFocusTrap(windowRef, termOpen);

  if (!termOpen) return null;

  return (
    <div className={styles["term-overlay"]} onClick={closeTerm}>
      <div
        ref={windowRef}
        className={styles["term-window"]}
        role="dialog"
        aria-modal="true"
        aria-label={t.a11y.terminal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles["term-titlebar"]}>
          <button
            type="button"
            className={cx(styles["term-dot"], styles["term-dot--red"], styles["term-dot--close"])}
            aria-label={t.a11y.terminalClose}
            onClick={closeTerm}
          >
            <span className={styles["term-dot__glyph"]} aria-hidden="true">
              ✕
            </span>
          </button>
          <span className={cx(styles["term-dot"], styles["term-dot--amber"])} />
          <span className={cx(styles["term-dot"], styles["term-dot--green"])} />
          <span className={styles["term-title"]}>visitor@portfolio: ~/zsh</span>
          <span className={styles["term-titlebar__spacer"]} aria-hidden="true" />
        </div>
        <div
          className={styles["term-body"]}
          ref={bodyRef}
          role="log"
          aria-live="polite"
          aria-label={t.a11y.terminalOutput}
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((l, i) => (
            <div key={i} className={styles["term-line"]}>
              {l.prompt && <span className={styles["term-prompt"]}>{l.prompt} </span>}
              <span style={{ color: l.color }}>{l.text}</span>
            </div>
          ))}
          <div className={styles["term-inputrow"]}>
            <span className={styles["term-inputrow__prompt"]}>{PROMPT}</span>
            <input
              ref={inputRef}
              className={styles["term-input"]}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKey}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              data-handles-tab
              aria-label={t.a11y.terminalInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
