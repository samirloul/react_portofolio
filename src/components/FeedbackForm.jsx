import { useState, useEffect } from "react";

export default function FeedbackForm({ t }) {
  const [feedback, setFeedback] = useState({ rating: 5, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkModePreference = window.matchMedia?.("(prefers-color-scheme: dark)").matches ||
      document.documentElement.style.colorScheme === "dark" ||
      document.body.classList.contains("dark");
    setIsDark(darkModePreference);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store feedback (in real app: send to backend)
    const allFeedback = JSON.parse(localStorage.getItem("portfolio_feedback") || "[]");
    allFeedback.push({ ...feedback, timestamp: new Date().toISOString() });
    localStorage.setItem("portfolio_feedback", JSON.stringify(allFeedback));
    
    setSubmitted(true);
    setTimeout(() => {
      setFeedback({ rating: 5, message: "" });
      setSubmitted(false);
    }, 2000);
  };

  const ratings = [
    { value: 5, label: t?.feedback?.excellent || "Excellent", emoji: "😍" },
    { value: 4, label: t?.feedback?.good || "Good", emoji: "😊" },
    { value: 3, label: t?.feedback?.average || "Average", emoji: "😐" },
    { value: 2, label: t?.feedback?.poor || "Poor", emoji: "😞" },
  ];

  const styles = {
    container: {
      boxSizing: "border-box",
      padding: "2rem",
      background: isDark ? "#1a1a2e" : "#f8f8f8",
      borderRadius: "0.5rem",
      margin: "1rem 0",
      border: isDark ? "1px solid #444" : "1px solid #e0e0e0",
    },
    title: {
      marginTop: 0,
      color: isDark ? "#fff" : "#000",
    },
    subtitle: {
      color: isDark ? "#aaa" : "#666",
      marginBottom: "1.5rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "0.5rem",
      display: "block",
      color: isDark ? "#fff" : "#000",
    },
    ratingContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "1rem",
    },
    ratingButton: (isActive) => ({
      padding: "0.75rem 1rem",
      border: `2px solid ${isActive ? "#6366f1" : isDark ? "#444" : "#ddd"}`,
      background: isActive ? "#6366f1" : isDark ? "#2a2a3e" : "white",
      color: isActive ? "white" : isDark ? "#fff" : "inherit",
      borderRadius: "0.5rem",
      cursor: "pointer",
      minWidth: 0,
      width: "100%",
      textAlign: "center",
      transition: "all 0.2s ease",
    }),
    textarea: {
      boxSizing: "border-box",
      width: "100%",
      minHeight: "100px",
      padding: "0.75rem",
      borderRadius: "0.5rem",
      border: `2px solid ${isDark ? "#444" : "#ddd"}`,
      background: isDark ? "#2a2a3e" : "white",
      color: isDark ? "#fff" : "#000",
      fontFamily: "inherit",
    },
    submitButton: {
      padding: "0.75rem 1.5rem",
      background: "#6366f1",
      color: "white",
      border: "none",
      borderRadius: "0.5rem",
      cursor: "pointer",
      fontWeight: "bold",
    },
    successMsg: {
      padding: "1rem",
      background: isDark ? "#1a4620" : "#d4edda",
      color: isDark ? "#4ade80" : "#155724",
      borderRadius: "0.5rem",
      marginBottom: "1rem",
      border: isDark ? "1px solid #22c55e" : "none",
    },
  };

  return (
    <section className="feedback-section" style={styles.container}>
      <h3 style={styles.title}>{t?.feedback?.title || "Quick Feedback"}</h3>
      <p style={styles.subtitle}>{t?.feedback?.subtitle || "Help me improve"}</p>

      {submitted ? (
        <div style={styles.successMsg}>
          ✓ {t?.feedback?.thanks || "Thank you for your feedback!"}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>
              {t?.feedback?.rating || "Rate this portfolio"}
            </label>
            <div style={styles.ratingContainer}>
              {ratings.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setFeedback({ ...feedback, rating: r.value })}
                  style={styles.ratingButton(feedback.rating === r.value)}
                >
                  {r.emoji} {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={styles.label}>
              {t?.feedback?.placeholder || "Your feedback"}
            </label>
            <textarea
              value={feedback.message}
              onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
              placeholder={t?.feedback?.placeholder || "Tell me what you think..."}
              style={styles.textarea}
            />
          </div>

          <button
            type="submit"
            style={styles.submitButton}
          >
            {t?.feedback?.submit || "Submit Feedback"}
          </button>
        </form>
      )}
    </section>
  );
}
