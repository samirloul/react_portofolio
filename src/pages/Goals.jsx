import PageVisual from "../components/PageVisual.jsx";

export default function Goals({ t }) {
  const fallbackGoals = [
    "Complete my MBO 4 Software Developer diploma this year",
    "Gain more practical experience during my internship",
    "Understand how professional software teams and companies work in practice",
    "Learn more about real software development and technical problem solving",
    "Continue developing my backend and full-stack skills",
    "Build more knowledge in AI and cybersecurity",
    "Continue with a part-time HBO programme after MBO",
    "Combine study with working in IT while growing professionally",
  ];
  const goals = t?.goals?.items || fallbackGoals;

  return (
    <main className="container content-page" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <PageVisual image="/fotos/samir-loul-career-development-goals.png" alt="Samir Loul career goals in full stack development, software engineering and higher education" eyebrow={t?.nav?.goals || "Goals"} title={t?.goals?.title || "Goals"} text={t?.goals?.intro} />

      <section className="content-card" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "20px", padding: "1.5rem", marginTop: "2rem" }}>
        <h2>{t?.goals?.futureTitle || "Future direction"}</h2>
        <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
          {t?.goals?.futureText ||
            "After completing my MBO education, I plan to continue with a part-time HBO programme while working in IT. I want to keep growing in backend development, full-stack development, software engineering, AI and cybersecurity."}
        </p>
      </section>

      <section className="content-card content-card-plain" style={{ marginTop: "2rem" }}>
        <h2>{t?.goals?.currentGoalsTitle || "Current goals"}</h2>
        <ul style={{ paddingLeft: "1.2rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
          {goals.map((goal) => <li key={goal}>{goal}</li>)}
        </ul>
      </section>
    </main>
  );
}
