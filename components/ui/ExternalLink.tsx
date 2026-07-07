import type { ReactNode } from "react";

interface ExternalLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  /** Fired on click — used by call sites to record an outbound-click event. */
  onClick?: () => void;
  /**
   * Localized "opens in a new tab" cue (e.g. `t.a11y.newTab`). Rendered
   * visually-hidden so screen-reader users are warned about the target="_blank".
   */
  newTabLabel?: string;
}

/** Anchor to an external page with the safe target/rel defaults always applied. */
export function ExternalLink({
  href,
  className,
  children,
  onClick,
  newTabLabel,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onClick}
    >
      {children}
      {newTabLabel && <span className="sr-only"> ({newTabLabel})</span>}
    </a>
  );
}
