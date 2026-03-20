import { useState } from "react";

export default function Testimonials({ testimonials = [], t }) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const testimonial = testimonials[current];

  const styles = {
    section: { padding: "3rem 0", textAlign: "center" },
    title: { marginBottom: "2rem", color: "var(--text)" },
    subtitle: { marginBottom: "2rem", color: "var(--text-muted)" },
    card: {
      maxWidth: "700px",
      margin: "0 auto",
      padding: "2rem",
      background: "var(--bg-card)",
      borderRadius: "1rem",
      minHeight: "200px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      border: "1px solid var(--border-soft)",
      boxShadow: "var(--shadow-soft)",
    },
    quote: {
      fontSize: "1.2rem",
      fontStyle: "italic",
      margin: "1rem 0",
      color: "var(--text)",
      lineHeight: 1.6,
    },
    authorWrap: { marginTop: "1.5rem", fontWeight: "bold", color: "var(--text)" },
    role: { fontSize: "0.9rem", color: "var(--text-muted)" },
    controls: { marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "center" },
    prevBtn: {
      padding: "0.5rem 1rem",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      border: "2px solid var(--primary)",
      background: "var(--bg-card)",
      color: "var(--primary)",
      cursor: "pointer",
      fontSize: "1.2rem",
    },
    pager: { display: "flex", alignItems: "center", minWidth: "100px", color: "var(--text-muted)" },
    nextBtn: {
      padding: "0.5rem 1rem",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      border: "2px solid var(--primary)",
      background: "var(--primary)",
      color: "#fff",
      cursor: "pointer",
      fontSize: "1.2rem",
    },
  };

  return (
    <section className="testimonials-section" style={styles.section}>
      <h2 style={styles.title}>{t?.testimonials?.title || "What People Say"}</h2>
      <p style={styles.subtitle}>{t?.testimonials?.subtitle || "Feedback from friends and mentors"}</p>

      <div className="testimonial-carousel" style={styles.card}>
        <blockquote style={styles.quote}>"{testimonial.message}"</blockquote>
        <div style={styles.authorWrap}>
          <p>{testimonial.author}</p>
          <p style={styles.role}>{testimonial.role || "Friend"}</p>
        </div>
      </div>

      <div style={styles.controls}>
        <button onClick={prev} className="carousel-btn prev" style={styles.prevBtn}>
          ?
        </button>
        <span style={styles.pager}>
          {current + 1} / {testimonials.length}
        </span>
        <button onClick={next} className="carousel-btn next" style={styles.nextBtn}>
          ?
        </button>
      </div>
    </section>
  );
}
