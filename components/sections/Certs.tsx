"use client";

import { useState } from "react";
import { usePortfolio } from "../PortfolioProvider";
import { certs } from "@/lib/content";
import { PAGE } from "@/site.config";

export function Certs() {
  const { t } = usePortfolio();
  const [visible, setVisible] = useState(PAGE);

  const shown = certs.slice(0, visible);
  const hasMore = visible < certs.length;
  const remaining = Math.max(0, certs.length - visible);
  const canCollapse = visible > PAGE;

  return (
    <section id="certs" className="section">
      <div className="section__label">{"// "}{t.certs.label}</div>
      <p className="section__note">{t.certs.note}</p>

      <div className="certs__grid">
        {shown.map((cert) => (
          <a
            key={cert.name}
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            className="cert"
          >
            <div className="cert__head">
              <span className="cert__check" aria-hidden="true">✓</span>
              <span className="cert__name">{cert.name}</span>
            </div>
            <div className="cert__meta">
              <span>{cert.issuer}</span>
              <span className="cert__dot">·</span>
              <span>{cert.year}</span>
            </div>
            <div className="cert__verify">{t.certs.verify} ↗</div>
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
