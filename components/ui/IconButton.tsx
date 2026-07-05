import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";
import styles from "./IconButton.module.css";

interface IconButtonProps extends ComponentPropsWithoutRef<"button"> {
  /** Required — icon-only buttons have no text, so they must name themselves. */
  "aria-label": string;
}

/**
 * Square icon-only button (`.iconbtn`). Holds a single SVG child and requires an
 * `aria-label`. Extra classes (e.g. `nav-burger`) compose through `className`.
 */
export function IconButton({ className, type, children, ...rest }: IconButtonProps) {
  return (
    <button type={type ?? "button"} className={cx(styles.iconbtn, className)} {...rest}>
      {children}
    </button>
  );
}
