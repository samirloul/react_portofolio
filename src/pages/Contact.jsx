import { useEffect, useMemo, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const SOCIAL_LINKS = [
  { href: "https://x.com/samirloul", icon: "fa-brands fa-x-twitter" },
  { href: "https://www.instagram.com/samirloul/", icon: "fa-brands fa-instagram" },
  { href: "https://www.linkedin.com/in/samir-loul-083ab53b0/", icon: "fa-brands fa-linkedin" },
  { href: "https://www.tiktok.com/@samirloul1", icon: "fa-brands fa-tiktok" },
  { href: "https://snapchat.com/t/zMfZUL7e", icon: "fa-brands fa-snapchat" },
  {
    href: "https://www.facebook.com/people/Samir-Loul/pfbid035xjDjgASokyobu9dbAtg5zczRCQhtYJ3ageknwV28QKjwhtXcAZaxGmnjpfzWUSql/",
    icon: "fa-brands fa-facebook-f",
  },
  { href: "https://www.threads.net/@samirloul", icon: "fa-brands fa-threads" },
];

const EMAIL_TO = "sameerloul2010@gmail.com";
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const MAX_MESSAGE_LENGTH = 800;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

function safeJsonParse(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export default function Contact({ t, lang }) {
  if (!t?.contact) return null;

  const c = t.contact;
  const recaptchaLang = lang === "ar" ? "ar" : lang === "nl" ? "nl" : "en";
  const captchaMessages = {
    en: {
      missingSiteKey: "reCAPTCHA site key is missing. Add VITE_RECAPTCHA_SITE_KEY and restart Vite.",
      checkCaptcha: "Please complete the reCAPTCHA first.",
    },
    nl: {
      missingSiteKey: "reCAPTCHA site key ontbreekt. Voeg VITE_RECAPTCHA_SITE_KEY toe en herstart Vite.",
      checkCaptcha: "Vink eerst de reCAPTCHA aan.",
    },
    ar: {
      missingSiteKey: "مفتاح reCAPTCHA غير موجود. أضف VITE_RECAPTCHA_SITE_KEY ثم أعد تشغيل Vite.",
      checkCaptcha: "يرجى إكمال reCAPTCHA أولاً.",
    },
  };
  const msg = captchaMessages[recaptchaLang] || captchaMessages.en;
  const recaptchaRef = useRef(null);
  const copyTimerRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [serverMsg, setServerMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const errors = useMemo(() => {
    const next = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name) {
      next.name = c.validation.required;
    }

    if (!email) {
      next.email = c.validation.required;
    } else if (!emailRegex.test(email)) {
      next.email = c.validation.invalidEmail;
    }

    if (!message) {
      next.message = c.validation.required;
    } else if (message.length < 10) {
      next.message = c.validation.messageTooShort;
    }

    return next;
  }, [form, c.validation]);

  const canSubmit =
    status !== "sending" &&
    Object.keys(errors).length === 0 &&
    !!form.name.trim() &&
    !!form.email.trim() &&
    !!form.message.trim();

  const handleChange = (key) => (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [key]: key === "message" ? value.slice(0, MAX_MESSAGE_LENGTH) : value,
    }));

    if (status === "success" || status === "error") {
      setStatus("idle");
      setServerMsg("");
    }
  };

  const handleBlur = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_TO);
      setCopied(true);

      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
      }, 1400);
    } catch {
      // ignore
    }
  };

  const resetFormState = () => {
    setForm(initialForm);
    setTouched({});
    setServerMsg("");
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setTouched({
    name: true,
    email: true,
    subject: true,
    message: true,
  });
  setServerMsg("");

  if (Object.keys(errors).length > 0) {
    return;
  }

  if (form.website) {
    setStatus("success");
    resetFormState();
    return;
  }

  if (!SITE_KEY) {
    setStatus("error");
    setServerMsg(msg.missingSiteKey);
    return;
  }

  const recaptchaToken = recaptchaRef.current?.getValue();

  if (!recaptchaToken) {
    setStatus("error");
    setServerMsg(msg.checkCaptcha);
    return;
  }

  setStatus("sending");

  try {
    const response = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        website: form.website,
        lang: lang || (t.dir === "rtl" ? "ar" : "en"),
        recaptchaToken,
      }),
    });

    const text = await response.text();
    const data = safeJsonParse(text);

    if (!response.ok || !data?.ok) {
      const details = data?.details
        ? ` details=${JSON.stringify(data.details)}`
        : "";
      const hostname = data?.hostname ? ` hostname=${data.hostname}` : "";

      throw new Error(
        (data?.error || `Request failed (${response.status})`) +
          details +
          hostname
      );
    }

    if (data?.warning) {
      recaptchaRef.current?.reset();
      setStatus("error");
      setServerMsg(data.warning);
      return;
    }

    recaptchaRef.current?.reset();
    setStatus("success");
    resetFormState();
  } catch (error) {
    recaptchaRef.current?.reset();
    setStatus("error");
    setServerMsg(error?.message || c.statusText.serverError);
  }
};

  const messageLength = form.message.length;
  const counterText = c.ui.counter.replace("{count}", String(messageLength));

  const renderToast = () => {
    if (status === "idle") return null;

    const config = {
      sending: {
        className: "toast-sending",
        icon: "fa-solid fa-paper-plane",
        text: c.statusText.sendingToast,
      },
      success: {
        className: "toast-success",
        icon: "fa-solid fa-circle-check",
        text: c.statusText.successToast,
      },
      error: {
        className: "toast-error",
        icon: "fa-solid fa-circle-exclamation",
        text: serverMsg || c.statusText.errorToast,
      },
    };

    const current = config[status];
    if (!current) return null;

    return (
      <div
        className={`contact-toast ${current.className}`}
        role="status"
        aria-live="polite"
      >
        <i className={current.icon} aria-hidden="true" />
        <span>{current.text}</span>
      </div>
    );
  };

  return (
    <section className="contact-page contact-v2">
      <header className="contact-hero">
        <div className="contact-hero-inner">
          <div className="contact-hero-badges">
            <span className="chip">
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
              {c.badges.secure}
            </span>
            <span className="chip">
              <i className="fa-solid fa-bolt" aria-hidden="true" />
              {c.badges.reply}
            </span>
            <span className="chip">
              <i className="fa-solid fa-location-dot" aria-hidden="true" />
              {c.locationValue}
            </span>
          </div>

          <h1 className="contact-title">{c.title}</h1>
          <p className="contact-subtitle">{c.intro}</p>

          <div className="contact-quick-actions">
            <a
              className="quick-btn"
              href={`mailto:${EMAIL_TO}`}
              title={c.actions.email}
            >
              <i className="fa-solid fa-envelope" aria-hidden="true" />
              <span>{c.actions.email}</span>
            </a>

            <button className="quick-btn" type="button" onClick={copyEmail}>
              <i className="fa-solid fa-copy" aria-hidden="true" />
              <span>{copied ? c.actions.copied : c.actions.copyEmail}</span>
            </button>

            <a className="quick-btn" href="/cv" title={c.actions.cv}>
              <i className="fa-solid fa-file-arrow-down" aria-hidden="true" />
              <span>{c.actions.cv}</span>
            </a>
          </div>
        </div>
      </header>

      <div className="contact-grid">
        <section className="contact-form-card">
          <div className="card-head">
            <div>
              <h2 className="section-subtitle">{c.formTitle}</h2>
              <p className="card-hint">{c.hint}</p>
            </div>

            <div className="card-icon" aria-hidden="true">
              <i className="fa-solid fa-paper-plane" />
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row two">
              <div className="contact-field">
                <label htmlFor="contact-name">{c.fields.name}</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  placeholder={c.placeholders.name}
                  autoComplete="name"
                  aria-invalid={Boolean(touched.name && errors.name)}
                  aria-describedby={
                    touched.name && errors.name ? "contact-name-error" : undefined
                  }
                />
                {touched.name && errors.name && (
                  <p id="contact-name-error" className="field-error">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email">{c.fields.email}</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                  placeholder={c.placeholders.email}
                  autoComplete="email"
                  aria-invalid={Boolean(touched.email && errors.email)}
                  aria-describedby={
                    touched.email && errors.email ? "contact-email-error" : undefined
                  }
                />
                {touched.email && errors.email && (
                  <p id="contact-email-error" className="field-error">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-subject">{c.fields.subject}</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange("subject")}
                onBlur={handleBlur("subject")}
                placeholder={c.placeholders.subject}
                autoComplete="off"
              />
            </div>

<div className="honeypot-field">
  <label htmlFor="contact-website">Website</label>
  <input
    id="contact-website"
    name="website"
    type="text"
    tabIndex={-1}
    autoComplete="off"
    value={form.website}
    onChange={handleChange("website")}
  />
</div>

            <div className="contact-field">
              <label htmlFor="contact-message">{c.fields.message}</label>
              <textarea
                id="contact-message"
                name="message"
                rows={7}
                value={form.message}
                onChange={handleChange("message")}
                onBlur={handleBlur("message")}
                placeholder={c.placeholders.message}
                maxLength={MAX_MESSAGE_LENGTH}
                aria-invalid={Boolean(touched.message && errors.message)}
                aria-describedby={
                  touched.message && errors.message
                    ? "contact-message-error"
                    : "contact-message-help"
                }
              />

              <div className="field-footer" id="contact-message-help">
                <span className="field-muted">{c.ui.tip}</span>
                <span className="field-muted">{counterText}</span>
              </div>

              {touched.message && errors.message && (
                <p id="contact-message-error" className="field-error">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="recaptcha-wrap">
              <ReCAPTCHA ref={recaptchaRef} sitekey={SITE_KEY || ""} hl={recaptchaLang} />
            </div>

            <button
              type="submit"
              className="btn primary contact-submit"
              disabled={!canSubmit}
            >
              <i
                className={
                  status === "sending"
                    ? "fa-solid fa-spinner fa-spin"
                    : "fa-solid fa-paper-plane"
                }
                aria-hidden="true"
              />
              <span>
                {status === "sending"
                  ? c.statusText.sendingBtn
                  : c.sendButton}
              </span>
            </button>

            {renderToast()}
          </form>
        </section>

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
                    <a
                      className="contact-email-link"
                      href={`mailto:${EMAIL_TO}`}
                    >
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
                <i className="fa-solid fa-envelope" aria-hidden="true" />
                <span>{c.ui.emailMe}</span>
              </a>
            </div>
          </section>

          <section className="contact-card">
            <h3>{c.followTitle}</h3>

            <div className="social-special">
              <div className="social-special-left">
                <i className="fa-solid fa-hashtag" aria-hidden="true" />
              </div>
              <div>
                <div className="social-special-title">{c.ui.letsConnect}</div>
                <div className="social-special-text">{c.ui.letsConnectSub}</div>
              </div>
            </div>

            <div className="contact-social-grid">
              {SOCIAL_LINKS.map((s, idx) => {
                const label = c.socials?.[idx] ?? "Social";

                return (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-social-pill"
                    aria-label={label}
                    title={label}
                  >
                    <span className="contact-social-icon">
                      <i className={s.icon} aria-hidden="true" />
                    </span>
                    <span className="contact-social-label">{label}</span>
                    <span className="contact-social-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="contact-card">
            <h3>{c.faqTitle}</h3>

            <div className="contact-faq-list">
              {c.faqs.map((item, idx) => (
                <details key={idx} className="contact-faq-item">
                  <summary>
                    <span>{item.question}</span>
                    <i className="fa-solid fa-chevron-down" aria-hidden="true" />
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