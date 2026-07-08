import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Section.module.css";

interface SectionProps {
  /** Anchor id used by the nav links (omit for the hero). */
  id?: string;
  /** Label text; rendered after the `// ` prefix. Omit for the hero. */
  label?: string;
  note?: string;
  variant?: "hero";
  children: ReactNode;
}

/** Page section shell: shared `// label` + note header plus the section wrapper. */
export function Section({ id, label, note, variant, children }: SectionProps) {
  // The label doubles as the section's accessible name (aria-labelledby), so it
  // needs a stable id. The `// ` prefix is decorative and hidden from a11y tree.
  const headingId = id && label ? `${id}-heading` : undefined;
  // A label without a note gets extra bottom spacing (the old `solo` prop) —
  // the two are perfectly correlated, so derive it instead of passing it in.
  const solo = !note;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cx(styles.section, variant === "hero" && styles["section--hero"])}
    >
      {label && (
        <h2
          id={headingId}
          className={cx(styles.section__label, solo && styles["section__label--solo"])}
        >
          <span aria-hidden="true">{"// "}</span>
          {label}
        </h2>
      )}
      {note && <p className={styles.section__note}>{note}</p>}
      {children}
    </section>
  );
}
