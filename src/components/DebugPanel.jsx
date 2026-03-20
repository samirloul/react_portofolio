import { useState, useEffect } from "react";

export default function DebugPanel({ t }) {
  const [feedback, setFeedback] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [visitors, setVisitors] = useState(null);
  const [ratings, setRatings] = useState({});
  const [showPanel, setShowPanel] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isCompact, setIsCompact] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const darkModePreference = window.matchMedia?.("(prefers-color-scheme: dark)").matches ||
      document.documentElement.style.colorScheme === "dark" ||
      document.body.classList.contains("dark");
    setIsDark(darkModePreference);
  }, []);

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const loadData = () => {
    const fb = JSON.parse(localStorage.getItem("portfolio_feedback") || "[]");
    const subs = JSON.parse(localStorage.getItem("newsletter_subscribers") || "[]");
    const vis = JSON.parse(localStorage.getItem("visitor_stats") || null);
    const rat = JSON.parse(localStorage.getItem("project_ratings") || "{}");

    setFeedback(fb);
    setSubscribers(subs);
    setVisitors(vis);
    setRatings(rat);
  };

  const clearAll = () => {
    if (confirm("Delete all test data from localStorage?")) {
      localStorage.removeItem("portfolio_feedback");
      localStorage.removeItem("newsletter_subscribers");
      localStorage.removeItem("visitor_stats");
      localStorage.removeItem("project_ratings");
      loadData();
    }
  };

  const copySubscribers = async () => {
    if (!subscribers.length) return;
    const text = subscribers.join(", ");
    try {
      await navigator.clipboard.writeText(text);
      alert("Subscribers copied to clipboard");
    } catch {
      alert("Copy failed. Use CSV export instead.");
    }
  };

  const exportSubscribersCsv = () => {
    if (!subscribers.length) return;
    const rows = ["email", ...subscribers];
    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "newsletter-subscribers.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const styles = {
    button: {
      position: "fixed",
      bottom: isCompact ? "20px" : "30px",
      right: isCompact ? "75px" : "100px",
      width: isCompact ? "45px" : "50px",
      height: isCompact ? "45px" : "50px",
      borderRadius: "50%",
       background: "#0ea5e9",
      color: "white",
      border: "none",
      cursor: "pointer",
      fontSize: isCompact ? "1rem" : "1.2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
       boxShadow: "0 8px 25px rgba(14, 165, 233, 0.4)",
      transition: "all 0.3s ease",
    },
    panel: {
      position: "fixed",
      bottom: isCompact ? "75px" : "100px",
      right: isCompact ? "12px" : "30px",
      left: isCompact ? "12px" : "auto",
      background: isDark ? "#1a1a2e" : "#fff",
       border: `2px solid ${isDark ? "#0ea5e9" : "#0ea5e9"}`,
      borderRadius: "1rem",
      padding: isCompact ? "1rem" : "1.5rem",
      maxWidth: isCompact ? "none" : "500px",
      maxHeight: "80vh",
      overflowY: "auto",
      zIndex: 999,
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
    },
    title: {
      color: isDark ? "#fff" : "#000",
      marginTop: 0,
      marginBottom: "1rem",
      borderBottom: `2px solid #6366f1`,
      paddingBottom: "0.5rem",
    },
    section: {
      marginBottom: "1.5rem",
    },
    sectionTitle: {
      color: isDark ? "#6366f1" : "#333",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      fontSize: "0.9rem",
    },
    dataText: {
      background: isDark ? "#2a2a3e" : "#f5f5f5",
      padding: "0.75rem",
      borderRadius: "0.5rem",
      fontSize: "0.85rem",
      color: isDark ? "#ccc" : "#333",
      wordBreak: "break-all",
      maxHeight: "150px",
      overflowY: "auto",
      fontFamily: "monospace",
    },
    button2: {
      padding: "0.5rem 1rem",
      background: "#6366f1",
      color: "white",
      border: "none",
      borderRadius: "0.5rem",
      cursor: "pointer",
      fontSize: "0.85rem",
      marginRight: "0.5rem",
      marginBottom: "0.5rem",
    },
    mailButton: {
      padding: "0.5rem 1rem",
      background: "#0ea5e9",
      color: "white",
      border: "none",
      borderRadius: "0.5rem",
      cursor: "pointer",
      fontSize: "0.85rem",
      marginRight: "0.5rem",
      marginBottom: "0.5rem",
    },
    dangerButton: {
      padding: "0.5rem 1rem",
      background: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "0.5rem",
      cursor: "pointer",
      fontSize: "0.85rem",
      marginRight: "0.5rem",
      marginBottom: "0.5rem",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: isDark ? "#fff" : "#000",
      fontSize: "1.5rem",
      cursor: "pointer",
      position: "absolute",
      top: "1rem",
      right: "1rem",
    },
  };

  if (!showPanel) {
    return (
      <button
        style={styles.button}
        onClick={() => {
          setShowPanel(true);
          loadData();
        }}
         title="Debug Panel - View Test Data (Dev Only)"
      >
         ℹ️
      </button>
    );
  }

  return (
    <div style={styles.panel}>
      <button style={styles.closeButton} onClick={() => setShowPanel(false)}>
        ✕
      </button>
      <h3 style={styles.title}>Debug Panel 🔍</h3>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>📋 Feedback ({feedback.length})</div>
        {feedback.length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: isDark ? "#999" : "#666" }}>No feedback yet</p>
        ) : (
          <div style={styles.dataText}>
            {feedback.map((item, idx) => (
              <div key={idx}>
                ⭐ {item.rating} - "{item.message}" ({new Date(item.timestamp).toLocaleString()})
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>📧 Newsletter Subscribers ({subscribers.length})</div>
        {subscribers.length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: isDark ? "#999" : "#666" }}>No subscribers yet</p>
        ) : (
          <>
            <div style={styles.dataText}>
              {subscribers.map((email, idx) => (
                <div key={idx}>{idx + 1}. {email}</div>
              ))}
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <button style={styles.mailButton} onClick={copySubscribers}>
                📋 Copy Emails
              </button>
              <button style={styles.mailButton} onClick={exportSubscribersCsv}>
                ⬇️ Export CSV
              </button>
            </div>
          </>
        )}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>👥 Visitor Stats</div>
        {visitors ? (
          <div style={styles.dataText}>
            Today: {visitors.today || 0} | Total: {visitors.total || 0} | Last: {visitors.date}
          </div>
        ) : (
          <p style={{ fontSize: "0.9rem", color: isDark ? "#999" : "#666" }}>No data</p>
        )}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>⭐ Project Ratings</div>
        {Object.keys(ratings).length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: isDark ? "#999" : "#666" }}>No ratings yet</p>
        ) : (
          <div style={styles.dataText}>
            {Object.entries(ratings).map(([project, ratingsList]) => (
              <div key={project}>
                <strong>{project}:</strong> {ratingsList.join(", ")}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <button style={styles.button2} onClick={loadData}>
          🔄 Refresh
        </button>
        <button style={styles.dangerButton} onClick={clearAll}>
          🗑️ Clear All
        </button>
      </div>

      <p style={{ fontSize: "0.75rem", color: isDark ? "#666" : "#999", marginTop: "1rem" }}>
        This panel is for development/testing only. Remove before production.
      </p>
    </div>
  );
}
