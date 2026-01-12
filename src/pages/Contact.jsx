import { useMemo, useState } from "react";

const SOCIAL_LINKS = [
  { href: "https://x.com/samirloul", icon: "fa-brands fa-x-twitter" },
  { href: "https://www.instagram.com/samirloul/", icon: "fa-brands fa-instagram" },
  { href: "https://www.tiktok.com/@samirloul1", icon: "fa-brands fa-tiktok" },
  { href: "https://snapchat.com/t/zMfZUL7e", icon: "fa-brands fa-snapchat" },
  {
    href:
      "https://www.facebook.com/people/Samir-Loul/pfbid035xjDjgASokyobu9dbAtg5zczRCQhtYJ3ageknwV28QKjwhtXcAZaxGmnjpfzWUSql/",
    icon: "fa-brands fa-facebook-f",
  },
  { href: "https://www.threads.net/@samirloul", icon: "fa-brands fa-threads" },
];

const EMAIL_TO = "sameerloul2010@gmail.com";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeJsonParse(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export default function Contact({ t }) {
  const c = t.contact;

  const initial = useMemo(
    () => ({ name: "", email: "", subject: "", message: "", website: "" }),
    []
  );

  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [serverMsg, setServerMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const errors = useMemo(() => {
    const e = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name) e.name = "Required";
    if (!email) e.email = "Required";
    else if (!emailRegex.test(email)) e.email = "Invalid email";
    if (!message) e.message = "Required";
    else if (message.length < 10) e.message = "Message is too short (min 10 chars)";
    return e;
  }, [form]);

  const canSubmit = status !== "sending" && Object.keys(errors).length === 0;

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const onBlur = (key) => () =>
    setTouched((p) => ({ ...p, [key]: true }));

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_TO);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback: doe niks
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(errors).length > 0) return;

    // honeypot bots
    if (form.website) {
      setStatus("success");
      setServerMsg("");
      setForm(initial);
      setTouched({});
      return;
    }

    setStatus("sending");
    setServerMsg("");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      website: form.website || "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  name: form.name.trim(),
  email: form.email.trim(),
  subject: form.subject.trim(),
  message: form.message.trim(),
  website: form.website,
  lang: t.dir === "rtl" ? "ar" : /* of gebruik jouw state */ "en",
})
      });

      const text = await res.text();
      const data = safeJsonParse(text);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      setStatus("success");
      setForm(initial);
      setTouched({});
    } catch (err) {
      console.error(err);
      setStatus("error");
      setServerMsg(err?.message || "Server error");
    }
  };

  return (
    <section className="contact-page contact-v2">
      {/* HERO */}
      <header className="contact-hero">
        <div className="contact-hero-inner">
          <div className="contact-hero-badges">
            <span className="chip">
              <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              Secure form
            </span>
            <span className="chip">
              <i className="fa-solid fa-bolt" aria-hidden="true"></i>
              Reply in 24h
            </span>
            <span className="chip">
              <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
              {c.locationValue}
            </span>
          </div>

          <h1 className="contact-title">{c.title}</h1>
          <p className="contact-subtitle">{c.intro}</p>

          <div className="contact-quick-actions">
            <a className="quick-btn" href={`mailto:${EMAIL_TO}`} title="Email">
              <i className="fa-solid fa-envelope" aria-hidden="true"></i>
              <span>Email</span>
            </a>

            <button className="quick-btn" type="button" onClick={copyEmail}>
              <i className="fa-solid fa-copy" aria-hidden="true"></i>
              <span>{copied ? "Copied!" : "Copy email"}</span>
            </button>

            <a className="quick-btn" href="/cv" title="CV">
              <i className="fa-solid fa-file-arrow-down" aria-hidden="true"></i>
              <span>CV</span>
            </a>
          </div>
        </div>
      </header>

      <div className="contact-grid">
        {/* FORM */}
        <section className="contact-form-card">
          <div className="card-head">
            <div>
              <h2 className="section-subtitle">{c.formTitle}</h2>
              <p className="card-hint">
                Fill the form and I’ll reply as soon as possible.
              </p>
            </div>
            <div className="card-icon">
              <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {/* honeypot */}
            <input
              className="hp-field"
              type="text"
              name="website"
              value={form.website}
              onChange={onChange("website")}
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="form-row two">
              <label className="contact-field">
                <span>{c.fields.name} *</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={onChange("name")}
                  onBlur={onBlur("name")}
                  aria-invalid={touched.name && !!errors.name}
                  required
                  placeholder="Your name"
                />
                {touched.name && errors.name && (
                  <small className="field-error">{errors.name}</small>
                )}
              </label>

              <label className="contact-field">
                <span>{c.fields.email} *</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  onBlur={onBlur("email")}
                  aria-invalid={touched.email && !!errors.email}
                  required
                  placeholder="you@example.com"
                />
                {touched.email && errors.email && (
                  <small className="field-error">{errors.email}</small>
                )}
              </label>
            </div>

            <label className="contact-field">
              <span>{c.fields.subject}</span>
              <input
                type="text"
                value={form.subject}
                onChange={onChange("subject")}
                placeholder="(optional)"
              />
            </label>

            <label className="contact-field">
              <span>{c.fields.message} *</span>
              <textarea
                rows="7"
                value={form.message}
                onChange={onChange("message")}
                onBlur={onBlur("message")}
                aria-invalid={touched.message && !!errors.message}
                required
                placeholder="Write your message..."
              />
              <div className="field-footer">
                {touched.message && errors.message ? (
                  <small className="field-error">{errors.message}</small>
                ) : (
                  <small className="field-muted">
                    Tip: add your goal + deadline (if any).
                  </small>
                )}
                <small className="field-muted">{form.message.trim().length}/800</small>
              </div>
            </label>

            <button
              className="btn primary contact-submit"
              type="submit"
              disabled={!canSubmit}
            >
              <i
                className={`fas ${
                  status === "sending" ? "fa-spinner fa-spin" : "fa-paper-plane"
                }`}
                aria-hidden="true"
              />
              <span>{status === "sending" ? "Sending..." : c.sendButton}</span>
            </button>

            {/* Toast/status */}
            {status !== "idle" && (
              <div
                className={`contact-toast ${
                  status === "success"
                    ? "toast-success"
                    : status === "error"
                    ? "toast-error"
                    : "toast-sending"
                }`}
                role="status"
              >
                {status === "sending" && (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
                    <span>Sending your message…</span>
                  </>
                )}

                {status === "success" && (
                  <>
                    <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                    <span>Message sent! Check your inbox (and spam).</span>
                  </>
                )}

                {status === "error" && (
                  <>
                    <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
                    <span>{serverMsg || "Something went wrong."}</span>
                  </>
                )}
              </div>
            )}
          </form>
        </section>

        {/* SIDEBAR */}
        <aside className="contact-sidebar">
          <section className="contact-card">
            <h3>{c.infoTitle}</h3>

            <div className="contact-info-row">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fa-solid fa-envelope" aria-hidden="true" />
                </div>
                <div>
                  <div className="contact-info-label">{c.emailLabel}</div>
                  <div className="contact-info-value">
                    <a className="contact-email-link" href={`mailto:${EMAIL_TO}`}>
                      {EMAIL_TO}
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fa-solid fa-location-dot" aria-hidden="true" />
                </div>
                <div>
                  <div className="contact-info-label">{c.locationLabel}</div>
                  <div className="contact-info-value">{c.locationValue}</div>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fa-solid fa-clock" aria-hidden="true" />
                </div>
                <div>
                  <div className="contact-info-label">{c.responseLabel}</div>
                  <div className="contact-info-value">{c.responseValue}</div>
                </div>
              </div>
            </div>

            <div className="contact-mini-cta">
              <a className="btn outline w-full" href={`mailto:${EMAIL_TO}`}>
                <i className="fa-solid fa-envelope" aria-hidden="true"></i>
                <span>Email me</span>
              </a>
            </div>
          </section>

          <section className="contact-card">
            <h3>{c.followTitle}</h3>

            {/* speciaal blokje */}
            <div className="social-special">
              <div className="social-special-left">
                <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
              </div>
              <div className="social-special-right">
                <div className="social-special-title">Let’s connect</div>
                <div className="social-special-text">
                  Follow me for updates & new projects.
                </div>
              </div>
            </div>

            <div className="contact-social-grid">
              {SOCIAL_LINKS.map((s, idx) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-social-pill"
                  aria-label={c.socials[idx]}
                  title={c.socials[idx]}
                >
                  <span className="contact-social-icon">
                    <i className={s.icon} aria-hidden="true" />
                  </span>
                  <span className="contact-social-label">{c.socials[idx]}</span>
                  <span className="contact-social-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </section>

          <section className="contact-card">
            <h3>{c.faqTitle}</h3>
            <div className="contact-faq-list">
              {c.faqs.map((item, idx) => (
                <details key={idx} className="contact-faq-item">
                  <summary>
                    <span>{item.question}</span>
                    <i className="fa-solid fa-chevron-down" aria-hidden="true"></i>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
