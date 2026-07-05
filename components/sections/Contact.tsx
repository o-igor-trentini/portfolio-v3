"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Section } from "../ui/Section";
import { ExternalLink } from "../ui/ExternalLink";
import { contacts } from "@/lib/content";

export function Contact() {
  const { t } = usePortfolio();
  return (
    <Section id="contact" label={t.contact.label} note={t.contact.note}>
      <div className="contact__list">
        {contacts.map((c) => (
          <ExternalLink key={c.label} href={c.href} className="contact-row">
            <span className="contact-row__label">{c.label}</span>
            <span className="contact-row__value">{c.value}</span>
            <span className="contact-row__ext">↗</span>
          </ExternalLink>
        ))}
      </div>
    </Section>
  );
}
