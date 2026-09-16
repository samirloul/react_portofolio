import React from "react";
import "../styles/skills.css";
import PageVisual from "../components/PageVisual.jsx";

export default function Skills({ t }) {
  const { skills } = t;

  if (!skills) return null;

  const skillCategories = [
    { key: "backend", icon: "fas fa-server" },
    { key: "frontend", icon: "fas fa-palette" },
    { key: "security", icon: "fas fa-shield-alt" },
    { key: "learning", icon: "fas fa-brain" },
    { key: "tools", icon: "fas fa-hammer" },
  ];

  return (
    <section className="tech-skills-section page-section">
      <PageVisual
        image="/fotos/vaardigeheden.png"
        className="skills-visual"
        eyebrow="Skills"
        title={skills.title}
        text={skills.visualText}
      />
      <div className="container">
        <div className="tech-skills-grid">
          {skillCategories.map((category) => {
            const categoryData = skills[category.key];
            if (!categoryData) return null;
            return (
              <div key={category.key} className="tech-skill-card fade-in-up">
                <div className="tech-skill-icon">
                  <i className={category.icon}></i>
                </div>
                <h3>{categoryData.title}</h3>
                <div className="tech-skill-meter" aria-hidden="true"><span /></div>
                <ul className="tech-skill-list">
                  {categoryData.items.map((item, idx) => (
                    <li key={idx} className="tech-skill-item">
                      <span className="tech-skill-badge">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
