import type { ElementType, ReactNode } from "react";
import { ExternalLink } from "./ExternalLink";
import { isExternalHref } from "@/lib/url";

interface MaybeExternalLinkProps {
  /**
   * The link target. An off-site `http(s)` href renders an `ExternalLink` (new
   * tab + safe rel); an in-place href (e.g. `mailto:`) renders a plain anchor;
   * `undefined` renders the non-link `fallbackAs` element instead.
   */
  href?: string;
  className?: string;
  /** Fired on click for the anchor branches (external + in-place). */
  onClick?: () => void;
  /** Localized "opens in a new tab" cue, forwarded to `ExternalLink`. */
  newTabLabel?: string;
  /** Element rendered when there is no `href` (non-link content). */
  fallbackAs?: ElementType;
  children: ReactNode;
}

/**
 * Renders the right container for a maybe-external link: `ExternalLink` for
 * off-site URLs, a plain `<a>` for in-place hrefs like `mailto:`, or a non-link
 * `fallbackAs` element when there's no href at all. Unifies the external-or-
 * fallback branching that Projects (no link → `<article>`) and Contact (mailto →
 * `<a>`) each hand-wrote, without changing their behavior.
 */
export function MaybeExternalLink({
  href,
  className,
  onClick,
  newTabLabel,
  fallbackAs: Fallback = "div",
  children,
}: MaybeExternalLinkProps) {
  if (href && isExternalHref(href)) {
    return (
      <ExternalLink href={href} className={className} onClick={onClick} newTabLabel={newTabLabel}>
        {children}
      </ExternalLink>
    );
  }
  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return <Fallback className={className}>{children}</Fallback>;
}
