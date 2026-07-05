"use client";

import { useState } from "react";
import { usePortfolio } from "./PortfolioProvider";
import { BurgerIcon, CloseIcon, MoonIcon, SunIcon } from "./Icons";

export function Header() {
  const { handle, t, lang, setLang, isDark, toggleTheme, showProjects, showCerts } = usePortfolio();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const links = (
    <>
      <a href="#about" className="navlink" onClick={closeMenu}>{t.nav.about}</a>
      <a href="#experience" className="navlink" onClick={closeMenu}>{t.nav.experience}</a>
      <a href="#langs" className="navlink" onClick={closeMenu}>{t.nav.langs}</a>
      <a href="#stack" className="navlink" onClick={closeMenu}>{t.nav.stack}</a>
      {showProjects && <a href="#projects" className="navlink" onClick={closeMenu}>{t.nav.projects}</a>}
      {showCerts && <a href="#certs" className="navlink" onClick={closeMenu}>{t.nav.certs}</a>}
      <a href="#contact" className="navlink" onClick={closeMenu}>{t.nav.contact}</a>
    </>
  );

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#top" className="brand">
          <span className="brand__sigil">~/</span>
          {handle}
        </a>

        <nav className="nav">
          <div className="nav-links">{links}</div>

          <div className="langtoggle" role="group" aria-label="Language">
            <button
              type="button"
              className={`btn langtoggle__btn${lang === "en" ? " langtoggle__btn--active" : ""}`}
              aria-pressed={lang === "en"}
              onClick={() => setLang("en")}
            >
              en
            </button>
            <button
              type="button"
              className={`btn langtoggle__btn${lang === "pt" ? " langtoggle__btn--active" : ""}`}
              aria-pressed={lang === "pt"}
              onClick={() => setLang("pt")}
            >
              pt
            </button>
          </div>

          <button
            type="button"
            className="iconbtn"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggleTheme}
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </button>

          <button
            type="button"
            className="iconbtn nav-burger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <CloseIcon /> : <BurgerIcon />}
          </button>
        </nav>
      </div>

      {menuOpen && <div className="mobile-menu">{links}</div>}
    </header>
  );
}
