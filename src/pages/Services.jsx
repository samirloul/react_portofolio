import PageVisual from "../components/PageVisual.jsx";

export default function Services({ t }) {
  const fallbackServices = [
    "Portfolio websites",
    "Business websites",
    "Full-stack websites",
    "Responsive web development",
    "Laravel development",
    "PHP development",
    "Database development",
    "Website maintenance",
    "Basic SEO",
    "Bug fixing",
  ];
  const services = t?.services?.items || fallbackServices;

  return (
    <main className="container content-page" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <PageVisual image="/fotos/diensten.png" eyebrow={t?.nav?.services || "Services"} title={t?.services?.title || "Services"} text={t?.services?.intro} />

      <section className="content-card" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "20px", padding: "1.5rem", marginTop: "2rem" }}>
        <ul style={{ paddingLeft: "1.2rem", color: "var(--text-muted)", lineHeight: 1.9, margin: 0 }}>
          {services.map((service) => <li key={service}>{service}</li>)}
        </ul>
      </section>
    </main>
  );
}
