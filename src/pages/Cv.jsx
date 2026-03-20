// src/pages/Cv.jsx
import React, { useMemo } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDownload,
  FaGlobe,
  FaLightbulb,
  FaUsers,
  FaBullseye,
} from "react-icons/fa";

import cvEn from "../assets/cv-en.pdf";
import cvNl from "../assets/cv-nl.pdf";
import cvAr from "../assets/cv-ar.pdf";

const CV_PDFS = {
  en: { file: cvEn, name: "Samir_Loul_CV_EN.pdf" },
  nl: { file: cvNl, name: "Samir_Loul_CV_NL.pdf" },
  ar: { file: cvAr, name: "Samir_Loul_CV_AR.pdf" },
};

function getQualityIcon(keyOrIndex) {
  const k = String(keyOrIndex).toLowerCase();
  if (k.includes("culture") || k.includes("adapt")) return <FaGlobe />;
  if (k.includes("learn") || k.includes("continuous")) return <FaLightbulb />;
  if (k.includes("team") || k.includes("collab")) return <FaUsers />;
  if (k.includes("goal") || k.includes("focus")) return <FaBullseye />;
  return <FaBullseye />;
}

export default function Cv({ t, lang = "en" }) {
  const c = t.cv;

  // Fallbacks
  const emailLabel = c.emailLabel || "Email";
  const locationLabel = c.locationLabel || "Location";
  const locationValue = c.locationValue || c.location;

  const pdf = useMemo(() => CV_PDFS[lang] || CV_PDFS.en, [lang]);

  return (
    <section className="cv-page" dir={t.dir || "ltr"}>
      {/* Hero / header */}
      <header className="cv-header">
        <div className="cv-header-info">
          <h1 className="cv-name">{c.name}</h1>
          <p className="cv-subtitle">{c.subtitle}</p>

          <div className="cv-meta-row">
            <span>
              <FaMapMarkerAlt /> {c.location}
            </span>
            <span>
              <FaCalendarAlt /> {c.bornLabel}: {c.bornValue}
            </span>
          </div>
        </div>

        <div className="cv-download">
          <a href={pdf.file} download={pdf.name} className="btn primary">
            <FaDownload />
            <span style={{ marginInlineStart: "0.5rem" }}>{c.downloadLabel}</span>
          </a>

          <a
            href={pdf.file}
            target="_blank"
            rel="noreferrer"
            className="btn outline"
            style={{ marginTop: "0.6rem" }}
          >
            <span>Open PDF ({lang.toUpperCase()})</span>
          </a>
        </div>
      </header>

      {/* Layout: sidebar + main */}
      <div className="cv-layout">
        {/* SIDEBAR */}
        <aside className="cv-sidebar">
          <div className="cv-card">
            <h3>{c.contactTitle}</h3>
            <div className="cv-contact">
              <div className="contact-info-item">
                <div className="contact-info-icon"><FaEnvelope /></div>
                <div>
                  <div className="contact-info-label">{emailLabel}</div>
                  <div className="contact-info-value">{c.contactEmail}</div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon"><FaMapMarkerAlt /></div>
                <div>
                  <div className="contact-info-label">{locationLabel}</div>
                  <div className="contact-info-value">{locationValue}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="cv-card">
            <h3>{c.languagesTitle}</h3>
            <div className="cv-lang-list">
              {(c.languages || []).map((langItem) => (
                <div key={langItem.name}>
                  <div className="cv-lang-header">
                    <span>{langItem.name}</span>
                    <span className="cv-lang-level">{langItem.levelLabel}</span>
                  </div>
                  <div className="cv-lang-bar">
                    <div
                      className="cv-lang-bar-fill"
                      style={{ width: `${langItem.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cv-card">
            <h3>{c.techTitle}</h3>
            {(c.techGroups || []).map((group) => (
              <div key={group.title} className="cv-list-group">
                <h4>{group.title}</h4>
                <ul>
                  {(group.items || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="cv-card">
            <h3>{c.softTitle}</h3>
            <ul className="cv-soft-list">
              {(c.softSkills || []).map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        </aside>

        {/* MAIN COLUMN */}
        <main className="cv-main">
          <section className="cv-block">
            <h2>{c.summaryTitle}</h2>
            <p className="cv-summary">{c.summaryText}</p>
          </section>

          <section className="cv-block">
            <h2>{c.educationTitle}</h2>
            <div className="cv-edu-timeline">
              {(c.education || []).map((edu) => (
                <div key={edu.title} className="cv-edu-item">
                  <div className="cv-edu-year-dot">
                    <span className="dot" />
                    <span className="year-text">{edu.years}</span>
                  </div>
                  <div className="cv-edu-content">
                    <h3>{edu.title}</h3>
                    <p className="cv-edu-place">{edu.place}</p>
                    <p className="cv-edu-text">{edu.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="cv-block">
            <h2>{c.qualitiesTitle}</h2>
            <div className="cv-qualities-grid">
              {(c.qualities || []).map((q, idx) => (
                <div key={q.title} className="cv-quality-card">
                  <div className="quality-card-inner">
                    <span className="quality-icon">{getQualityIcon(q.icon ?? idx)}</span>
                    <div>
                      <h3>{q.title}</h3>
                      <p>{q.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}