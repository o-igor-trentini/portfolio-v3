import type { ReactNode } from "react";

interface ExternalLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  /** Fired on click — used by call sites to record an outbound-click event. */
  onClick?: () => void;
}

/** Anchor to an external page with the safe target/rel defaults always applied. */
export function ExternalLink({ href, className, children, onClick }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
