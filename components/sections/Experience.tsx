"use client";

import { useEffect, useState } from "react";
import { usePortfolio } from "../PortfolioProvider";
import { experiences, expIndustry, expMode, expRole, expTags } from "@/lib/content";
import { formatDuration, formatMonthYear, monthsInclusive, parseYM, type YearMonth } from "@/lib/date";

export function Experience() {
  const { t, lang } = usePortfolio();

  // "Now" is client-only so the duration of the current role stays fresh and
  // never mismatches the statically-rendered HTML.
  const [now, setNow] = useState<YearMonth | null>(null);
  useEffect(() => {
    const d = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only "now", avoids SSR staleness
    setNow({ y: d.getFullYear(), m: d.getMonth() + 1 });
  }, []);

  return (
    <section id="experience" className="section">
      <div className="section__label">{"// "}{t.experience.label}</div>
      <p className="section__note">{t.experience.note}</p>

      <div className="exp-list">
        {experiences.map((e) => {
          const present = e.end === null;
          const endYM = present ? now : parseYM(e.end as string);
          const period = `${formatMonthYear(e.start, lang)} — ${
            present ? t.experience.present : formatMonthYear(e.end as string, lang)
          }`;
          const duration = endYM ? formatDuration(monthsInclusive(e.start, endYM), lang) : null;
          const tags = expTags(e, lang);

          return (
            <div key={e.company} className={`exp${present ? " exp--present" : ""}`}>
              <span className="exp__dot" aria-hidden="true" />
              <div className="exp__head">
                <span className="exp__company">{e.company}</span>
                <span className="exp__role">{expRole(e, lang)}</span>
              </div>
              <div className="exp__period">
                {period}
                {duration && <span className="exp__dur"> · {duration}</span>}
              </div>
              <div className="exp__meta">
                {expMode(e, lang)} · {expIndustry(e, lang)}
              </div>
              {tags.length > 0 && (
                <div className="exp__tags">
                  {tags.map((tag) => (
                    <span key={tag} className="exp__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
