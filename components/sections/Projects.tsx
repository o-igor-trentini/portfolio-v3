"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "../ui/Section";
import { ExternalLink } from "../ui/ExternalLink";
import { TagList } from "../ui/TagList";
import { RevealControls } from "../ui/RevealControls";
import { usePagination } from "@/hooks/usePagination";
import { projects, projectDesc } from "@/lib/content";
import { PAGE } from "@/site.config";
import styles from "./Projects.module.css";

export function Projects() {
  const { t, lang } = usePortfolio();
  const { shown, hasMore, canCollapse, remaining, showMore, collapse } = usePagination(
    projects,
    PAGE,
  );

  return (
    <Section id="projects" label={t.projects.label} note={t.projects.note}>
      {projects.length === 0 && <EmptyState />}

      {projects.length > 0 && (
        <div className={styles.projects__list}>
          {shown.map((p) => (
            <ExternalLink key={p.name} href={p.link} className={styles.project}>
              <div className={styles.project__head}>
                <span className="accent">▸</span>
                <span className={styles.project__name}>{p.name}</span>
                <span className={styles.project__ext}>↗</span>
              </div>
              <p className={styles.project__desc}>{projectDesc(p, lang)}</p>
              <div className={styles.project__tags}>
                <TagList items={p.tags} className={styles.project__tag} />
              </div>
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
