"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Section } from "../ui/Section";
import { ExternalLink } from "../ui/ExternalLink";
import { contacts } from "@/lib/content";
import styles from "./Contact.module.css";

export function Contact() {
  const { t } = usePortfolio();
  return (
    <Section id="contact" label={t.contact.label} note={t.contact.note}>
      <div className={styles.contact__list}>
        {contacts.map((c) => (
          <ExternalLink key={c.label} href={c.href} className={styles["contact-row"]}>
            <span className={styles["contact-row__label"]}>{c.label}</span>
            <span className={styles["contact-row__value"]}>{c.value}</span>
            <span className={styles["contact-row__ext"]}>↗</span>
          </ExternalLink>
        ))}
      </div>
    </Section>
  );
}
