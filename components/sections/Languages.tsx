"use client";

import { usePortfolio } from "../PortfolioProvider";
import { languages, langLevel, langName } from "@/lib/content";

export function Languages() {
  const { t, lang } = usePortfolio();

  return (
    <section id="langs" className="section">
      <div className="section__label">{"// "}{t.langs.label}</div>
      <p className="section__note">{t.langs.note}</p>
      <div className="langs__grid">
        {languages.map((l) => (
          <div key={l.name_en} className="langcard">
            <div className="langcard__head">
              <span className="langcard__name">{langName(l, lang)}</span>
              <span className="langcard__level">{langLevel(l, lang)}</span>
            </div>
            <div className="langcard__bar">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={`seg ${i < l.score ? "seg--on" : "seg--off"}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
