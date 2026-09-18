import { useEffect, useMemo, useState } from "react";

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

function jsonHeaders(extra = {}) {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...extra,
  };
}

export default function Admin() {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [user, setUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState(null);
  const [activeTab, setActiveTab] = useState("subscribers");
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [subscribersData, setSubscribersData] = useState({ items: [], page: 1, pageSize: 10, total: 0 });
  const [feedbackData, setFeedbackData] = useState({ items: [], page: 1, pageSize: 10, total: 0 });
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastStatus, setBroadcastStatus] = useState("");

  useEffect(() => {
    let ignore = false;

    const checkSession = async () => {
      try {
        const response = await fetch(`${API_ROOT}/admin/me`, { credentials: "include" });
        const text = await response.text();
        const data = safeJsonParse(text);

        if (!response.ok || !data?.ok) {
          return;
        }

        if (!ignore) {
          setUser(data.user || null);
          setCsrfToken(data.csrfToken || "");
        }
      } catch {
        // Ignore and show login form when session is unavailable.
      }
    };

    checkSession();
    return () => {
      ignore = true;
    };
  }, []);

  const isLoggedIn = useMemo(() => !!user, [user]);

  const loadOverview = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_ROOT}/admin/overview`, {
        credentials: "include",
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

  const loadSubscribers = async ({
    page = subscribersData.page || 1,
    pageSize = subscribersData.pageSize || 10,
    search = subscriberSearch,
  } = {}) => {
    if (!isLoggedIn) return;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search,
      });
      const response = await fetch(`${API_ROOT}/admin/subscribers?${params.toString()}`, {
        credentials: "include",
      });
      const text = await response.text();
      const data = safeJsonParse(text);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || `Request failed (${response.status})`);
      }

      setSubscribersData({
        items: data.items || [],
        total: data.total || 0,
        page: data.page || page,
        pageSize: data.pageSize || pageSize,
      });
    } catch (err) {
      setError(err?.message || "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const loadFeedback = async ({
    page = feedbackData.page || 1,
    pageSize = feedbackData.pageSize || 10,
    search = feedbackSearch,
  } = {}) => {
    if (!isLoggedIn) return;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search,
      });
      const response = await fetch(`${API_ROOT}/admin/feedback?${params.toString()}`, {
        credentials: "include",
      });
      const text = await response.text();
      const data = safeJsonParse(text);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || `Request failed (${response.status})`);
      }

      setFeedbackData({
        items: data.items || [],
        total: data.total || 0,
        page: data.page || page,
        pageSize: data.pageSize || pageSize,
      });
    } catch (err) {
      setError(err?.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    loadOverview();
    loadSubscribers({ page: 1, pageSize: 10, search: "" });
    loadFeedback({ page: 1, pageSize: 10, search: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const onLogin = async (e) => {
    e.preventDefault();
    const cleanUsername = usernameInput.trim();
    const cleanPassword = passwordInput;

    if (!cleanUsername || !cleanPassword) {
      setError("Please enter your admin username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_ROOT}/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: jsonHeaders(),
        body: JSON.stringify({
          username: cleanUsername,
          password: cleanPassword,
        }),
      });

      const text = await response.text();
      const data = safeJsonParse(text);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || `Login failed (${response.status})`);
      }

      setUser(data.user || { username: cleanUsername });
      setCsrfToken(data.csrfToken || "");
      setUsernameInput("");
      setPasswordInput("");
    } catch (err) {
      setUser(null);
      setError(err?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_ROOT}/admin/logout`, {
        method: "POST",
        credentials: "include",
        headers: jsonHeaders({ "X-CSRF-Token": csrfToken }),
      });

      if (!response.ok) {
        const text = await response.text();
        const data = safeJsonParse(text);
        throw new Error(data?.error || `Logout failed (${response.status})`);
      }

      setUser(null);
      setCsrfToken("");
      setUsernameInput("");
      setPasswordInput("");
      setOverview(null);
      setSubscribersData({ items: [], page: 1, pageSize: 10, total: 0 });
      setFeedbackData({ items: [], page: 1, pageSize: 10, total: 0 });
      setBroadcastStatus("");
    } catch (err) {
      setError(err?.message || "Failed to log out");
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = async (endpoint, filename) => {
    if (!isLoggedIn) return;

    try {
      const response = await fetch(`${API_ROOT}${endpoint}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Download failed (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.message || "CSV export failed");
    }
  };

  const sendBroadcast = async (previewOnly) => {
    if (!isLoggedIn) return;

    if (!previewOnly) {
      const confirmed = window.confirm("Weet je zeker dat je dit naar alle abonnees wilt sturen?");
      if (!confirmed) {
        return;
      }
    }

    setBroadcastStatus("Sending...");

    try {
      const response = await fetch(`${API_ROOT}/admin/broadcast`, {
        method: "POST",
        credentials: "include",
        headers: jsonHeaders({ "X-CSRF-Token": csrfToken }),
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
        await loadOverview();
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
          Sign in with your admin username and password to manage subscribers, feedback, and broadcast updates.
        </p>

        <form onSubmit={onLogin} style={{ display: "grid", gap: "0.75rem" }}>
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Admin username"
            autoComplete="username"
          />
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Admin password"
            autoComplete="current-password"
          />
          <button className="btn primary" type="submit" style={{ width: "fit-content" }} disabled={loading}>
            {loading ? "Signing in..." : "Open Admin"}
          </button>
        </form>

        {error ? <p style={{ color: "var(--error)", marginTop: "1rem" }}>{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="container" style={{ maxWidth: "1100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <h1 style={{ marginTop: 0, marginBottom: 0 }}>Admin Dashboard</h1>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button className="btn outline" type="button" onClick={() => loadOverview()}>
            Refresh
          </button>
          <button className="btn outline" type="button" onClick={() => downloadCsv("/admin/export/subscribers.csv", "subscribers.csv")}>
            Export Subscribers
          </button>
          <button className="btn outline" type="button" onClick={() => downloadCsv("/admin/export/feedback.csv", "feedback.csv")}>
            Export Feedback
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

          <div style={{ marginTop: "2rem", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <button
                className={activeTab === "subscribers" ? "btn primary" : "btn outline"}
                type="button"
                onClick={() => setActiveTab("subscribers")}
              >
                Subscribers
              </button>
              <button
                className={activeTab === "feedback" ? "btn primary" : "btn outline"}
                type="button"
                onClick={() => setActiveTab("feedback")}
              >
                Feedback
              </button>
            </div>

            {activeTab === "subscribers" ? (
              <div>
                <h2 style={{ marginTop: 0 }}>Subscribers</h2>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
                  <input
                    type="text"
                    value={subscriberSearch}
                    onChange={(e) => setSubscriberSearch(e.target.value)}
                    placeholder="Search by email"
                    style={{ minWidth: "260px" }}
                  />
                  <button className="btn outline" type="button" onClick={() => loadSubscribers({ page: 1, search: subscriberSearch })}>
                    Search
                  </button>
                </div>

                {subscribersData.items.length ? (
                  <ul style={{ margin: 0, paddingInlineStart: "1.2rem" }}>
                    {subscribersData.items.map((item, idx) => (
                      <li key={`${item.email}-${idx}`}>
                        {item.email} - {item.subscribedAt || item.updatedAt}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, color: "var(--text-muted)" }}>No subscribers found.</p>
                )}

                <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    className="btn outline"
                    type="button"
                    disabled={subscribersData.page <= 1}
                    onClick={() => loadSubscribers({ page: subscribersData.page - 1 })}
                  >
                    Prev
                  </button>
                  <span>
                    Page {subscribersData.page} of {Math.max(1, Math.ceil((subscribersData.total || 0) / (subscribersData.pageSize || 10)))}
                  </span>
                  <button
                    className="btn outline"
                    type="button"
                    disabled={subscribersData.page >= Math.ceil((subscribersData.total || 0) / (subscribersData.pageSize || 10))}
                    onClick={() => loadSubscribers({ page: subscribersData.page + 1 })}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 style={{ marginTop: 0 }}>Feedback</h2>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
                  <input
                    type="text"
                    value={feedbackSearch}
                    onChange={(e) => setFeedbackSearch(e.target.value)}
                    placeholder="Search in feedback"
                    style={{ minWidth: "260px" }}
                  />
                  <button className="btn outline" type="button" onClick={() => loadFeedback({ page: 1, search: feedbackSearch })}>
                    Search
                  </button>
                </div>

                {feedbackData.items.length ? (
                  <ul style={{ margin: 0, paddingInlineStart: "1.2rem" }}>
                    {feedbackData.items.map((item, idx) => (
                      <li key={`${item.createdAt || idx}-${idx}`}>
                        {item.rating}/5 - {item.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, color: "var(--text-muted)" }}>No feedback found.</p>
                )}

                <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    className="btn outline"
                    type="button"
                    disabled={feedbackData.page <= 1}
                    onClick={() => loadFeedback({ page: feedbackData.page - 1 })}
                  >
                    Prev
                  </button>
                  <span>
                    Page {feedbackData.page} of {Math.max(1, Math.ceil((feedbackData.total || 0) / (feedbackData.pageSize || 10)))}
                  </span>
                  <button
                    className="btn outline"
                    type="button"
                    disabled={feedbackData.page >= Math.ceil((feedbackData.total || 0) / (feedbackData.pageSize || 10))}
                    onClick={() => loadFeedback({ page: feedbackData.page + 1 })}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}
