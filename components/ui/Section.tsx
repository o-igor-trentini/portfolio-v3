import type { ReactNode } from "react";

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
    <section id={id} className={`section${variant === "hero" ? " section--hero" : ""}`}>
      {label && (
        <div className={`section__label${solo ? " section__label--solo" : ""}`}>{"// "}{label}</div>
      )}
      {note && <p className="section__note">{note}</p>}
      {children}
    </section>
  );
}
