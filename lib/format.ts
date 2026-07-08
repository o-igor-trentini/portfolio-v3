/**
 * Replace every `{key}` token in a template with the matching value — the one
 * place string interpolation of i18n copy lives (e.g. `{years}`, `{n}`), instead
 * of ad-hoc `.replace("{n}", …)` scattered across components.
 */
export function format(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
