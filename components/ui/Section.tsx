import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Section.module.css";

interface SectionProps {
  /** Anchor id used by the nav links (omit for the hero). */
  id?: string;
  /** Label text; rendered after the `// ` prefix. Omit for the hero. */
  label?: string;
  note?: string;
  /** About-style label: extra bottom spacing, used when there is no note. */
  solo?: boolean;
  variant?: "hero";
  children: ReactNode;
}

/** Page section shell: shared `// label` + note header plus the section wrapper. */
export function Section({ id, label, note, solo, variant, children }: SectionProps) {
  return (
    <section id={id} className={cx(styles.section, variant === "hero" && styles["section--hero"])}>
      {label && (
        <div className={cx(styles.section__label, solo && styles["section__label--solo"])}>{"// "}{label}</div>
      )}
      {note && <p className={styles.section__note}>{note}</p>}
      {children}
    </section>
  );
}
