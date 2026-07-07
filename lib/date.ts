import type { Lang } from "./i18n";

const MONTHS: Record<Lang, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
};

export interface YearMonth {
  y: number;
  m: number; // 1-12
}

/**
 * Parse a "YYYY-MM" string. Throws on malformed input so a bad date in the
 * curated content fails the build loudly instead of silently yielding NaN and
 * propagating garbage through the duration/period formatters.
 */
export function parseYM(s: string): YearMonth {
  const match = /^(\d{4})-(\d{2})$/.exec(s);
  if (!match) throw new Error(`Invalid YearMonth "${s}" — expected "YYYY-MM"`);
  const y = Number(match[1]);
  const m = Number(match[2]);
  if (m < 1 || m > 12) throw new Error(`Invalid month in YearMonth "${s}" — expected 01-12`);
  return { y, m };
}

/** The current year/month (`m` is 1-12). */
export function nowYM(): YearMonth {
  const d = new Date();
  return { y: d.getFullYear(), m: d.getMonth() + 1 };
}

/** "2021-09" → "Sep 2021" / "set 2021". */
export function formatMonthYear(s: string, lang: Lang): string {
  const { y, m } = parseYM(s);
  return `${MONTHS[lang][m - 1]} ${y}`;
}

/** Whole months between a start "YYYY-MM" and an end year/month, counting both endpoints. */
export function monthsInclusive(start: string, end: YearMonth): number {
  const s = parseYM(start);
  return Math.max(1, (end.y - s.y) * 12 + (end.m - s.m) + 1);
}

/** Whole years between a start "YYYY-MM" and now, rounded to the nearest year. */
export function yearsOfExperience(start: string, now: YearMonth): number {
  return Math.round(monthsInclusive(start, now) / 12);
}

/** Human duration, e.g. "4 yrs 8 mos" / "4 anos 8 meses". */
export function formatDuration(months: number, lang: Lang): string {
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts: string[] = [];

  if (lang === "pt") {
    if (years > 0) parts.push(`${years} ano${years > 1 ? "s" : ""}`);
    if (rem > 0) parts.push(`${rem} ${rem > 1 ? "meses" : "mês"}`);
    return parts.join(" ") || "1 mês";
  }

  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rem > 0) parts.push(`${rem} mo${rem > 1 ? "s" : ""}`);
  return parts.join(" ") || "1 mo";
}
