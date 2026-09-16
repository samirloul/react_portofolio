export default function PageVisual({ image, eyebrow, title, text, className = "" }) {
  return (
    <div className={`page-visual ${className}`.trim()} style={{ backgroundImage: `url("${image}")` }}>
      <div className="page-visual-overlay" />
      <div className="page-visual-content">
        {eyebrow ? <span className="eyebrow page-visual-eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {text ? <p>{text}</p> : null}
      </div>
    </div>
  );
}
