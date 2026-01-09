import { useState } from "react";

// volgorde = zelfde als t.contact.socials
const SOCIAL_LINKS = [
  {
    name: "Twitter",
    href: "https://x.com/samirloul",
    icon: "fab fa-twitter",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/samirloul/",
    icon: "fab fa-instagram",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@samirloul1",
    icon: "fab fa-tiktok",
  },
  {
    name: "Snapchat",
    href: "https://snapchat.com/t/zMfZUL7e",
    icon: "fab fa-snapchat",
  },
  {
    name: "Facebook",
    href:
      "https://www.facebook.com/people/Samir-Loul/pfbid035xjDjgASokyobu9dbAtg5zczRCQhtYJ3ageknwV28QKjwhtXcAZaxGmnjpfzWUSql/",
    icon: "fab fa-facebook",
  },
  {
    name: "Threads",
    href: "https://www.threads.net/@samirloul",
    icon: "fab fa-threads",
  },
];

export default function Contact({ t }) {
  const c = t.contact;
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
    setSent(true);
    // hier kun je later echte form-logica / API call toevoegen
  };

  return (
    <section className="contact-page">
      {/* Titel + intro */}
      <header className="contact-header">
        <h1 className="section-title">{c.title}</h1>
        <p className="lead center">{c.intro}</p>
      </header>

      <div className="contact-grid">
        {/* FORM */}
        <section className="contact-form-card">
          <h2 className="section-subtitle">{c.formTitle}</h2>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label className="contact-field">
              <span>{c.fields.name} *</span>
              <input type="text" required />
            </label>

            <label className="contact-field">
              <span>{c.fields.email} *</span>
              <input type="email" required />
            </label>

            <label className="contact-field">
              <span>{c.fields.subject}</span>
              <input type="text" />
            </label>

            <label className="contact-field">
              <span>{c.fields.message} *</span>
              <textarea rows="5" required />
            </label>

            <button type="submit" className="btn primary contact-submit">
              <i className="fas fa-paper-plane" aria-hidden="true"></i>
              <span>{c.sendButton}</span>
            </button>

            {sent && (
              <p className="contact-success">
                ✅ Thanks! Your message has been received. (Demo – not actually
                sending yet)
              </p>
            )}
          </form>
        </section>

        {/* INFO + SOCIAL + FAQ */}
        <aside className="contact-sidebar">
          {/* Contact info */}
          <section className="contact-card">
            <h3>{c.infoTitle}</h3>
            <div className="contact-info-row">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-envelope" aria-hidden="true"></i>
                </div>
                <div>
                  <div className="contact-info-label">{c.emailLabel}</div>
                  <div className="contact-info-value">
                    sameerloul2010@gmail.com
                  </div>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-location-dot" aria-hidden="true"></i>
                </div>
                <div>
                  <div className="contact-info-label">{c.locationLabel}</div>
                  <div className="contact-info-value">{c.locationValue}</div>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="fas fa-clock" aria-hidden="true"></i>
                </div>
                <div>
                  <div className="contact-info-label">{c.responseLabel}</div>
                  <div className="contact-info-value">{c.responseValue}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Socials */}
          <section className="contact-card">
            <h3>{c.followTitle}</h3>
            <div className="contact-social-grid">
              {SOCIAL_LINKS.map((social, idx) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-social-pill"
                >
                  <span className="contact-social-icon">
                    <i className={social.icon} aria-hidden="true"></i>
                  </span>
                  <span className="contact-social-label">
                    {/* label uit i18n zodat AR/NL ook kloppen */}
                    {c.socials[idx]}
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="contact-card">
            <h3>{c.faqTitle}</h3>
            <div className="contact-faq-list">
              {c.faqs.map((item, idx) => (
                <div key={idx} className="contact-faq-item">
                  <h4>{item.question}</h4>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
