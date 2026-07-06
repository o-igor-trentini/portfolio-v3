"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Section } from "../ui/Section";
import { Button } from "../ui/Button";
import { withYears } from "@/lib/content";
import styles from "./Hero.module.css";

export function Hero() {
  const { name, t, openTerm } = usePortfolio();

  return (
    <Section variant="hero">
      <div className={styles.hero__cmd}>
        <b>visitor@portfolio</b>:~$ {t.hero.cmd}
      </div>
      <h1 className={styles.hero__title}>
        {name}
        <span className="caret" aria-hidden="true" />
      </h1>
      <div className={styles.hero__role}>{t.hero.role}</div>
      <p className={styles.hero__tagline} suppressHydrationWarning>
        {withYears(t.hero.tagline)}
      </p>
      <div className={styles.hero__actions}>
        <Button variant="accent" onClick={() => openTerm("hero")}>
          <span style={{ fontSize: 14 }}>&gt;_</span>
          {t.hero.cta}
        </Button>
        <span className={styles.hero__hint}>
          {t.hero.hint1} <kbd>`</kbd> {t.hero.hint2}
        </span>
      </div>
    </Section>
  );
}
