/** A class-name value that `cx` accepts: a string, or a falsy placeholder
 *  produced by short-circuit expressions like `active && styles.on`. */
type ClassValue = string | false | null | undefined;

/**
 * Join class names, dropping falsy entries. Keeps conditional classes readable
 * when composing CSS Module tokens, e.g. `cx(styles.exp, present && styles["exp--present"])`.
 */
export function cx(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(" ");
}
