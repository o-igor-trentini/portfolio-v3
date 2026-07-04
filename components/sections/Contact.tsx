"use client";

import { usePortfolio } from "../PortfolioProvider";
import { contacts } from "@/lib/content";

export function Contact() {
  const { t } = usePortfolio();
  return (
    <section id="contact" className="section">
      <div className="section__label">{"// "}{t.contact.label}</div>
      <p className="section__note">{t.contact.note}</p>
      <div className="contact__list">
        {contacts.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-row"
          >
            <span className="contact-row__label">{c.label}</span>
            <span className="contact-row__value">{c.value}</span>
            <span className="contact-row__ext">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
