"use client";

import { useState } from "react";
import Link from "next/link";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { BurgerIcon, CloseIcon, MoonIcon, SunIcon } from "@/components/ui/Icons";
import { IconButton } from "@/components/ui/IconButton";
import { trackLanguageSwitch } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import styles from "./Header.module.css";

export function Header() {
  const { handle, t, lang, isDark, toggleTheme } = usePortfolio();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const switchLang = (to: typeof lang) => {
    if (to !== lang) trackLanguageSwitch(to);
    closeMenu();
  };

  const links = (
    <>
      <a href="#about" className={styles.navlink} onClick={closeMenu}>
        {t.nav.about}
      </a>
      <a href="#experience" className={styles.navlink} onClick={closeMenu}>
        {t.nav.experience}
      </a>
      <a href="#langs" className={styles.navlink} onClick={closeMenu}>
        {t.nav.langs}
      </a>
      <a href="#stack" className={styles.navlink} onClick={closeMenu}>
        {t.nav.stack}
      </a>
      <a href="#projects" className={styles.navlink} onClick={closeMenu}>
        {t.nav.projects}
      </a>
      <a href="#certs" className={styles.navlink} onClick={closeMenu}>
        {t.nav.certs}
      </a>
      <a href="#contact" className={styles.navlink} onClick={closeMenu}>
        {t.nav.contact}
      </a>
    </>
  );

  return (
    <header className={styles["site-header"]}>
      <div className={styles["site-header__inner"]}>
        <a href="#top" className={styles.brand}>
          <span className={styles.brand__sigil}>~/</span>
          {handle}
        </a>

        <nav className={styles.nav}>
          <div className={styles["nav-links"]}>{links}</div>

          <div className={styles.langtoggle} role="group" aria-label="Language">
            <Link
              href="/"
              className={cx(
                styles.langtoggle__btn,
                lang === "en" && styles["langtoggle__btn--active"],
              )}
              aria-current={lang === "en" ? "true" : undefined}
              onClick={() => switchLang("en")}
            >
              en
            </Link>
            <Link
              href="/pt/"
              className={cx(
                styles.langtoggle__btn,
                lang === "pt" && styles["langtoggle__btn--active"],
              )}
              aria-current={lang === "pt" ? "true" : undefined}
              onClick={() => switchLang("pt")}
            >
              pt
            </Link>
          </div>

          <IconButton
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggleTheme}
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </IconButton>

          <IconButton
            className={styles["nav-burger"]}
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <CloseIcon /> : <BurgerIcon />}
          </IconButton>
        </nav>
      </div>

      {menuOpen && <div className={styles["mobile-menu"]}>{links}</div>}
    </header>
  );
}
