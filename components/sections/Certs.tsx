"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "../ui/Section";
import { ExternalLink } from "../ui/ExternalLink";
import { RevealControls } from "../ui/RevealControls";
import { usePagination } from "@/hooks/usePagination";
import { certs } from "@/lib/content";
import { track } from "@/lib/analytics";
import { PAGE } from "@/site.config";
import styles from "./Certs.module.css";

export function Certs() {
  const { t } = usePortfolio();
  const { shown, hasMore, canCollapse, remaining, showMore, collapse } = usePagination(certs, PAGE);

  return (
    <Section id="certs" label={t.certs.label} note={t.certs.note}>
      {certs.length === 0 && <EmptyState />}

      {certs.length > 0 && (
        <div className={styles.certs__grid}>
          {shown.map((cert) => (
            <ExternalLink key={cert.name} href={cert.link} className={styles.cert}>
              <div className={styles.cert__head}>
                <span className={styles.cert__check} aria-hidden="true">
                  ✓
                </span>
                <span className={styles.cert__name}>{cert.name}</span>
              </div>
              <div className={styles.cert__meta}>
                <span>{cert.issuer}</span>
                <span className={styles.cert__dot}>·</span>
                <span>{cert.year}</span>
              </div>
              <div className={styles.cert__verify}>{t.certs.verify} ↗</div>
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
        onMore={() => {
          track({ name: "show_more", params: { section: "certs" } });
          showMore();
        }}
        onCollapse={collapse}
      />
    </Section>
  );
}
