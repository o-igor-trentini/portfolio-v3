"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Section } from "../ui/Section";
import { TagList } from "../ui/TagList";
import { cx } from "@/lib/cx";
import { useNowYM } from "@/hooks/useNowYM";
import { experiences, expIndustry, expMode, expRole, formatExperience } from "@/lib/content";
import styles from "./Experience.module.css";

export function Experience() {
  const { t, lang } = usePortfolio();
  const now = useNowYM();

  return (
    <Section id="experience" label={t.experience.label} note={t.experience.note}>
      <div className={styles["exp-list"]}>
        {experiences.map((e) => {
          const { present, period, duration, tags } = formatExperience(e, lang, now);

          return (
            <div key={e.company} className={cx(styles.exp, present && styles["exp--present"])}>
              <span className={styles.exp__dot} aria-hidden="true" />
              <div className={styles.exp__head}>
                <h3 className={styles.exp__company}>{e.company}</h3>
                <span className={styles.exp__role}>{expRole(e, lang)}</span>
              </div>
              <div className={styles.exp__period}>
                {period}
                {duration && <span className={styles.exp__dur}> · {duration}</span>}
              </div>
              <div className={styles.exp__meta}>
                {expMode(e, lang)} · {expIndustry(e, lang)}
              </div>
              {tags.length > 0 && (
                <div className={styles.exp__tags}>
                  <TagList items={tags} className={styles.exp__tag} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
