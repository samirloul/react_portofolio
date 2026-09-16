import { useEffect, useRef, useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { translations } from "./i18n";
import "./animations.css";
import "./styles/animations-components.css";
import "./styles/skills.css";
import "./styles/fun-facts.css";
import "./styles/about-timeline.css";
import "./styles/new-features.css";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Skills from "./pages/Skills.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Experience from "./pages/Experience.jsx";
import Learning from "./pages/Learning.jsx";
import Goals from "./pages/Goals.jsx";
import Services from "./pages/Services.jsx";
import Privacy from "./pages/Privacy.jsx";
import ResponsibleDisclosure from "./pages/ResponsibleDisclosure.jsx";
import Cv from "./pages/Cv.jsx";
import Contact from "./pages/Contact.jsx";
import StartProject from "./pages/StartProject.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import Admin from "./pages/Admin.jsx";
import BackToTop from "./components/BackToTop.jsx";
import FloatingContactButton from "./components/FloatingContactButton.jsx";
import DebugPanel from "./components/DebugPanel.jsx";

export default function App() {
  const location = useLocation();
  const previousRouteRef = useRef(null);

  const [lang, setLang] = useState(() => {
    const requestedLang = new URLSearchParams(location.search).get("lang");
    return translations[requestedLang] ? requestedLang : localStorage.getItem("portfolio-lang") || "en";
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
  }, [lang, t.dir]);

  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  
  useEffect(() => {
    let title = "Samir Loul - Developer Portfolio";
    let description =
      "Portfolio website of Samir Loul, web developer, software developer and React developer.";

    const routeCopy = {
      "/skills": {
        en: ["Skills - Samir Loul", "Explore Samir Loul's technical skills in frontend, backend, PHP, Laravel, React and secure web development."],
        nl: ["Vaardigheden - Samir Loul", "Bekijk de technische vaardigheden van Samir Loul in frontend, backend, PHP, Laravel, React en veilige webontwikkeling."],
        ar: ["مهارات سمير لول التقنية", "استكشف مهارات سمير لول في تطوير الواجهات والخلفيات وPHP وLaravel وReact وتطوير الويب الآمن."],
      },
      "/experience": {
        en: ["Experience - Samir Loul", "Read about Samir Loul's software development internship, education and practical experience."],
        nl: ["Ervaring - Samir Loul", "Lees over de stage, opleiding en praktische ervaring van software developer Samir Loul."],
        ar: ["خبرة سمير لول", "تعرف على تدريب سمير لول وتعليمه وخبرته العملية في تطوير البرمجيات."],
      },
      "/learning": {
        en: ["Learning Now - Samir Loul", "See what Samir Loul is currently learning in software engineering, AI, cybersecurity and backend development."],
        nl: ["Leren - Samir Loul", "Bekijk wat Samir Loul momenteel leert over software engineering, AI, cybersecurity en backendontwikkeling."],
        ar: ["ما يتعلمه سمير لول الآن", "تعرف على ما يتعلمه سمير لول حاليًا في هندسة البرمجيات والذكاء الاصطناعي والأمن السيبراني."],
      },
      "/goals": {
        en: ["Goals - Samir Loul", "Discover Samir Loul's goals for software development, part-time HBO study, AI and cybersecurity."],
        nl: ["Doelen - Samir Loul", "Ontdek de doelen van Samir Loul voor softwareontwikkeling, een deeltijd HBO-opleiding, AI en cybersecurity."],
        ar: ["أهداف سمير لول", "تعرف على أهداف سمير لول في تطوير البرمجيات ودراسة HBO والذكاء الاصطناعي والأمن السيبراني."],
      },
      "/services": {
        en: ["Services - Samir Loul", "Web development services from Samir Loul, including portfolio websites, PHP, Laravel, databases and maintenance."],
        nl: ["Diensten - Samir Loul", "Webdevelopmentdiensten van Samir Loul voor portfolio’s, PHP, Laravel, databases en onderhoud."],
        ar: ["خدمات سمير لول", "خدمات تطوير الويب من سمير لول، بما في ذلك مواقع portfolio وPHP وLaravel وقواعد البيانات والصيانة."],
      },
      "/privacy": {
        en: ["Privacy - Samir Loul", "Read the privacy information for the Samir Loul portfolio website."],
        nl: ["Privacy - Samir Loul", "Lees de privacy-informatie van de portfolio website van Samir Loul."],
        ar: ["الخصوصية - سمير لول", "اقرأ معلومات الخصوصية الخاصة بموقع سمير لول الشخصي."],
      },
      "/responsible-disclosure": {
        en: ["Responsible Disclosure - Samir Loul", "Learn how to report a security issue responsibly on the Samir Loul portfolio website."],
        nl: ["Responsible Disclosure - Samir Loul", "Lees hoe je veilig een beveiligingsprobleem op de website van Samir Loul meldt."],
        ar: ["الإفصاح المسؤول - سمير لول", "تعرف على طريقة الإبلاغ المسؤول عن مشكلة أمنية في موقع سمير لول."],
      },
    };

    const localizedRouteCopy = routeCopy[location.pathname]?.[lang];
    if (localizedRouteCopy) {
      [title, description] = localizedRouteCopy;
    }

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
    } else if (location.pathname === "/start-project") {
      if (lang === "ar") {
        title = "ابدأ مشروعك - سمير لول";
        description = "ابدأ طلب موقعك عبر نموذج ذكي من 5 خطوات لتحديد احتياجاتك بدقة.";
      } else if (lang === "nl") {
        title = "Start Project - Samir Loul";
        description = "Start je website project via een slimme 5-stappen intake.";
      } else {
        title = "Start Project - Samir Loul";
        description = "Start your website project using a smart 5-step intake form.";
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

    if (location.pathname.startsWith("/projects/") || location.pathname.startsWith("/blog/")) {
      if (location.pathname.startsWith("/projects/")) {
        title = lang === "nl" ? "Projectdetail - Samir Loul" : lang === "ar" ? "تفاصيل المشروع - سمير لول" : "Project Detail - Samir Loul";
        description = lang === "nl" ? "Bekijk de technologie, aanpak en lessen achter een project van Samir Loul." : lang === "ar" ? "تعرف على التقنيات وطريقة العمل والدروس خلف أحد مشاريع سمير لول." : "Explore the technology, approach and lessons behind a project by Samir Loul.";
      } else {
        title = lang === "nl" ? "Blog - Samir Loul" : lang === "ar" ? "مدونة سمير لول" : "Blog - Samir Loul";
        description = lang === "nl" ? "Artikelen over softwareontwikkeling, webdevelopment en de techreis van Samir Loul." : lang === "ar" ? "مقالات عن تطوير البرمجيات والويب ورحلة سمير لول التقنية." : "Articles about software development, web development and Samir Loul's tech journey.";
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

    [
      ["og:title", title],
      ["og:description", description],
      ["og:url", `https://samirprofile.com${location.pathname}`],
      ["twitter:title", title],
      ["twitter:description", description],
    ].forEach(([property, content]) => {
      const selector = property.startsWith("twitter:") ? `meta[name="${property}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(property.startsWith("twitter:") ? "name" : "property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    });

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://samirprofile.com${location.pathname === "/" ? "/" : location.pathname}`);

    document.querySelectorAll("link[data-dynamic-hreflang]").forEach((link) => link.remove());
    ["en", "nl", "ar"].forEach((alternateLang) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = alternateLang;
      link.href = `https://samirprofile.com${location.pathname === "/" ? "/" : location.pathname}?lang=${alternateLang}`;
      link.dataset.dynamicHreflang = "true";
      document.head.appendChild(link);
    });
    const defaultLink = document.createElement("link");
    defaultLink.rel = "alternate";
    defaultLink.hreflang = "x-default";
    defaultLink.href = `https://samirprofile.com${location.pathname === "/" ? "/" : location.pathname}`;
    defaultLink.dataset.dynamicHreflang = "true";
    document.head.appendChild(defaultLink);
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
          <NavLink to="/skills" className="nav-link" onClick={closeMenu}>
            {t.nav.skills}
          </NavLink>
          <NavLink to="/projects" className="nav-link" onClick={closeMenu}>
            {t.nav.projects}
          </NavLink>
          <NavLink to="/experience" className="nav-link" onClick={closeMenu}>
            {t.nav.experience}
          </NavLink>
          <NavLink to="/learning" className="nav-link" onClick={closeMenu}>
            {t.nav.learning}
          </NavLink>
          <NavLink to="/goals" className="nav-link" onClick={closeMenu}>
            {t.nav.goals}
          </NavLink>
          <NavLink to="/services" className="nav-link" onClick={closeMenu}>
            {t.nav.services}
          </NavLink>
          <NavLink to="/start-project" className="nav-link nav-link-cta" onClick={closeMenu}>
            {t.nav.startProject}
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
          <Route path="/skills" element={<Skills t={t} />} />
          <Route path="/projects" element={<Projects t={t} />} />
          <Route path="/projects/:slug" element={<ProjectDetail t={t} />} />
          <Route path="/experience" element={<Experience t={t} />} />
          <Route path="/learning" element={<Learning t={t} />} />
          <Route path="/goals" element={<Goals t={t} />} />
          <Route path="/services" element={<Services t={t} />} />
          <Route path="/privacy" element={<Privacy t={t} />} />
          <Route path="/responsible-disclosure" element={<ResponsibleDisclosure t={t} />} />
          <Route path="/cv" element={<Cv t={t} lang={lang} />} />
          <Route path="/contact" element={<Contact t={t} lang={lang} />} />
          <Route path="/start-project" element={<StartProject lang={lang} />} />
          <Route path="/blog/:slug" element={<BlogPost t={t} lang={lang} />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <BackToTop />
      <FloatingContactButton />
      <DebugPanel t={t} />
    </div>
  );
}
