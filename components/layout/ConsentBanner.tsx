"use client";

import { useEffect, useState } from "react";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { siteConfig } from "@/site.config";
import { applyConsent, getConsent, storeConsent, type ConsentValue } from "@/lib/consent";
import styles from "./ConsentBanner.module.css";

/**
 * Consent Mode v2 banner. Analytics defaults to `denied` (see RootShell); this
 * bilingual banner lets the visitor grant consent. It only appears when GA is
 * configured and no decision has been stored yet. Returning visitors who
 * accepted previously have their grant re-applied silently.
 */
export function ConsentBanner() {
  const { t } = usePortfolio();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!siteConfig.gaId) return;
    const decision = getConsent();
    if (decision === "granted") {
      applyConsent("granted");
    } else if (decision === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only reveal after reading storage
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const decide = (value: ConsentValue) => {
    storeConsent(value);
    if (value === "granted") applyConsent("granted");
    setShow(false);
  };

  return (
    <div className={styles.consent} role="dialog" aria-label={t.a11y.consent} aria-live="polite">
      <p className={styles.consent__message}>{t.consent.message}</p>
      <div className={styles.consent__actions}>
        <button
          type="button"
          className={styles["consent__btn--decline"]}
          onClick={() => decide("denied")}
        >
          {t.consent.decline}
        </button>
        <button
          type="button"
          className={styles["consent__btn--accept"]}
          onClick={() => decide("granted")}
        >
          {t.consent.accept}
        </button>
      </div>
    </div>
  );
}
