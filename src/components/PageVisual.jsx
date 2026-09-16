export default function PageVisual({ image, alt, eyebrow, title, text, className = "" }) {
  return (
    <div className={`page-visual ${className}`.trim()}>
      <img className="page-visual-image" src={image} alt={alt || title} loading="lazy" />
      <div className="page-visual-overlay" />
      <div className="page-visual-content">
        {eyebrow ? <span className="eyebrow page-visual-eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {text ? <p>{text}</p> : null}
      </div>
    </div>
  );
}
