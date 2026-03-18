import React from "react";
import "../styles/fun-facts.css";

export default function FunFacts({ t }) {
  const { funFacts } = t;

  if (!funFacts) return null;

  return (
    <section className="fun-facts-section">
      <div className="container">
        <h2 className="section-title">{funFacts.title}</h2>
        <div className="facts-grid">
          {funFacts.facts.map((fact, idx) => (
            <div
              key={idx}
              className="fact-card fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="fact-emoji">{fact.emoji}</div>
              <p className="fact-text">{fact.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
