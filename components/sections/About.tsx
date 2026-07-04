"use client";

import { usePortfolio } from "../PortfolioProvider";

export function About() {
  const { t } = usePortfolio();
  return (
    <section id="about" className="section">
      <div className="section__label section__label--solo">{"// "}{t.about.label}</div>
      <p className="about__body">{t.about.body}</p>
    </section>
  );
}
