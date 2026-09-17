import { useState, useEffect } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const API_ROOT = API_BASE_URL
  ? API_BASE_URL.endsWith("/api")
    ? API_BASE_URL
    : `${API_BASE_URL}/api`
  : "/api";

function safeJsonParse(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export default function NewsletterSignup({ t, lang = "en" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkModePreference = window.matchMedia?.("(prefers-color-scheme: dark)").matches ||
      document.documentElement.style.colorScheme === "dark" ||
      document.body.classList.contains("dark");
    setIsDark(darkModePreference);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage(t?.newsletter?.error || "Please enter a valid email");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch(`${API_ROOT}/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          lang,
          website: "",
        }),
      });

      const text = await response.text();
      const data = safeJsonParse(text);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || `Request failed (${response.status})`);
      }

      setStatus("success");
      setMessage(t?.newsletter?.success || "Thank you for subscribing!");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      setStatus("error");
      setMessage(error?.message || "Server error");
    }
  };

  const styles = {
    container: {
      padding: "2rem",
      background: "var(--bg-card)",
      borderRadius: "1rem",
      margin: "2rem 0",
      border: "1px solid var(--border-soft)",
    },
    title: {
      color: "var(--text-strong)",
    },
    subtitle: {
      color: "var(--text-muted)",
      marginBottom: "1.5rem",
    },
    form: {
      display: "flex",
      gap: "0.5rem",
      flexWrap: "wrap",
    },
    input: {
      flex: 1,
      minWidth: "200px",
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      border: "2px solid var(--input-border)",
      background: "var(--input-bg)",
      color: "var(--text)",
      fontFamily: "inherit",
    },
    button: {
      padding: "0.75rem 1.5rem",
      background: "var(--gradient-primary)",
      color: "var(--text-strong)",
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
    errorMsg: {
      color: isDark ? "#f87171" : "#dc3545",
      marginTop: "0.5rem",
    },
  };

  return (
    <section className="newsletter-signup" style={styles.container}>
      <h3 style={styles.title}>{t?.newsletter?.title || "Stay Updated"}</h3>
      <p style={styles.subtitle}>{t?.newsletter?.subtitle || "Get notified about new projects"}</p>

      {status === "success" ? (
        <div style={styles.successMsg}>
          ✓ {message}
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t?.newsletter?.placeholder || "your@email.com"}
              style={styles.input}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                ...styles.button,
                opacity: status === "loading" ? 0.7 : 1,
                cursor: status === "loading" ? "not-allowed" : "pointer",
              }}
            >
              {status === "loading" ? "..." : t?.newsletter?.subscribe || "Subscribe"}
            </button>
          </form>
          {status === "error" && <p style={styles.errorMsg}>⚠️ {message}</p>}
        </>
      )}
    </section>
  );
}
