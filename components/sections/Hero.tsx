"use client";

import { usePortfolio } from "../PortfolioProvider";
import { Section } from "../ui/Section";

export function Hero() {
  const { name, t, openTerm } = usePortfolio();

  return (
    <Section variant="hero">
      <div className="hero__cmd">
        <b>visitor@portfolio</b>:~$ {t.hero.cmd}
      </div>
      <h1 className="hero__title">
        {name}
        <span className="caret" aria-hidden="true" />
      </h1>
      <div className="hero__role">{t.hero.role}</div>
      <p className="hero__tagline">{t.hero.tagline}</p>
      <div className="hero__actions">
        <button type="button" className="btn btn-accent" onClick={openTerm}>
          <span style={{ fontSize: 14 }}>&gt;_</span>
          {t.hero.cta}
        </button>
        <span className="hero__hint">
          {t.hero.hint1} <kbd>`</kbd> {t.hero.hint2}
        </span>
      </div>
    </Section>
  );
}
