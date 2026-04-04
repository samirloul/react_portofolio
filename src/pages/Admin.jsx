import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const API_ROOT = API_BASE_URL
  ? API_BASE_URL.endsWith("/api")
    ? API_BASE_URL
    : `${API_BASE_URL}/api`
  : "/api";

const TOKEN_KEY = "portfolio-admin-token";

function safeJsonParse(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

function authHeaders(token, withJson = false) {
  return {
    ...(withJson ? { "Content-Type": "application/json" } : {}),
    "x-admin-token": token,
  };
}

export default function Admin() {
  const [tokenInput, setTokenInput] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState(null);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastStatus, setBroadcastStatus] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY) || "";
    if (!saved) return;
    setToken(saved);
    setTokenInput(saved);
  }, []);

  const isLoggedIn = useMemo(() => !!token, [token]);

  const loadOverview = async (activeToken = token) => {
    if (!activeToken) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_ROOT}/admin/overview`, {
        headers: authHeaders(activeToken),
      });
      const text = await response.text();
      const data = safeJsonParse(text);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || `Request failed (${response.status})`);
      }

      setOverview(data);
    } catch (err) {
      setOverview(null);
      setError(err?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadOverview(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onLogin = (e) => {
    e.preventDefault();
    const clean = tokenInput.trim();
    if (!clean) {
      setError("Please enter admin token");
      return;
    }
    localStorage.setItem(TOKEN_KEY, clean);
    setToken(clean);
    setError("");
  };

  const onLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setTokenInput("");
    setOverview(null);
    setError("");
    setBroadcastStatus("");
  };

  const sendBroadcast = async (previewOnly) => {
    if (!token) return;

    setBroadcastStatus("Sending...");

    try {
      const response = await fetch(`${API_ROOT}/admin/broadcast`, {
        method: "POST",
        headers: authHeaders(token, true),
        body: JSON.stringify({
          subject: broadcastSubject,
          message: broadcastMessage,
          previewOnly,
        }),
      });

      const text = await response.text();
      const data = safeJsonParse(text);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || `Request failed (${response.status})`);
      }

      if (data.preview) {
        setBroadcastStatus(`Preview OK: ${data.totalRecipients} recipients`);
      } else {
        setBroadcastStatus(
          `Done: sent ${data.sent}/${data.totalRecipients} (${data.failed} failed)`
        );
      }
    } catch (err) {
      setBroadcastStatus(`Error: ${err?.message || "Broadcast failed"}`);
    }
  };

  if (!isLoggedIn) {
    return (
      <section className="container" style={{ maxWidth: "760px" }}>
        <h1 style={{ marginTop: 0 }}>Admin</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Login with your ADMIN_TOKEN to view subscribers, feedback, and send a project update email.
        </p>

        <form onSubmit={onLogin} style={{ display: "grid", gap: "0.75rem" }}>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Enter ADMIN_TOKEN"
          />
          <button className="btn primary" type="submit" style={{ width: "fit-content" }}>
            Open Admin
          </button>
        </form>

        {error ? <p style={{ color: "var(--error)", marginTop: "1rem" }}>{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="container" style={{ maxWidth: "1100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <h1 style={{ marginTop: 0, marginBottom: 0 }}>Admin Dashboard</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn outline" type="button" onClick={() => loadOverview()}>
            Refresh
          </button>
          <button className="btn outline" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: "var(--error)" }}>{error}</p> : null}

      {overview ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "12px", padding: "1rem" }}>
              <strong>Subscribers</strong>
              <p style={{ fontSize: "1.6rem", margin: "0.4rem 0 0" }}>{overview.counts?.subscribers || 0}</p>
            </div>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "12px", padding: "1rem" }}>
              <strong>Feedback Items</strong>
              <p style={{ fontSize: "1.6rem", margin: "0.4rem 0 0" }}>{overview.counts?.feedback || 0}</p>
            </div>
          </div>

          <div style={{ marginTop: "2rem", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "12px", padding: "1rem" }}>
            <h2 style={{ marginTop: 0 }}>Broadcast Update Email</h2>
            <p style={{ color: "var(--text-muted)" }}>
              Send one message to all subscribed emails when you publish a new project.
            </p>
            <div style={{ display: "grid", gap: "0.7rem" }}>
              <input
                type="text"
                value={broadcastSubject}
                onChange={(e) => setBroadcastSubject(e.target.value)}
                placeholder="Email subject"
              />
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Write your update message..."
                rows={6}
              />
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button className="btn outline" type="button" onClick={() => sendBroadcast(true)}>
                  Preview Recipients
                </button>
                <button className="btn primary" type="button" onClick={() => sendBroadcast(false)}>
                  Send To All Subscribers
                </button>
              </div>
              {broadcastStatus ? <p style={{ margin: 0 }}>{broadcastStatus}</p> : null}
            </div>
          </div>

          <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "12px", padding: "1rem" }}>
              <h2 style={{ marginTop: 0 }}>Recent Subscribers</h2>
              {overview.recentSubscribers?.length ? (
                <ul style={{ margin: 0, paddingInlineStart: "1.2rem" }}>
                  {overview.recentSubscribers.map((item, idx) => (
                    <li key={`${item.email}-${idx}`}>
                      {item.email} - {item.subscribedAt || item.updatedAt}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, color: "var(--text-muted)" }}>No subscribers yet.</p>
              )}
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "12px", padding: "1rem" }}>
              <h2 style={{ marginTop: 0 }}>Recent Feedback</h2>
              {overview.recentFeedback?.length ? (
                <ul style={{ margin: 0, paddingInlineStart: "1.2rem" }}>
                  {overview.recentFeedback.map((item, idx) => (
                    <li key={`${item.createdAt}-${idx}`}>
                      {item.rating}/5 - {item.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, color: "var(--text-muted)" }}>No feedback yet.</p>
              )}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
