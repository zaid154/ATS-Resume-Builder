import { Link } from "react-router-dom";
import {
  FileText,
  Heart,
  Shield,
  Sparkles,
  Globe,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Award,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      {/* Top accent line */}
      <div className="footer-top-glow" />

      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-col brand-col">
            <Link to="/" className="brand" style={{ marginBottom: 12, display: "inline-flex" }}>
              <span className="brand-mark">
                <FileText size={20} />
              </span>
              <span style={{ fontSize: "1.25rem", fontWeight: 800 }}>
                ATS<span className="brand-accent">Resume</span>
              </span>
            </Link>
            <p className="footer-desc">
              Build your resume, check it against job descriptions, and export ATS-friendly PDFs.
            </p>
            <div className="footer-badges">
              <span className="f-badge">
                <Shield size={13} color="var(--primary)" /> ATS Friendly
              </span>
              <span className="f-badge">
                <Zap size={13} color="#f59e0b" /> Live Scoring
              </span>
              <span className="f-badge">
                <Award size={13} color="#10b981" /> 16+ Templates
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li>
                <Link to={user ? "/dashboard" : "/login"}>
                  <Sparkles size={13} /> Resume Builder
                </Link>
              </li>
              <li>
                <Link to={user ? "/analyze" : "/login"}>
                  <Zap size={13} /> ATS Analyzer
                </Link>
              </li>
              <li>
                <Link to={user ? "/dashboard" : "/register"}>
                  <CheckCircle2 size={13} /> 16+ Presets
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="footer-col">
            <h4>Quick Nav</h4>
            <ul>
              {user ? (
                <>
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/analyze">Analyze Job</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Sign In</Link>
                  </li>
                  <li>
                    <Link to="/register">Create Account</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Developer */}
          <div className="footer-col developer-spotlight-col">
            <div className="dev-card">
              <div className="dev-card-header">
                <div className="dev-avatar">MZ</div>
                <div>
                  <div className="dev-name">
                    Mohd Zaid <span className="dev-verified">✔ Author</span>
                  </div>
                  <div className="dev-role">Full-Stack Developer</div>
                </div>
              </div>
              <p className="dev-bio">
                Built this project — resume builder, ATS scorer, and all the templates.
              </p>
              <div className="dev-links-grid">
                <a
                  href="https://portfolio-zeta-drab-97.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="dev-link-btn dev-link-primary"
                  title="Visit Portfolio"
                >
                  <Globe size={14} /> Portfolio <ExternalLink size={11} />
                </a>
                <a
                  href="https://github.com/zaid154"
                  target="_blank"
                  rel="noreferrer"
                  className="dev-link-btn"
                  title="GitHub Profile"
                >
                  <Github size={14} /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/mohd-zaid-794090231/"
                  target="_blank"
                  rel="noreferrer"
                  className="dev-link-btn"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
                <a
                  href="mailto:zaidm1323@gmail.com"
                  className="dev-link-btn"
                  title="Send Email"
                >
                  <Mail size={14} /> Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© {currentYear} <strong>ATS Resume Builder & Analyzer</strong>. Built by <strong>Mohd Zaid</strong>.</p>
          <div className="footer-bottom-links">
            <span className="row" style={{ gap: 6, alignItems: "center" }}>
              Crafted with <Heart size={14} style={{ color: "#ef4444", fill: "#ef4444" }} /> by <strong style={{ color: "var(--text-heading)" }}>Mohd Zaid</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}


