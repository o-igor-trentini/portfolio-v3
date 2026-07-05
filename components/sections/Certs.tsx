"use client";

import { usePortfolio } from "../PortfolioProvider";
import { EmptyState } from "../EmptyState";
import { Section } from "../ui/Section";
import { ExternalLink } from "../ui/ExternalLink";
import { RevealControls } from "../ui/RevealControls";
import { usePagination } from "@/hooks/usePagination";
import { certs } from "@/lib/content";
import { PAGE } from "@/site.config";

export function Certs() {
  const { t } = usePortfolio();
  const { shown, hasMore, canCollapse, remaining, showMore, collapse } = usePagination(certs, PAGE);

  return (
    <Section id="certs" label={t.certs.label} note={t.certs.note}>
      {certs.length === 0 && <EmptyState />}

      {certs.length > 0 && (
      <div className="certs__grid">
        {shown.map((cert) => (
          <ExternalLink key={cert.name} href={cert.link} className="cert card">
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
          </ExternalLink>
        ))}
      </div>
      )}

      <RevealControls
        hasMore={hasMore}
        canCollapse={canCollapse}
        remaining={remaining}
        moreLabel={t.common.more}
        lessLabel={t.common.less}
        onMore={showMore}
        onCollapse={collapse}
      />
    </Section>
  );
}
