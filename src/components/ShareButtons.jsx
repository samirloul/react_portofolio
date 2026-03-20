import { useState } from "react";

export default function ShareButtons({ projectTitle = "My Project", url = window.location.href, t }) {
  const [copied, setCopied] = useState(false);

  const shareThis = (platform) => {
    const text = t?.share?.shareText || "Check out this amazing project";
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    };

    if (links[platform]) {
      window.open(links[platform], "_blank", "width=600,height=400");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="share-buttons" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      <button
        onClick={() => shareThis("twitter")}
        className="btn-share twitter"
        title={t?.share?.twitter || "Share on Twitter"}
        aria-label="Share on Twitter"
      >
        <i className="fab fa-twitter"></i>
        {t?.share?.twitter || "Twitter"}
      </button>
      <button
        onClick={() => shareThis("linkedin")}
        className="btn-share linkedin"
        title={t?.share?.linkedin || "Share on LinkedIn"}
        aria-label="Share on LinkedIn"
      >
        <i className="fab fa-linkedin"></i>
        {t?.share?.linkedin || "LinkedIn"}
      </button>
      <button
        onClick={() => shareThis("whatsapp")}
        className="btn-share whatsapp"
        title={t?.share?.whatsapp || "Share on WhatsApp"}
        aria-label="Share on WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
        {t?.share?.whatsapp || "WhatsApp"}
      </button>
      <button onClick={copyLink} className="btn-share copy" title="Copy link" aria-label="Copy link">
        <i className={`fas fa-${copied ? "check" : "link"}`}></i>
        {copied ? (t?.share?.copied || "Copied!") : "Copy"}
      </button>
    </div>
  );
}
