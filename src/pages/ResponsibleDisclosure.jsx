export default function ResponsibleDisclosure({ t }) {
  return (
    <main className="container content-page" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>{t?.responsibleDisclosure?.title || "Responsible Disclosure"}</h1>
      <div className="content-card" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "20px", padding: "1.5rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
        <p>
          If you discover a security issue or a vulnerability on this website, please report it responsibly and privately.
        </p>
        <p>
          I appreciate reports that help improve the security of the site, but I do not allow destructive, abusive, or harmful testing. This includes DDoS attempts, deleting or modifying data, viewing personal data unrelated to the issue, social engineering, or any action that disrupts the service.
        </p>
        <p>
          Please contact me through the contact form or by email and share a clear description of the issue, steps to reproduce it, and any relevant evidence.
        </p>
        <p>
          I will review valid reports in a responsible manner and thank those who help improve the security of this project.
        </p>
      </div>
    </main>
  );
}
