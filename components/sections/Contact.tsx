"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Section } from "../ui/Section";
import { ExternalLink } from "../ui/ExternalLink";
import { IconButton } from "../ui/IconButton";
import { CheckIcon, CopyIcon } from "../ui/Icons";
import { contacts, resumeHref, type Contact as ContactEntry } from "@/lib/content";
import { track } from "@/lib/analytics";
import { format } from "@/lib/format";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import styles from "./Contact.module.css";

export function Contact() {
  const { t, lang } = usePortfolio();
  const resume = resumeHref(lang);
  return (
    <Section id="contact" label={t.contact.label} note={t.contact.note}>
      <div className={styles.contact__list}>
        {contacts.map((c) => (
          <ContactRow key={c.label} contact={c} />
        ))}
      </div>
      {resume && (
        <ExternalLink
          href={resume}
          className={styles.contact__resume}
          newTabLabel={t.a11y.newTab}
          onClick={() => track({ name: "contact_click", params: { label: "resume" } })}
        >
          {t.contact.resume}
          <span className={styles["contact-row__ext"]} aria-hidden="true">
            ↗
          </span>
        </ExternalLink>
      )}
    </Section>
  );
}

function ContactRow({ contact: c }: { contact: ContactEntry }) {
  const { t } = usePortfolio();
  const { copied, copy } = useCopyToClipboard();

  // `mailto:` opens the mail client in place — not a new tab — so it's a plain
  // anchor without the external/new-tab affordances the http links carry.
  const isExternal = c.href.startsWith("http");

  const handleCopy = () => {
    // Copy the full URL for web profiles, but the bare address for email
    // (`c.value`) rather than the `mailto:` href.
    void copy(isExternal ? c.href : c.value);
    track({ name: "contact_copy", params: { label: c.label } });
  };
  const onClick = () => track({ name: "contact_click", params: { label: c.label } });
  const inner = (
    <>
      <span className={styles["contact-row__label"]}>{c.label}</span>
      <span className={styles["contact-row__value"]}>{c.value}</span>
      {isExternal && <span className={styles["contact-row__ext"]}>↗</span>}
    </>
  );

  return (
    <div className={styles["contact-row"]}>
      {isExternal ? (
        <ExternalLink
          href={c.href}
          className={styles["contact-row__link"]}
          newTabLabel={t.a11y.newTab}
          onClick={onClick}
        >
          {inner}
        </ExternalLink>
      ) : (
        <a href={c.href} className={styles["contact-row__link"]} onClick={onClick}>
          {inner}
        </a>
      )}
      <IconButton
        className={styles["contact-row__copy"]}
        aria-label={format(copied ? t.a11y.copied : t.a11y.copy, { label: c.label })}
        onClick={handleCopy}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </IconButton>
    </div>
  );
}
