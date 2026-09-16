export default function Privacy({ t }) {
  return (
    <main className="container content-page" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>{t?.privacy?.title || "Privacy"}</h1>
      <div className="content-card" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "20px", padding: "1.5rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
        <p>
          I collect and process personal data only when it is necessary for contact, newsletter signup, feedback, or other legitimate communication purposes.
        </p>
        <p>
          When you use the contact form, the information you provide such as your name, email address, and message is used to respond to your request and for communication related to that request.
        </p>
        <p>
          When you subscribe to the newsletter, I store your email address so I can send relevant updates and project news. You can unsubscribe at any time through the link in the email or by contacting me directly.
        </p>
        <p>
          Feedback submissions are used to improve the website and understand how visitors experience the portfolio. I do not use this information for unrelated purposes.
        </p>
        <p>
          I take reasonable care to avoid storing unnecessary data and I do not sell personal information. Data is kept only as long as needed for the purpose it was collected.
        </p>
      </div>
    </main>
  );
}
