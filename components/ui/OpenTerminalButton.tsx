"use client";

import type { ComponentProps } from "react";
import { Button } from "./Button";
import { useTerminalControls } from "@/components/providers/TerminalProvider";
import type { TerminalSource } from "@/lib/analytics";

interface OpenTerminalButtonProps {
  /** Where the open originated — recorded on the terminal_open event. */
  source: TerminalSource;
  label: string;
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
  /** Class for the decorative `>_` glyph (its size/color differ per call site). */
  glyphClassName?: string;
}

/**
 * The "open terminal" affordance shared by Hero and Footer: the `>_` prompt
 * glyph (marked decorative) plus the `openTerm(source)` wiring in one place,
 * instead of each site re-declaring the button and its aria-hidden glyph.
 */
export function OpenTerminalButton({
  source,
  label,
  variant,
  className,
  glyphClassName,
}: OpenTerminalButtonProps) {
  const { openTerm } = useTerminalControls();
  return (
    <Button variant={variant} className={className} onClick={() => openTerm(source)}>
      <span className={glyphClassName} aria-hidden="true">
        &gt;_
      </span>
      {label}
    </Button>
  );
}
