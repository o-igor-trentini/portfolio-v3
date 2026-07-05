import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";
import styles from "./Card.module.css";

type CardProps = ComponentPropsWithoutRef<"div">;

/**
 * Bordered surface primitive (`.card`). Section-specific cards add their own
 * class through `className`. The certifications card is an anchor, so it reuses
 * the same surface via CSS `composes` instead of rendering this component.
 */
export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={cx(styles.card, className)} {...rest}>
      {children}
    </div>
  );
}
