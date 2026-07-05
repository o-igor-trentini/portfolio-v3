"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Section } from "../ui/Section";
import { Card } from "../ui/Card";
import { cx } from "@/lib/cx";
import { languages, langLevel, langName } from "@/lib/content";
import styles from "./Languages.module.css";

export function Languages() {
  const { t, lang } = usePortfolio();

  return (
    <Section id="langs" label={t.langs.label} note={t.langs.note}>
      <div className={styles.langs__grid}>
        {languages.map((l) => (
          <Card key={l.name_en} className={styles.langcard}>
            <div className={styles.langcard__head}>
              <span className={styles.langcard__name}>{langName(l, lang)}</span>
              <span className={styles.langcard__level}>{langLevel(l, lang)}</span>
            </div>
            <div className={styles.langcard__bar}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={cx(styles.seg, i < l.score ? styles["seg--on"] : styles["seg--off"])} />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
