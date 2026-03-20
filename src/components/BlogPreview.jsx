import { Link } from "react-router-dom";

export default function BlogPreview({ posts = [], t }) {
  const fallbackPosts = [
    {
      title: "Building My First React Portfolio",
      date: "2025-03-15",
      excerpt: "A journey through React hooks, styling, and deployment...",
      slug: "first-react-portfolio",
    },
    {
      title: "Learning Web Development in 2025",
      date: "2025-03-10",
      excerpt: "My thoughts on JavaScript frameworks and best practices...",
      slug: "learning-web-dev",
    },
    {
      title: "From Syria to Netherlands: A Tech Journey",
      date: "2025-03-05",
      excerpt: "How I transitioned into tech while adapting to a new country...",
      slug: "my-tech-journey",
    },
  ];

  const translatedPosts = Array.isArray(t?.blog?.posts) ? t.blog.posts : [];
  const mergedFallbackPosts = fallbackPosts.map((post, idx) => ({
    ...post,
    title: translatedPosts[idx]?.title || post.title,
    excerpt: translatedPosts[idx]?.excerpt || post.excerpt,
  }));
  const displayPosts = posts.length > 0 ? posts : mergedFallbackPosts;

  const styles = {
    container: {
      padding: "2rem 0",
      margin: "2rem 0",
    },
    title: {
      marginBottom: "2rem",
      color: "var(--text)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2rem",
    },
    card: {
      padding: "1.5rem",
      background: "var(--bg-card)",
      borderRadius: "1rem",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
      border: "1px solid var(--border-soft)",
      boxShadow: "var(--shadow-soft)",
    },
    cardTitle: {
      marginTop: 0,
      color: "var(--text)",
    },
    cardDate: {
      color: "var(--text-muted)",
      fontSize: "0.9rem",
    },
    cardExcerpt: {
      color: "var(--text)",
    },
    link: {
      color: "var(--primary)",
      fontWeight: "bold",
      textDecoration: "none",
    },
  };

  return (
    <section className="blog-preview" style={styles.container}>
      <h2 style={styles.title}>{t?.blog?.title || "Latest Articles"}</h2>
      <div style={styles.grid}>
        {displayPosts.slice(0, 3).map((post, idx) => (
          <article
            key={idx}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "var(--shadow-strong)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "var(--shadow-soft)";
            }}
          >
            <h3 style={styles.cardTitle}>{post.title}</h3>
            <p style={styles.cardDate}>
              {t?.blog?.postedOn || "Posted on"} {new Date(post.date).toLocaleDateString()}
            </p>
            <p style={styles.cardExcerpt}>{post.excerpt}</p>
            <Link to={`/blog/${post.slug}`} style={styles.link}>
              {t?.blog?.readMore || "Read More"} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
