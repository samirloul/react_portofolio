import PageVisual from "../components/PageVisual.jsx";

export default function Learning({ t }) {
  const fallbackCurrentlyLearning = [
    "Cybersecurity",
    "AI",
    "Backend Architecture",
    "Secure Web Development",
    "Software Engineering",
    "Docker",
    "DevOps",
  ];

  const fallbackCurrentlyImproving = [
    "Laravel",
    "PHP",
    "MySQL",
    "React",
    "API Development",
    "Database Design",
    "Backend Security",
  ];

  const fallbackCurrentlyBuilding = [
    "Personal projects",
    "Websites",
    "Full-stack applications",
    "Backend systems",
  ];

  const currentlyLearning = t?.learning?.currentlyLearning || fallbackCurrentlyLearning;
  const currentlyImproving = t?.learning?.currentlyImproving || fallbackCurrentlyImproving;
  const currentlyBuilding = t?.learning?.currentlyBuilding || fallbackCurrentlyBuilding;

  return (
    <main className="container content-page" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <PageVisual image="/fotos/samir-loul-learning-ai-cybersecurity.png" alt="Samir Loul learning AI, cybersecurity, backend development and software engineering" eyebrow={t?.nav?.learning || "Learning / Now"} title={t?.learning?.title || "Learning / Now"} text={t?.learning?.intro} />

      <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: "2rem" }}>
        <section className="content-card" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "20px", padding: "1.5rem" }}>
          <h2>{t?.learning?.currentlyLearningTitle || "Currently Learning"}</h2>
          <ul style={{ paddingLeft: "1.2rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
            {currentlyLearning.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="content-card" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "20px", padding: "1.5rem" }}>
          <h2>{t?.learning?.currentlyImprovingTitle || "Currently Improving"}</h2>
          <ul style={{ paddingLeft: "1.2rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
            {currentlyImproving.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="content-card" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "20px", padding: "1.5rem" }}>
          <h2>{t?.learning?.currentlyBuildingTitle || "Currently Building"}</h2>
          <ul style={{ paddingLeft: "1.2rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
            {currentlyBuilding.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      </div>
    </main>
  );
}
