import React from "react";
import profileImg from "../assets/samirHomePage.jpeg";
import FunFacts from "./FunFacts";

// Icons automatisch koppelen aan skill-titels
const getSkillIcon = (title) => {
  const t = title.toLowerCase();

  if (t.includes("program") || t.includes("برمج")) return "fas fa-code";
  if (t.includes("multi") || t.includes("meer") || t.includes("متعدد"))
    return "fas fa-language";
  if (t.includes("communic") || t.includes("تواصل")) return "fas fa-users";

  return "fas fa-lightbulb";
};

// Social Media (link + icon) komt vast uit deze lijst
const SOCIAL_LINKS = [
  { icon: "fab fa-twitter", href: "https://x.com/samirloul" },
  { icon: "fab fa-instagram", href: "https://www.instagram.com/samirloul/" },
  { icon: "fab fa-tiktok", href: "https://www.tiktok.com/@samirloul1" },
  { icon: "fab fa-snapchat", href: "https://snapchat.com/t/zMfZUL7e" },
  {
    icon: "fab fa-facebook",
    href:
      "https://www.facebook.com/people/Samir-Loul/pfbid035xjDjgASokyobu9dbAtg5zczRCQhtYJ3ageknwV28QKjwhtXcAZaxGmnjpfzWUSql/",
  },
  { icon: "fab fa-threads", href: "https://www.threads.net/@samirloul" },
];

const AboutPage = ({ t }) => {
  const { about } = t;

  return (
    <main className="about-page">
      {/* ========= HERO ========= */}
      <section className="about-hero">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h1 className="page-title">{about.title}</h1>
              <p className="about-intro">{about.intro}</p>
            </div>

            <div className="about-image">
              <img
                src={profileImg}
                alt="Samir Loul"
                className="about-profile-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========= EDUCATION ========= */}
      <section className="education">
        <div className="container">
          <h2 className="section-title">{about.educationTitle}</h2>

          <div className="timeline">
            {about.timeline.map((item, index) => {
              const isLast = index === about.timeline.length - 1;

              return (
                <div
                  key={item.years}
                  className={`timeline-item ${isLast ? "current" : ""}`}
                >
                  <div className="timeline-date">{item.years}</div>
                  <div className="timeline-content">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========= MORE ABOUT ME ========= */}
      <section className="personal">
        <div className="container">
          <h2 className="section-title">{about.moreTitle}</h2>

          <div className="personal-content">
            {about.moreParagraphs.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>

          {/* ========= SKILLS ========= */}
          <div className="skills-section">
            <h3>{about.skillsTitle}</h3>

            <div className="skills-grid">
              {about.skills.map((skill) => (
                <div className="skill-item" key={skill.title}>
                  <i className={getSkillIcon(skill.title)}></i>
                  <h4>{skill.title}</h4>
                  <p>{skill.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========= SOCIAL LINKS ========= */}
      <section className="social-section">
        <div className="container">
          <h3>{about.connectTitle}</h3>

          <div className="social-links">
            {SOCIAL_LINKS.map((social, i) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <i className={social.icon}></i>
                <span>{about.socials[i]}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <FunFacts t={t} />
    </main>
  );
};

export default AboutPage;
