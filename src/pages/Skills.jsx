import React from "react";
import "../styles/skills.css";

export default function Skills({ t }) {
  const { skills } = t;

  if (!skills) return null;

  const skillCategories = [
    { key: "frontend", icon: "fas fa-palette" },
    { key: "backend", icon: "fas fa-server" },
    { key: "tools", icon: "fas fa-hammer" },
    { key: "soft", icon: "fas fa-brain" },
  ];

  return (
    <section className="tech-skills-section">
      <div className="container">
        <h2 className="section-title">{skills.title}</h2>
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
