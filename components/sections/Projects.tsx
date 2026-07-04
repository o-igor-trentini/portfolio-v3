"use client";

import { useState } from "react";
import { usePortfolio } from "../PortfolioProvider";
import { projects, projectDesc } from "@/lib/content";
import { PAGE } from "@/site.config";

export function Projects() {
  const { t, lang } = usePortfolio();
  const [visible, setVisible] = useState(PAGE);

  const shown = projects.slice(0, visible);
  const hasMore = visible < projects.length;
  const remaining = Math.max(0, projects.length - visible);
  const canCollapse = visible > PAGE;

  return (
    <section id="projects" className="section">
      <div className="section__label">{"// "}{t.projects.label}</div>
      <p className="section__note">{t.projects.note}</p>

      <div className="projects__list">
        {shown.map((p) => (
          <a
            key={p.name}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project"
          >
            <div className="project__head">
              <span className="accent">▸</span>
              <span className="project__name">{p.name}</span>
              <span className="project__ext">↗</span>
            </div>
            <p className="project__desc">{projectDesc(p, lang)}</p>
            <div className="project__tags">
              {p.tags.map((tag) => (
                <span key={tag} className="project__tag">
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>

      {(hasMore || canCollapse) && (
        <div className="controls">
          {hasMore && (
            <button type="button" className="btn-ghost" onClick={() => setVisible((v) => v + PAGE)}>
              <span className="accent">▾</span>
              {t.common.more} <span className="muted">(+{remaining})</span>
            </button>
          )}
          {canCollapse && (
            <button type="button" className="btn-link" onClick={() => setVisible(PAGE)}>
              {t.common.less}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
