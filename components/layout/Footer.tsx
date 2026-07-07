"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useTerminalControls } from "@/components/providers/TerminalProvider";
import { Button } from "@/components/ui/Button";
import styles from "./Footer.module.css";

export function Footer() {
  const { t } = usePortfolio();
  const { openTerm } = useTerminalControls();
  return (
    <footer className={styles["site-footer"]}>
      <div className={styles["site-footer__inner"]}>
        <span className={styles["site-footer__built"]}>{t.footer.built}</span>
        <Button className={styles["term-btn"]} onClick={() => openTerm("footer")}>
          <span className="accent" aria-hidden="true">
            &gt;_
          </span>
          {t.footer.terminalBtn}
        </Button>
      </div>
    </footer>
  );
}
