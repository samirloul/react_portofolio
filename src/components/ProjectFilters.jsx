import { useState } from "react";

export default function ProjectFilters({ projects, onFilter, t }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const TAG_GROUPS = {
    frontend: ["html", "css", "javascript", "react", "ui", "frontend"],
    backend: ["php", "mysql", "sql", "laravel", "api", "backend", "node"],
    fullstack: ["fullstack", "full stack", "react", "php", "mysql", "sql", "api", "laravel"],
    tools: ["git", "github", "vite", "npm", "tool", "devops"],
    laravel: ["laravel"],
    php: ["php"],
    react: ["react"],
  };

  const hasTagFromGroup = (project, groupKey) => {
    const tags = (project?.tags || []).map((tag) => String(tag).toLowerCase());
    const candidates = TAG_GROUPS[groupKey] || [];

    if (groupKey === "fullstack") {
      const hasFront = tags.some((tag) => TAG_GROUPS.frontend.some((f) => tag.includes(f)));
      const hasBack = tags.some((tag) => TAG_GROUPS.backend.some((b) => tag.includes(b)));
      return hasFront && hasBack;
    }

    if (groupKey === "live" || groupKey === "completed" || groupKey === "in-development") {
      const normalized = String(project?.status || "").toLowerCase();
      return normalized.includes(groupKey.replace("-", " ")) || normalized.includes(groupKey.replace("-", ""));
    }

    return tags.some((tag) => candidates.some((candidate) => tag.includes(candidate)));
  };

  const filterOptions = [
    { key: "all", label: t?.projectFilters?.all || "All Projects" },
    { key: "laravel", label: t?.projectFilters?.laravel || "Laravel" },
    { key: "php", label: t?.projectFilters?.php || "PHP" },
    { key: "react", label: t?.projectFilters?.react || "React" },
    { key: "backend", label: t?.projectFilters?.backend || "Backend" },
    { key: "frontend", label: t?.projectFilters?.frontend || "Frontend" },
    { key: "fullstack", label: t?.projectFilters?.fullstack || "Full Stack" },
    { key: "live", label: t?.projectFilters?.live || "Live" },
    { key: "completed", label: t?.projectFilters?.completed || "Completed" },
    { key: "in-development", label: t?.projectFilters?.inDevelopment || "In Development" },
  ];

  const handleFilter = (filter) => {
    setActiveFilter(filter);

    if (filter === "all") {
      onFilter(projects);
    } else {
      const filtered = projects.filter((project) => hasTagFromGroup(project, filter));
      onFilter(filtered);
    }
  };

  return (
    <div className="project-filters" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
      {filterOptions.map((opt) => (
        <button
          key={opt.key}
          onClick={() => handleFilter(opt.key)}
          className={`filter-btn ${activeFilter === opt.key ? "active" : ""}`}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "2rem",
            border: `2px solid ${activeFilter === opt.key ? "#6366f1" : "#ccc"}`,
            background: activeFilter === opt.key ? "#6366f1" : "transparent",
            color: activeFilter === opt.key ? "white" : "inherit",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
