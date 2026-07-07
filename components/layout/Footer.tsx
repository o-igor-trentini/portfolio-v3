"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { OpenTerminalButton } from "@/components/ui/OpenTerminalButton";
import styles from "./Footer.module.css";

export function Footer() {
  const { t } = usePortfolio();
  return (
    <footer className={styles["site-footer"]}>
      <div className={styles["site-footer__inner"]}>
        <span className={styles["site-footer__built"]}>{t.footer.built}</span>
        <OpenTerminalButton
          source="footer"
          label={t.footer.terminalBtn}
          className={styles["term-btn"]}
          glyphClassName="accent"
        />
      </div>
    </footer>
  );
}
