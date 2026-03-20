import { useState } from "react";

export default function ProjectRating({ projectId = "default", t }) {
  const [rating, setRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (value) => {
    setRating(value);
    // Store rating
    const allRatings = JSON.parse(localStorage.getItem("project_ratings") || "{}");
    if (!allRatings[projectId]) allRatings[projectId] = [];
    allRatings[projectId].push(value);
    localStorage.setItem("project_ratings", JSON.stringify(allRatings));
    
    setSubmitted(true);
    setTimeout(() => {
      setRating(null);
      setSubmitted(false);
    }, 2000);
  };

  const stars = [1, 2, 3, 4, 5];
  const hoverHint = t?.rating?.hoverHint || "Click a star to rate";
  const activeRating = hoverRating ?? rating;

  return (
    <div
      className="project-rating"
      style={{
        padding: "1rem",
        background: "var(--bg-card)",
        border: "1px solid var(--border-soft)",
        borderRadius: "0.9rem",
        margin: "1rem 0",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      {submitted ? (
        <p
          style={{
            margin: 0,
            padding: "0.65rem 0.75rem",
            borderRadius: "0.6rem",
            background: "rgba(16, 185, 129, 0.12)",
            color: "var(--success)",
            fontWeight: 600,
          }}
        >
          ✓ {t?.rating?.thanksForRating || "Thanks for rating!"}
        </p>
      ) : (
        <div>
          <h4 style={{ margin: "0 0 0.4rem", color: "var(--text)" }}>
            {t?.rating?.title || "Rate This Project"}
          </h4>
          <p style={{ margin: "0 0 0.7rem", color: "var(--text-muted)", fontSize: "0.86rem" }}>
            {hoverHint}
          </p>
          <div
            style={{ display: "flex", gap: "0.35rem", alignItems: "center", flexWrap: "wrap" }}
            onMouseLeave={() => setHoverRating(null)}
          >
            {stars.map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onFocus={() => setHoverRating(star)}
                onBlur={() => setHoverRating(null)}
                style={{
                  width: "2.3rem",
                  height: "2.3rem",
                  borderRadius: "0.6rem",
                  border: activeRating && activeRating >= star ? "1px solid #f59e0b" : "1px solid var(--border-soft)",
                  background:
                    activeRating && activeRating >= star
                      ? "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.08))"
                      : "var(--bg)",
                  color: activeRating && activeRating >= star ? "#f59e0b" : "var(--text-light)",
                  fontSize: "1.4rem",
                  lineHeight: 1,
                  cursor: "pointer",
                  transform: activeRating && activeRating >= star ? "translateY(-2px) scale(1.08)" : "translateY(0) scale(1)",
                  boxShadow: activeRating && activeRating >= star ? "0 8px 18px rgba(245, 158, 11, 0.28)" : "none",
                  textShadow: activeRating && activeRating >= star ? "0 0 12px rgba(245, 158, 11, 0.45)" : "none",
                  transition:
                    "transform 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, text-shadow 0.18s ease, background 0.18s ease",
                }}
                title={`Rate ${star} stars`}
                aria-label={`Rate ${star} stars`}
              >
                {activeRating && activeRating >= star ? "★" : "☆"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
