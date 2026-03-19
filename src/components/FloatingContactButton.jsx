import React from "react";
import { Link } from "react-router-dom";

export default function FloatingContactButton() {
  return (
    <Link
      to="/contact"
      className="floating-contact"
      title="Contact Me"
      aria-label="Floating contact button"
    >
      <i className="fas fa-envelope"></i>
    </Link>
  );
}
