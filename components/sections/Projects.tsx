"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { PaginatedSection } from "@/components/ui/PaginatedSection";
import { ExternalLink } from "../ui/ExternalLink";
import { TagList } from "../ui/TagList";
import { projects, projectDesc, type Project } from "@/lib/content";
import { track } from "@/lib/analytics";
import styles from "./Projects.module.css";

export function Projects() {
  const { t, lang } = usePortfolio();

  const renderItem = (p: Project) => {
    const body = (
      <>
        <div className={styles.project__head}>
          <span className="accent">▸</span>
          <span className={styles.project__name}>{p.name}</span>
          {p.link && <span className={styles.project__ext}>↗</span>}
        </div>
        <p className={styles.project__desc}>{projectDesc(p, lang)}</p>
        <div className={styles.project__tags}>
          <TagList items={p.tags} className={styles.project__tag} />
        </div>
      </>
    );
    // Private-repo projects have no link, so they render as a static article
    // rather than an external anchor.
    return p.link ? (
      <ExternalLink
        href={p.link}
        className={styles.project}
        onClick={() => track({ name: "project_click", params: { name: p.name } })}
      >
        {body}
      </ExternalLink>
    ) : (
      <article className={styles.project}>{body}</article>
    );
  };

  return (
    <PaginatedSection
      id="projects"
      label={t.projects.label}
      note={t.projects.note}
      items={projects}
      listClassName={styles.projects__list}
      moreLabel={t.common.more}
      lessLabel={t.common.less}
      trackSection="projects"
      getKey={(p) => p.name}
      renderItem={renderItem}
    />
  );
}
