// src/pages/Home.jsx
import samirPhoto from "../assets/samirHomePage.jpeg";
import { Link } from "react-router-dom";

const SOCIAL_LINKS = [
  { icon: "fa-brands fa-x-twitter", href: "https://x.com/samirloul", label: "X" },
  { icon: "fa-brands fa-instagram", href: "https://www.instagram.com/samirloul/", label: "Instagram" },
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
          <Link className="btn primary" to="/projects">
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
  );
}
