import { useEffect, useRef, useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import Skills from "./pages/Skills.jsx";
import FunFacts from "./pages/FunFacts.jsx";
import { translations } from "./i18n";
import "./animations.css";
import "./styles/animations-components.css";
import "./styles/skills.css";
import "./styles/fun-facts.css";
import "./styles/about-timeline.css";
import "./styles/new-features.css";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Cv from "./pages/Cv.jsx";
import Contact from "./pages/Contact.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import Skills from "./pages/Skills.jsx";
import FunFacts from "./pages/FunFacts.jsx";
import BackToTop from "./components/BackToTop.jsx";
import FloatingContactButton from "./components/FloatingContactButton.jsx";
import DebugPanel from "./components/DebugPanel.jsx";

export default function App() {
  const location = useLocation();
  const previousRouteRef = useRef(null);

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
  useEffect(() => {
    let title = "Samir Loul - Developer Portfolio";
    let description =
      "Portfolio website of Samir Loul, web developer, software developer and React developer.";

    if (location.pathname === "/about") {
      if (lang === "ar") {
        title = "من أنا - سمير لول";
        description = "تعرف على سمير لول، مطور ويب ومطور برمجيات وخبراته ومهاراته.";
      } else if (lang === "nl") {
        title = "Over mij - Samir Loul";
        description = "Lees meer over Samir Loul, webontwikkelaar, software developer en zijn ervaring.";
      } else {
        title = "About - Samir Loul";
        description = "Learn more about Samir Loul, web developer, software developer and his experience.";
      }
    } else if (location.pathname === "/projects") {
      if (lang === "ar") {
        title = "المشاريع - سمير لول";
        description = "استكشف مشاريع سمير لول في تطوير الويب والبرمجة وReact.";
      } else if (lang === "nl") {
        title = "Projecten - Samir Loul";
        description = "Bekijk projecten van Samir Loul in webontwikkeling, programmeren en React.";
      } else {
        title = "Projects - Samir Loul";
        description = "Explore projects by Samir Loul in web development, programming and React.";
      }
    } else if (location.pathname === "/cv") {
      if (lang === "ar") {
        title = "السيرة الذاتية - سمير لول";
        description = "السيرة الذاتية لسمير لول، مطور ويب ومطور برمجيات.";
      } else if (lang === "nl") {
        title = "CV - Samir Loul";
        description = "Bekijk het cv van Samir Loul, webontwikkelaar en software developer.";
      } else {
        title = "CV - Samir Loul";
        description = "View the CV of Samir Loul, web developer and software developer.";
      }
    } else if (location.pathname === "/contact") {
      if (lang === "ar") {
        title = "تواصل - سمير لول";
        description = "تواصل مع سمير لول لمشاريع تطوير الويب والبرمجة.";
      } else if (lang === "nl") {
        title = "Contact - Samir Loul";
        description = "Neem contact op met Samir Loul voor webdevelopment en programmeerprojecten.";
      } else {
        title = "Contact - Samir Loul";
        description = "Contact Samir Loul for web development and programming projects.";
      }
    } else {
      if (lang === "ar") {
        title = "سمير لول - الملف الشخصي لمطور ويب";
        description = "الموقع الشخصي لسمير لول، مطور ويب ومطور برمجيات باستخدام React وJavaScript.";
      } else if (lang === "nl") {
        title = "Samir Loul - Portfolio van webontwikkelaar";
        description = "Portfolio van Samir Loul, webontwikkelaar en software developer met React en JavaScript.";
      } else {
        title = "Samir Loul - Developer Portfolio";
        description = "Portfolio website of Samir Loul, web developer, software developer and React developer.";
      }
    }

    document.title = title;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);
  }, [lang, location.pathname]);
  // Scroll behavior:
  // - Initial load / browser refresh: keep browser-native restored position.
  // - Client-side route change: scroll to top.
  useEffect(() => {
    window.history.scrollRestoration = "auto";

    const currentRouteKey = `${location.pathname}${location.search}${location.hash}`;
    if (previousRouteRef.current === null) {
      previousRouteRef.current = currentRouteKey;
      return;
    }

    if (previousRouteRef.current !== currentRouteKey) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      previousRouteRef.current = currentRouteKey;
    }
  }, [location.pathname, location.search, location.hash]);

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
          <Route path="/" element={<Home t={t} lang={lang} />} />
          <Route path="/about" element={<About t={t} />} />
          <Route path="/projects" element={<Projects t={t} />} />
          <Route path="/cv" element={<Cv t={t} lang={lang} />} />
          <Route path="/contact" element={<Contact t={t} lang={lang} />} />
          <Route path="/blog/:slug" element={<BlogPost t={t} lang={lang} />} />
        </Routes>
      </main>

      <BackToTop />
      <FloatingContactButton />
      <DebugPanel t={t} />
    </div>
  );
}
