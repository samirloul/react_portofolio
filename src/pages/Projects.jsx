// src/pages/Projects.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const TECH_ICONS = {
  HTML5: "fab fa-html5",
  CSS3: "fab fa-css3-alt",
  JavaScript: "fab fa-js-square",
  React: "fab fa-react",
  SQL: "fas fa-database",
  Git: "fab fa-git-alt",
  PHP: "fab fa-php",
  MySQL: "fas fa-database",
  Laravel: "fab fa-laravel",
  API: "fas fa-plug",
};

const isExternal = (href = "") => /^https?:\/\//i.test(href);
const isDisabled = (href) => !href || href === "#";

export default function Projects({ t }) {
  const p = t.projects;

  const technologies = useMemo(() => {
    const base = Array.isArray(p.technologies) ? p.technologies : [];
    // Zorg dat Laravel er altijd bij zit (zoals je al wilde)
    return Array.from(new Set([...base, "Laravel"]));
  }, [p.technologies]);

  return (
    <section className="projects-page">
      {/* Titel + intro */}
      <header className="projects-header">
        <h1 className="section-title">{p.title}</h1>
        <p className="lead center">{p.intro}</p>
      </header>

      {/* Project cards */}
      <div className="project-grid">
        {(p.cards || []).map((card) => (
          <article key={card.title} className="project-card">
            <div className="project-icon" aria-hidden="true">
              <i className={card.icon || "fas fa-code"} />
            </div>

            <h3 className="project-title">{card.title}</h3>
            <p className="project-text">{card.text}</p>

            {Array.isArray(card.tags) && card.tags.length > 0 && (
              <div className="project-tags">
                {card.tags.map((tag) => (
                  <span key={`${card.title}-${tag}`} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Links */}
            {Array.isArray(card.links) && card.links.length > 0 && (
              <div className="project-actions">
                {card.links.map((l) => {
                  const disabled = isDisabled(l.href);
                  const external = isExternal(l.href);

                  return (
                    <a
                      key={`${card.title}-${l.label}-${l.href}`}
                      className={`project-btn ${l.variant === "outline" ? "outline" : "primary"} ${
                        disabled ? "disabled" : ""
                      }`}
                      href={disabled ? undefined : l.href}
                      target={!disabled && external ? "_blank" : undefined}
                      rel={!disabled && external ? "noreferrer" : undefined}
                      aria-disabled={disabled}
                      onClick={(e) => {
                        if (disabled) e.preventDefault();
                      }}
                    >
                      <i className={l.icon || "fas fa-arrow-up-right-from-square"} aria-hidden="true" />
                      <span>{l.label}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Collaboration block */}
      <section className="collab-section">
        <h2 className="section-subtitle center">{p.collaborationTitle}</h2>
        <p className="lead center">{p.collaborationText}</p>

        <div className="collab-button-row">
          {/* interne route => Link */}
          <Link className="btn primary" to="/contact">
            {p.collaborationButton}
          </Link>
        </div>
      </section>

      {/* Technologies */}
      <section className="tech-section">
        <h2 className="section-subtitle center">{p.techTitle}</h2>

        <div className="tech-grid">
          {technologies.map((tech) => {
            const iconClass = TECH_ICONS[tech] || "fas fa-code";
            return (
              <div key={tech} className="tech-card">
                <span className="tech-icon" aria-hidden="true">
                  <i className={iconClass}></i>
                </span>
                <span className="tech-label">{tech}</span>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
