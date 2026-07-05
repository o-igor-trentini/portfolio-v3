"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Section } from "../ui/Section";
import { TagList } from "../ui/TagList";
import { useNowYM } from "@/hooks/useNowYM";
import { experiences, expIndustry, expMode, expRole, formatExperience } from "@/lib/content";

export function Experience() {
  const { t, lang } = usePortfolio();
  const now = useNowYM();

  return (
    <Section id="experience" label={t.experience.label} note={t.experience.note}>
      <div className="exp-list">
        {experiences.map((e) => {
          const { present, period, duration, tags } = formatExperience(e, lang, now);

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
                  <TagList items={tags} className="exp__tag" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
