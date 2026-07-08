import type { Dict } from "./i18n";

/**
 * Section anchors in page order, each paired with its `t.nav` label key. The
 * single list the header renders (desktop + mobile) instead of hand-writing one
 * `<a>` per section — add or reorder a section here, not in the markup.
 */
export const NAV_ITEMS: { id: string; label: keyof Dict["nav"] }[] = [
  { id: "about", label: "about" },
  { id: "workflow", label: "workflow" },
  { id: "experience", label: "experience" },
  { id: "langs", label: "langs" },
  { id: "stack", label: "stack" },
  { id: "projects", label: "projects" },
  { id: "certs", label: "certs" },
  { id: "contact", label: "contact" },
];
