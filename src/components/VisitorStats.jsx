import { useEffect, useState } from "react";

export default function VisitorStats({ t }) {
  const [stats, setStats] = useState({ today: 0, total: 0 });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for dark mode
    const darkModePreference = window.matchMedia?.("(prefers-color-scheme: dark)").matches ||
      document.documentElement.style.colorScheme === "dark" ||
      document.body.classList.contains("dark");
    setIsDark(darkModePreference);

    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("last_visit");
    const statsData = JSON.parse(localStorage.getItem("visitor_stats") || '{"today":0,"total":0,"date":""}');

    if (lastVisit !== today) {
      statsData.today = 1;
      statsData.total = (statsData.total || 0) + 1;
      statsData.date = today;
    } else {
      statsData.today = (statsData.today || 0) + 1;
    }

    localStorage.setItem("visitor_stats", JSON.stringify(statsData));
    localStorage.setItem("last_visit", today);
    setStats(statsData);
  }, []);

  const styles = {
    container: {
      padding: "1.5rem",
      background: isDark ? "#1a1a2e" : "#f8f8f8",
      borderRadius: "1rem",
      margin: "2rem 0",
      border: isDark ? "1px solid #444" : "1px solid #e0e0e0",
    },
    title: {
      color: isDark ? "#fff" : "#000",
      marginBottom: "1rem",
      fontSize: "1.1rem",
      fontWeight: "600",
    },
    statsRow: {
      display: "flex",
      gap: "2rem",
      marginTop: "1rem",
    },
    statBlock: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    statNumber: {
      fontSize: "2rem",
      fontWeight: "bold",
      margin: 0,
      color: isDark ? "#6366f1" : "#1a1a2e",
    },
    statLabel: {
      margin: 0,
      color: isDark ? "#aaa" : "#666",
      fontSize: "0.9rem",
    },
  };

  return (
    <div className="visitor-stats" style={styles.container}>
      <h4 style={styles.title}>{t?.visitorStats?.title || "Visitor Activity"}</h4>
      <div style={styles.statsRow}>
        <div style={styles.statBlock}>
          <p style={styles.statNumber}>{stats.today}</p>
          <p style={styles.statLabel}>{t?.visitorStats?.visitorsToday || "Today"}</p>
        </div>
        <div style={styles.statBlock}>
          <p style={styles.statNumber}>{stats.total}</p>
          <p style={styles.statLabel}>{t?.visitorStats?.visitorsTotal || "Total"}</p>
        </div>
      </div>
    </div>
  );
}
