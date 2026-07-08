/**
 * Whether an href points off-site — i.e. opens in a new tab with the safe
 * `rel` defaults. Only `http(s)` links count: `mailto:` opens the mail client
 * in place and relative paths stay on-site. The single source for this decision,
 * used by the link components and the JSON-LD `sameAs`/`email` split (lib/seo).
 */
export function isExternalHref(href: string): boolean {
  return href.startsWith("http");
}
