"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { PaginatedSection } from "@/components/ui/PaginatedSection";
import { ExternalLink } from "../ui/ExternalLink";
import { certs, type Cert } from "@/lib/content";
import styles from "./Certs.module.css";

export function Certs() {
  const { t } = usePortfolio();

  const renderItem = (cert: Cert) => (
    <ExternalLink href={cert.link} className={styles.cert}>
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
  );

  return (
    <PaginatedSection
      id="certs"
      label={t.certs.label}
      note={t.certs.note}
      items={certs}
      listClassName={styles.certs__grid}
      moreLabel={t.common.more}
      lessLabel={t.common.less}
      trackSection="certs"
      getKey={(cert) => cert.name}
      renderItem={renderItem}
    />
  );
}
