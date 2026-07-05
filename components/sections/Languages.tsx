"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Section } from "../ui/Section";
import { languages, langLevel, langName } from "@/lib/content";

export function Languages() {
  const { t, lang } = usePortfolio();

  return (
    <Section id="langs" label={t.langs.label} note={t.langs.note}>
      <div className="langs__grid">
        {languages.map((l) => (
          <div key={l.name_en} className="langcard card">
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
    </Section>
  );
}
