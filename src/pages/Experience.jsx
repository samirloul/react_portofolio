import PageVisual from "../components/PageVisual.jsx";

export default function Experience({ t }) {
  const fallbackItems = [
    {
      title: "Software Developer Intern",
      company: "Xlab Cloud Services",
      period: "Current internship",
      description:
        "Gaining practical experience in a professional software development environment and improving my development, problem-solving, and technical skills.",
    },
    {
      title: "Software Development Student",
      company: "MBO Utrecht",
      period: "2024 - 2027",
      description:
        "Building a strong foundation in software development, programming logic, project work, and modern web technologies.",
    },
  ];
  const items = t?.experience?.items || fallbackItems;

  return (
    <main className="container content-page" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <PageVisual image="/fotos/samir-loul-software-development-experience.png" alt="Samir Loul software development experience and professional growth" eyebrow={t?.nav?.experience || "Experience"} title={t?.experience?.title || "Experience"} text={t?.experience?.intro} />

      <div style={{ display: "grid", gap: "1.25rem" }}>
        {items.map((item) => (
          <article key={item.title} className="content-card" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "20px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0 }}>{item.title}</h2>
                <p style={{ margin: "0.35rem 0 0", color: "var(--primary)", fontWeight: 600 }}>{item.company}</p>
              </div>
              <span className="tag-pill">{item.period}</span>
            </div>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 0, marginTop: "1rem" }}>{item.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
