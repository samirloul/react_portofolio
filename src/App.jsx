import { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { translations, LANGS } from "./i18n";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Cv from "./pages/Cv.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
  // ✅ Initialiseer state vanuit localStorage (of gebruik defaults)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("portfolio-lang") || "en";
  });
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("portfolio-theme") || "light";
  });

  const t = translations[lang];

  // ✅ Sla taal op in localStorage wanneer deze verandert
  useEffect(() => {
    localStorage.setItem("portfolio-lang", lang);
    document.documentElement.setAttribute("dir", t.dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang, t.dir]);

  // ✅ Sla thema op in localStorage wanneer deze verandert
  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-left">
          <span className="brand">{t.nav.name}</span>
        </div>
        <nav className="navbar-center">
          <NavLink to="/" className="nav-link">
            {t.nav.home}
          </NavLink>
          <NavLink to="/about" className="nav-link">
            {t.nav.about}
          </NavLink>
          <NavLink to="/projects" className="nav-link">
            {t.nav.projects}
          </NavLink>
          <NavLink to="/cv" className="nav-link">
            {t.nav.cv}
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            {t.nav.contact}
          </NavLink>
        </nav>
        <div className="navbar-right">
          {/* taal switch */}
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en">EN</option>
            <option value="ar">AR</option>
            <option value="nl">NL</option>
          </select>

          {/* theme toggle */}
          <button
            className="theme-toggle"
            onClick={() =>
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
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
          {/* ✅ lang={lang} wordt doorgegeven voor de PDF downloads */}
          <Route path="/cv" element={<Cv t={t} lang={lang} />} />
          <Route path="/contact" element={<Contact t={t} />} />
        </Routes>
      </main>
    </div>
  );
}