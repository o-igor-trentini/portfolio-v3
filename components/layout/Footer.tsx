"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { Button } from "@/components/ui/Button";
import styles from "./Footer.module.css";

export function Footer() {
  const { t, openTerm } = usePortfolio();
  return (
    <footer className={styles["site-footer"]}>
      <div className={styles["site-footer__inner"]}>
        <span className={styles["site-footer__built"]}>{t.footer.built}</span>
        <Button className={styles["term-btn"]} onClick={() => openTerm("footer")}>
          <span className="accent">&gt;_</span>
          {t.footer.terminalBtn}
        </Button>
      </div>
    </footer>
  );
}
