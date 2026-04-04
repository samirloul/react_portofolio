// src/pages/Home.jsx
import samirPhoto from "../assets/samirHomePage.jpeg";
import { Link } from "react-router-dom";
import Skills from "./Skills";
import FunFacts from "./FunFacts";
import Counter from "../components/Counter";
import VisitorStats from "../components/VisitorStats";
import NewsletterSignup from "../components/NewsletterSignup";
import FeedbackForm from "../components/FeedbackForm";
import BlogPreview from "../components/BlogPreview";

const SOCIAL_LINKS = [
  { icon: "fa-brands fa-x-twitter", href: "https://x.com/samirloul", label: "X" },
  { icon: "fa-brands fa-instagram", href: "https://www.instagram.com/samirloul/", label: "Instagram" },
  { icon: "fa-brands fa-linkedin", href: "https://www.linkedin.com/in/samir-loul-083ab53b0/", label: "LinkedIn" },
  { icon: "fa-brands fa-tiktok", href: "https://www.tiktok.com/@samirloul1", label: "TikTok" },
  { icon: "fa-brands fa-snapchat", href: "https://snapchat.com/t/zMfZUL7e", label: "Snapchat" },
  {
    icon: "fa-brands fa-facebook-f",
    href: "https://www.facebook.com/people/Samir-Loul/pfbid035xjDjgASokyobu9dbAtg5zczRCQhtYJ3ageknwV28QKjwhtXcAZaxGmnjpfzWUSql/",
    label: "Facebook",
  },
  { icon: "fa-brands fa-threads", href: "https://www.threads.net/@samirloul", label: "Threads" },
];

export default function Home({ t, lang = "en" }) {

  const hero = t.hero;
  const fallbackStatsByLang = {
    en: {
      title: "My Journey in Numbers",
      items: [
        { label: "Projects Built", suffix: "+" },
        { label: "Years of Passion", suffix: "+" },
        { label: "Skills Mastered", suffix: "+" },
        { label: "Dedication", suffix: "%" },
      ],
    },
    ar: {
      title: "رحلتي في أرقام",
      items: [
        { label: "مشاريع منجزة", suffix: "+" },
        { label: "سنوات الشغف", suffix: "+" },
        { label: "مهارات متقنة", suffix: "+" },
        { label: "الالتزام", suffix: "%" },
      ],
    },
    nl: {
      title: "Mijn Reis in Getallen",
      items: [
        { label: "Projecten Gebouwd", suffix: "+" },
        { label: "Jaren Passie", suffix: "+" },
        { label: "Vaardigheden Beheerst", suffix: "+" },
        { label: "Inzet", suffix: "%" },
      ],
    },
  };

  const defaultStats = fallbackStatsByLang[lang] || fallbackStatsByLang.en;
  const stats = t?.stats || defaultStats;
  const statsItems = stats.items || defaultStats.items;

  return (
    <>
      <section className="hero">
        {/* Links: tekst */}
        <div className="hero-text">
          <p className="hero-sub">{hero.hello}</p>

          <h1 className="hero-title">
            {hero.hello} <span className="hero-name-highlight">{hero.name}</span>
          </h1>

          <h2 className="hero-role">{hero.role}</h2>
          <p className="hero-desc">{hero.text}</p>

          <div className="hero-buttons">
            <Link className="btn primary" to="/about">
              {hero.primaryButton}
            </Link>

            <Link className="btn outline" to="/contact">
              {hero.secondaryButton}
            </Link>
          </div>
        </div>

        {/* Rechts: foto + socials */}
        <div className="hero-right">
          <div className="hero-photo-outer">
            <div className="hero-photo-wrapper">
              <img src={samirPhoto} alt={lang === "ar" ? "سمير لول" : "Samir Loul"} className="hero-photo" />
            </div>
          </div>

          <div className="hero-social-row" aria-label="Social links">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="hero-social-circle"
                aria-label={s.label}
                title={s.label}
              >
                <i className={s.icon} aria-hidden="true"></i>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Skills t={t} />

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">{stats.title}</h2>
          <div className="stats-grid">
            <Counter end={3} duration={2500} label={statsItems[0].label} suffix={statsItems[0].suffix} />
            <Counter end={3} duration={2000} label={statsItems[1].label} suffix={statsItems[1].suffix} />
            <Counter end={8} duration={2500} label={statsItems[2].label} suffix={statsItems[2].suffix} />
            <Counter end={100} duration={2000} label={statsItems[3].label} suffix={statsItems[3].suffix} />
          </div>
        </div>
      </section>

      <FunFacts t={t} />

      {/* Visitor Stats */}
      <section className="container" style={{ marginTop: "3rem" }}>
        <VisitorStats t={t} />
      </section>

      {/* Blog Preview */}
      <section className="container" style={{ marginTop: "3rem" }}>
        <BlogPreview t={t} />
      </section>

      {/* Newsletter */}
      <section className="container" style={{ marginTop: "3rem" }}>
        <NewsletterSignup t={t} lang={lang} />
      </section>

      {/* Feedback Form */}
      <section className="container" style={{ marginTop: "3rem" }}>
        <FeedbackForm t={t} lang={lang} />
      </section>
    </>
  );
}
