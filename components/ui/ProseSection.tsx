import { Section } from "./Section";

interface ProseSectionProps {
  /** Anchor id used by the nav links. */
  id: string;
  label: string;
  note?: string;
  /** The single paragraph of body copy. */
  body: string;
  /** Class for the `<p>` (each section keeps its own BEM `…__body` token). */
  bodyClassName: string;
  /**
   * Set when `body` carries build-time-interpolated copy (e.g. the `{years}`
   * token) so the client render may differ harmlessly — adds
   * `suppressHydrationWarning` to the paragraph.
   */
  dynamic?: boolean;
}

/**
 * A Section whose body is a single paragraph of prose — the shared shape behind
 * the About and Workflow sections, which differ only in their body class and
 * whether the copy is dynamically interpolated.
 */
export function ProseSection({ id, label, note, body, bodyClassName, dynamic }: ProseSectionProps) {
  return (
    <Section id={id} label={label} note={note}>
      <p className={bodyClassName} suppressHydrationWarning={dynamic}>
        {body}
      </p>
    </Section>
  );
}
