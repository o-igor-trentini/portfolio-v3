"use client";

import { useState } from "react";
import Link from "next/link";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { BurgerIcon, CloseIcon, MoonIcon, SunIcon } from "@/components/ui/Icons";
import { IconButton } from "@/components/ui/IconButton";
import { trackLanguageSwitch } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { locales } from "@/lib/locale";
import { NAV_ITEMS } from "@/lib/nav";
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
      {NAV_ITEMS.map((item) => (
        <a key={item.id} href={`#${item.id}`} className={styles.navlink} onClick={closeMenu}>
          {t.nav[item.label]}
        </a>
      ))}
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
              href={locales.en.path}
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
              href={locales.pt.path}
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
