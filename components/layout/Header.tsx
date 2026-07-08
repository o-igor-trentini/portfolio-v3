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

          <div className={styles.langtoggle} role="group" aria-label={t.a11y.language}>
            {(["en", "pt"] as const).map((code) => (
              <Link
                key={code}
                href={locales[code].path}
                className={cx(
                  styles.langtoggle__btn,
                  lang === code && styles["langtoggle__btn--active"],
                )}
                aria-current={lang === code ? "true" : undefined}
                onClick={() => switchLang(code)}
              >
                {code}
              </Link>
            ))}
          </div>

          <IconButton
            aria-label={isDark ? t.a11y.themeToLight : t.a11y.themeToDark}
            onClick={toggleTheme}
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </IconButton>

          <IconButton
            className={styles["nav-burger"]}
            aria-label={t.a11y.menu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <CloseIcon /> : <BurgerIcon />}
          </IconButton>
        </nav>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className={styles["mobile-menu"]} aria-label={t.a11y.menu}>
          {links}
        </nav>
      )}
    </header>
  );
}
