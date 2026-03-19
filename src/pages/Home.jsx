// src/pages/Home.jsx
import samirPhoto from "../assets/samirHomePage.jpeg";
import { Link } from "react-router-dom";
import Skills from "./Skills";
import FunFacts from "./FunFacts";
import Counter from "../components/Counter";

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

export default function Home({ t }) {
  const hero = t.hero;

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
              <img src={samirPhoto} alt={hero.name} className="hero-photo" />
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
          <h2 className="section-title">My Journey in Numbers</h2>
          <div className="stats-grid">
            <Counter end={5} duration={2500} label="Projects Built" suffix="+" />
            <Counter end={3} duration={2000} label="Years of Passion" suffix="+" />
            <Counter end={8} duration={2500} label="Skills Mastered" suffix="+" />
            <Counter end={100} duration={2000} label="Dedication %" />
          </div>
        </div>
      </section>

      <FunFacts t={t} />
    </>
  );
}
