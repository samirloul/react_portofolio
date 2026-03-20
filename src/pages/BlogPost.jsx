import { Link, useParams } from "react-router-dom";

const BLOG_BASE = [
  { slug: "first-react-portfolio", date: "2025-03-15" },
  { slug: "learning-web-dev", date: "2025-03-10" },
  { slug: "my-tech-journey", date: "2025-03-05" },
];

const CONTENT_BY_LANG = {
  en: [
    "I built this portfolio to practice modern React patterns and clean UI structure.",
    "The process helped me improve hooks usage, layout consistency, and component organization.",
    "I also learned a lot about styling systems, responsiveness, and deployment flow.",
  ],
  ar: [
    "أنشأت هذا المعرض للتدرب على أنماط React الحديثة وبنية واجهة واضحة.",
    "ساعدتني التجربة على تحسين استخدام Hooks وتنظيم المكونات وتناسق التصميم.",
    "كما تعلمت الكثير حول نظام التنسيقات والاستجابة للشاشات وآلية النشر.",
  ],
  nl: [
    "Ik heb dit portfolio gebouwd om moderne React-patronen en een nette UI-structuur te oefenen.",
    "Dit proces hielp mij bij het verbeteren van hooks, layout-consistentie en componentstructuur.",
    "Ik heb ook veel geleerd over styling-systemen, responsiveness en deployment.",
  ],
};

export default function BlogPost({ t, lang = "en" }) {
  const { slug } = useParams();

  const translatedPosts = Array.isArray(t?.blog?.posts) ? t.blog.posts : [];

  const resolvedPosts = BLOG_BASE.map((post, idx) => ({
    ...post,
    title: translatedPosts[idx]?.title || "Article",
    excerpt: translatedPosts[idx]?.excerpt || "",
    paragraphs: CONTENT_BY_LANG[lang] || CONTENT_BY_LANG.en,
  }));

  const post = resolvedPosts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <section className="container" style={{ padding: "2rem 0" }}>
        <h1 style={{ color: "var(--text)" }}>404</h1>
        <p style={{ color: "var(--text-muted)" }}>Article not found.</p>
        <Link to="/" style={{ color: "var(--primary)", fontWeight: 600 }}>
          {t?.nav?.home || "Back to home"}
        </Link>
      </section>
    );
  }

  return (
    <section className="container" style={{ padding: "2rem 0 3rem" }}>
      <Link to="/" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
        ← {t?.nav?.home || "Home"}
      </Link>

      <article
        style={{
          marginTop: "1rem",
          background: "var(--bg-card)",
          border: "1px solid var(--border-soft)",
          borderRadius: "1rem",
          padding: "1.5rem",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <h1 style={{ color: "var(--text)", marginTop: 0 }}>{post.title}</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 0 }}>
          {t?.blog?.postedOn || "Posted on"} {new Date(post.date).toLocaleDateString()}
        </p>

        <p style={{ color: "var(--text)", lineHeight: 1.8 }}>{post.excerpt}</p>

        {post.paragraphs.map((line, idx) => (
          <p key={idx} style={{ color: "var(--text)", lineHeight: 1.8 }}>
            {line}
          </p>
        ))}
      </article>
    </section>
  );
}
