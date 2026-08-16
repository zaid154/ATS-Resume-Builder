import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="area-footer-wrapper">
      <div className="area-footer-inner">
        <div className="area-footer-brand">
          <Link to="/" className="area-logo" style={{ fontSize: "1.25rem", textDecoration: "none" }}>
            ATS<span style={{ color: "var(--primary)" }}>Resume</span>
          </Link>
          <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Precision ATS Resume Builder & Smart Job Match Scorer
          </p>
        </div>

        <div className="area-footer-links">
          <a href="/#benefits">Features</a>
          <a href="/#templates">Templates</a>
          <a href="/#scoring">ATS Scoring</a>
          <a href="/#how-to">How-to</a>
        </div>

        <div className="area-footer-copy">
          <div>© {currentYear} <strong>ATS Resume</strong>. All Rights Reserved.</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Built by <strong style={{ color: "var(--text-heading)" }}>Mohd Zaid</strong>
          </div>
        </div>
      </div>
    </footer>
  );
}



