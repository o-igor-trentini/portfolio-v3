import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";
import styles from "./Button.module.css";

type ButtonVariant = "accent" | "ghost" | "link";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  accent: styles["btn-accent"],
  ghost: styles["btn-ghost"],
  link: styles["btn-link"],
};

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  /** Shared visual variant. Omit for a bare reset that only carries `className`. */
  variant?: ButtonVariant;
}

/**
 * Button primitive: applies the `.btn` reset plus an optional accent/ghost/link
 * variant. Section-specific looks (e.g. `chip-btn`, `term-btn`) compose through
 * `className`. Defaults `type` to "button" so it never submits a form by accident.
 */
export function Button({ variant, className, type, children, ...rest }: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={cx(styles.btn, variant && VARIANT_CLASS[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
