"use client";

import { usePortfolio } from "@/components/providers/PortfolioProvider";

export function Footer() {
  const { t, openTerm } = usePortfolio();
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__built">{t.footer.built}</span>
        <button type="button" className="btn term-btn" onClick={openTerm}>
          <span className="accent">&gt;_</span>
          {t.footer.terminalBtn}
        </button>
      </div>
    </footer>
  );
}
