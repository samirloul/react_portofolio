import { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { translations } from "./i18n";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Cv from "./pages/Cv.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("portfolio-lang") || "en";
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("portfolio-theme") || "light";
  });

  //  hamburger menu state
  const [menuOpen, setMenuOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem("portfolio-lang", lang);
    document.documentElement.setAttribute("dir", t.dir);
    document.documentElement.setAttribute("lang", lang);

    // als taal wisselt: menu dicht
    setMenuOpen(false);
  }, [lang, t.dir]);

  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  //  menu dicht bij resize naar desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-left">
          <span className="brand">{t.nav.name}</span>

          {/*  Hamburger (zichtbaar op mobiel via CSS) */}
          <button
            className="hamburger"
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((p) => !p)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/*  open class bepaalt of menu zichtbaar is op mobiel */}
        <nav className={`navbar-center ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={closeMenu}>
            {t.nav.home}
          </NavLink>
          <NavLink to="/about" className="nav-link" onClick={closeMenu}>
            {t.nav.about}
          </NavLink>
          <NavLink to="/projects" className="nav-link" onClick={closeMenu}>
            {t.nav.projects}
          </NavLink>
          <NavLink to="/cv" className="nav-link" onClick={closeMenu}>
            {t.nav.cv}
          </NavLink>
          <NavLink to="/contact" className="nav-link" onClick={closeMenu}>
            {t.nav.contact}
          </NavLink>
        </nav>

        <div className="navbar-right">
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en">EN</option>
            <option value="ar">AR</option>
            <option value="nl">NL</option>
          </select>

          <button
            className="theme-toggle"
            onClick={() =>
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
            type="button"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <main className="page">
        <Routes>
          <Route path="/" element={<Home t={t} />} />
          <Route path="/about" element={<About t={t} />} />
          <Route path="/projects" element={<Projects t={t} />} />
          <Route path="/cv" element={<Cv t={t} lang={lang} />} />
          <Route path="/contact" element={<Contact t={t} lang={lang} />} />
        </Routes>
      </main>
    </div>
  );
}
