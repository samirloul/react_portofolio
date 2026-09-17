import { Link, useParams } from "react-router-dom";

const projectMap = {
  "samirprofile-com": {
    slug: "samirprofile-com",
    title: "SamirProfile.com",
    status: "Live",
    overview: "My personal developer portfolio built with React and a Node.js backend.",
    summary:
      "This project is more than just a portfolio. It is a place where I present my work, improve my frontend and backend skills, and experiment with modern web technologies, security, and responsive design.",
    description:
      "I built this portfolio to present who I am as a developer, highlight the technologies I work with, and create a professional space where I can share projects, contact information, and future opportunities.",
    technologies: ["React", "JavaScript", "CSS", "Node.js", "Express", "PostgreSQL", "REST APIs", "Security"],
    features: [
      "Multilingual support for English, Dutch, and Arabic",
      "Responsive portfolio layout and modern UI styling",
      "Contact and newsletter form integrations",
      "Admin dashboard for managing subscribers and feedback",
      "Security-minded API setup with validation, rate limiting, and CSRF protection",
    ],
    challenges: [
      "Keeping the site fast while still feeling modern and professional",
      "Balancing personal storytelling with professional, clean presentation",
      "Implementing secure backend handling for public-facing forms",
    ],
    lessons: [
      "I learned how important secure form handling and validation are in production apps",
      "I improved my understanding of API design, frontend routing, and deployment workflows",
      "I developed stronger attention to user experience and maintainable code structure",
    ],
    links: [
      { label: "Live Website", href: "https://samirprofile.com", external: true },
      { label: "GitHub", href: "https://github.com/SamirLoul", external: true },
    ],
    screenshots: [
      "This portfolio includes a modern landing page, project overview, contact flow, and multilingual UX.",
    ],
  },
  elegancia: {
    slug: "elegancia",
    title: "Elegancia Barbershop",
    status: "Live",
    overview: "A multilingual barbershop website with online booking and service selection.",
    summary:
      "I developed this project to create a professional online presence for a real business and make it easier for customers to schedule appointments and contact the salon.",
    description:
      "The website gives the business a stronger digital presence and includes a custom booking flow, service overview, and straightforward contact experience for local customers.",
    technologies: ["PHP", "MySQL", "HTML", "CSS", "JavaScript", "Responsive Design"],
    features: [
      "Custom service selection and booking flow",
      "Responsive design for mobile and desktop users",
      "Contact and appointment request handling",
      "Business-focused design structure and SEO-friendly pages",
    ],
    challenges: [
      "Designing a clean booking workflow for a real client business",
      "Making the site usable across devices without losing clarity",
      "Building a simple but effective online customer journey",
    ],
    lessons: [
      "I learned how to build a practical website around real business needs",
      "I improved my understanding of database-driven web apps and user flows",
      "I became more aware of the importance of clean UX and conversion-focused design",
    ],
    links: [
      { label: "Live Website", href: "https://elegancia-barber.nl/", external: true },
    ],
    screenshots: [
      "The project includes service information, navigation, online booking flow, and a clean customer-facing layout.",
    ],
  },
  "syria-website": {
    slug: "syria-website",
    title: "Syria Website",
    status: "Completed",
    overview: "A website about Syria, its identity, history, and cultural context.",
    summary:
      "This project allowed me to combine design, content structure, and storytelling in a way that presents cultural information in a clear and respectful way.",
    description:
      "The website focuses on making historical and cultural information accessible while keeping the content organized and visually approachable for visitors.",
    technologies: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    features: [
      "Content-driven website structure",
      "Cultural and historical information presentation",
      "Responsive layout with readable content blocks",
      "Clean navigation and accessible content architecture",
    ],
    challenges: [
      "Presenting information clearly without overwhelming the visitor",
      "Creating a structured design that works well for informative content",
      "Balancing visual storytelling with readability",
    ],
    lessons: [
      "I improved my understanding of content-first website design",
      "I strengthened my ability to build structured and readable pages",
      "I gained more practical experience with server-rendered PHP and MySQL workflows",
    ],
    links: [],
    screenshots: [
      "The project contains content-focused sections that present the culture, history, and identity of Syria in a structured way.",
    ],
  },
};

export default function ProjectDetail({ t }) {
  const { slug } = useParams();
  const project = projectMap[slug] || projectMap["samirprofile-com"];

  return (
    <main className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/projects" className="btn outline" style={{ display: "inline-flex" }}>
          ← {t?.nav?.projects || "Projects"}
        </Link>
      </div>

      <article className="project-detail" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "24px", boxShadow: "var(--shadow-soft)", overflow: "hidden" }}>
        <div style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <h1 style={{ margin: 0 }}>{project.title} | Project by Samir Loul</h1>
            <span className="tag-pill" style={{ background: "var(--primary-extra-soft)", color: "var(--primary-active)" }}>{project.status}</span>
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>{project.overview}</p>

          <div className="project-tags" style={{ marginBottom: "1.5rem" }}>
            {project.technologies.map((tech) => (
              <span key={tech} className="tag-pill">{tech}</span>
            ))}
          </div>

          <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>{t?.projects?.detail?.about || "About the project"}</h2>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>{project.description}</p>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>{t?.projects?.detail?.goal || "Goal"}</h2>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>{project.summary}</p>
            </section>
          </div>

          <div style={{ display: "grid", gap: "1.5rem", marginTop: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>{t?.projects?.detail?.features || "Features"}</h2>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
                {project.features.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section>
              <h2 style={{ marginBottom: "0.75rem" }}>{t?.projects?.detail?.challenges || "Challenges"}</h2>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
                {project.challenges.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h2 style={{ marginBottom: "0.75rem" }}>{t?.projects?.detail?.lessons || "What I learned"}</h2>
            <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
              {project.lessons.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          {project.screenshots?.length ? (
            <div style={{ marginTop: "2rem" }}>
              <h2 style={{ marginBottom: "0.75rem" }}>{t?.projects?.detail?.screenshots || "Screenshots"}</h2>
              <div style={{ background: "rgba(148, 163, 184, 0.08)", border: "1px solid var(--border-soft)", borderRadius: "18px", padding: "1rem", color: "var(--text-muted)" }}>
                {project.screenshots.map((item) => (
                  <p key={item} style={{ margin: 0 }}>{item}</p>
                ))}
              </div>
            </div>
          ) : null}

          {project.links.length ? (
            <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="btn primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </main>
  );
}
