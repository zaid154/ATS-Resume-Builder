import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Layout,
  Target,
  ArrowUpRight,
  Check,
  X,
  Leaf,
  FileText
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ResumePreview, { TEMPLATES } from "../components/templates/index.jsx";
import { PRESETS } from "../lib/presets.js";

const SAMPLE_PREVIEW = PRESETS[0].data;

export default function Landing() {
  const { user } = useAuth();
  const ctaTo = user ? "/dashboard" : "/register";
  const [templateCategory, setTemplateCategory] = useState("All");

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (templateCategory === "All") return true;
    return (t.badge || "").toLowerCase().includes(templateCategory.toLowerCase()) ||
           (t.name || "").toLowerCase().includes(templateCategory.toLowerCase());
  });

  return (
    <main style={{ minHeight: "100vh", paddingBottom: "40px" }}>
      {/* 1. HERO SECTION (Area Style with Botanical Accents) */}
      <section id="benefits" className="area-hero">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="area-eyebrow">
            <Leaf size={13} color="#2D5016" /> Benefits
          </span>
          <h1>We've cracked the code.</h1>
          <p className="lead">
            ATS Resume provides real screener insights, without the formatting overload.
          </p>
        </motion.div>

        {/* 4-Column Feature Row */}
        <div className="area-features-row">
          <div className="area-feature-col">
            <Sparkles size={20} className="area-feat-icon" />
            <h3>Amplify ATS Score</h3>
            <p>
              Unlock data-driven decisions with comprehensive keyword diagnostics and live job description matching.
            </p>
          </div>

          <div className="area-feature-col">
            <ShieldCheck size={20} className="area-feat-icon" />
            <h3>Bypass Machine Filters</h3>
            <p>
              Engineered with 100% parser compliance for Workday, Taleo, Greenhouse, and Lever screeners.
            </p>
          </div>

          <div className="area-feature-col">
            <Layout size={20} className="area-feat-icon" />
            <h3>16 Precision Layouts</h3>
            <p>
              Clean single & 2-column designs with custom typography, balanced spacing, and instant PDF export.
            </p>
          </div>

          <div className="area-feature-col">
            <Target size={20} className="area-feat-icon" />
            <h3>Visualize Job Match</h3>
            <p>
              Generate precise, visually compelling reports that illustrate your score and missing keywords.
            </p>
          </div>
        </div>
      </section>

      {/* 2. PANORAMIC CURVED IMAGE LANDSCAPE */}
      <section className="area-panoramic-box">
        <motion.img
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85"
          alt="Panoramic mountain landscape"
          className="area-panoramic-img"
        />
      </section>

      {/* 3. DEDICATED TEMPLATES SHOWCASE SECTION (#templates) */}
      <section id="templates" style={{ maxWidth: "1240px", margin: "0 auto 120px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="area-eyebrow">
            <Layout size={13} color="#2D5016" /> 16 Precision Layouts
          </span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 400, margin: "0 0 12px", color: "var(--text-heading)" }}>
            ATS-Optimized Resume Templates
          </h2>
          <p style={{ margin: "0 auto", maxWidth: "600px", color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Engineered to pass Workday, Taleo, Greenhouse, and Lever screeners with 100% parsing accuracy.
          </p>

          {/* Filter Pills */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginTop: "24px" }}>
            {["All", "Popular", "Clean", "2-Column", "Engineering", "Editorial", "Leadership", "Creative"].map((cat) => (
              <button
                key={cat}
                onClick={() => setTemplateCategory(cat)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: templateCategory === cat ? "1px solid var(--primary)" : "1px solid var(--border-light)",
                  background: templateCategory === cat ? "var(--primary)" : "#FFFFFF",
                  color: templateCategory === cat ? "#FFFFFF" : "var(--text-body)",
                  boxShadow: templateCategory === cat ? "0 4px 12px rgba(35, 61, 24, 0.2)" : "none",
                }}
              >
                {cat === "All" ? `All Templates (${TEMPLATES.length})` : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {filteredTemplates.map((t) => (
            <div
              key={t.id}
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-light)",
                borderRadius: "20px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                transition: "all 0.25s ease",
              }}
            >
              {/* Scaled Preview Document Frame */}
              <div
                style={{
                  height: "220px",
                  background: "var(--bg-subtle)",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingTop: "12px",
                  borderBottom: "1px solid var(--border-light)",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    zIndex: 10,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    background: "#FFFFFF",
                    color: "var(--primary)",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    border: "1px solid var(--border-light)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  {t.badge || "ATS Ready"}
                </span>

                <div
                  style={{
                    width: 780,
                    height: 1040,
                    transform: "scale(0.24)",
                    transformOrigin: "top center",
                    background: "#ffffff",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    borderRadius: 4,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  <ResumePreview data={{ ...SAMPLE_PREVIEW, template: t.id }} showPageBreak={false} />
                </div>
              </div>

              {/* Card Info */}
              <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 600, color: "var(--text-heading)", margin: 0 }}>
                  {t.name}
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.4, flex: 1 }}>
                  {t.desc}
                </p>

                <Link
                  to={ctaTo}
                  className="btn-area-cta"
                  style={{ width: "100%", justifyContent: "center", padding: "9px 14px", fontSize: "0.82rem" }}
                >
                  Use This Template <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SPLIT SECTION ("See the Big Picture") */}
      <section id="big-picture" className="area-split-section">
        <div className="area-split-left">
          <h2>See the Big Picture</h2>
          <p className="sub">
            ATS Resume turns your experience into clear, high-scoring resumes that recruiters and screeners love.
          </p>

          <div className="area-numbered-list">
            <div className="area-num-item">
              <span className="num" style={{ color: "#3E6528" }}>01</span>
              <div>
                <strong>Spot Keyword Gaps:</strong> No more guessing which skills matter for the job.
              </div>
            </div>

            <div className="area-num-item">
              <span className="num" style={{ color: "#3E6528" }}>02</span>
              <div>
                <strong>Beat Parser Errors:</strong> 100% clean layouts with zero multi-column bugs.
              </div>
            </div>

            <div className="area-num-item">
              <span className="num" style={{ color: "#3E6528" }}>03</span>
              <div>
                <strong>Make Presentations Pop:</strong> 16 professional templates keep hiring managers engaged.
              </div>
            </div>

            <div className="area-num-item">
              <span className="num" style={{ color: "#3E6528" }}>04</span>
              <div>
                <strong>Your Live ATS Snapshot:</strong> Get an instant 0–100% score before submitting your application.
              </div>
            </div>
          </div>

          <Link to={ctaTo} className="btn-area-discover">
            Discover More
          </Link>
        </div>

        <div className="area-beige-card">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
            alt="Minimal architectural podium"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "24px" }}
          />
        </div>
      </section>

      {/* 5. CAREER GROWTH & GREEN SIGNAL SECTION */}
      <section style={{ maxWidth: "1200px", margin: "0 auto 100px", padding: "0 24px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #1E3314 0%, #2A461E 100%)",
            borderRadius: "28px",
            padding: "48px 40px",
            color: "#FFFFFF",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "36px",
            alignItems: "center",
            boxShadow: "0 12px 36px rgba(30, 51, 20, 0.15)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.15)",
                padding: "5px 14px",
                borderRadius: "9999px",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                marginBottom: "18px",
                backdropFilter: "blur(8px)",
              }}
            >
              <Leaf size={14} color="#A3E635" /> CAREER ACCELERATION & LIVE ATS SCORING
            </div>

            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.2rem",
                fontWeight: 400,
                lineHeight: 1.2,
                margin: "0 0 16px",
                color: "#FFFFFF",
              }}
            >
              Turn every application into a 90%+ green signal.
            </h3>

            <p style={{ margin: "0 0 24px", color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              Over 75% of resumes get filtered out by automated screeners before reaching a human recruiter. ATS Resume diagnoses keyword gaps, fixes hidden layout flaws, and helps you land 3x more interview callbacks.
            </p>

            {/* Micro Metrics Row */}
            <div style={{ display: "flex", gap: "24px", marginBottom: "28px", flexWrap: "wrap" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#A3E635" }}>94%</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>Avg Match Boost</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#A3E635" }}>3x</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>More Interviews</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#A3E635" }}>100%</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>Parser Friendly</div>
              </div>
            </div>

            <Link
              to={ctaTo}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#FFFFFF",
                color: "#1E3314",
                fontWeight: 600,
                fontSize: "0.88rem",
                padding: "12px 26px",
                borderRadius: "9999px",
                textDecoration: "none",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}
            >
              Create Your High-Score Resume <ArrowUpRight size={15} />
            </Link>
          </div>

          <div style={{ height: "340px", borderRadius: "20px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85"
              alt="Bright modern workplace with lush indoor plants and focused workspace"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* 6. SPECS / COMPARISON TABLE SECTION */}
      <section id="scoring" className="area-table-section">
        <span className="area-eyebrow">Specs</span>
        <h2>Why Choose ATS Resume?</h2>
        <p className="sub">
          You need a resume that actually gets interviews. That's why we developed ATS Resume with machine-level scoring.
        </p>

        <Link to={ctaTo} className="btn-area-discover">
          Discover More
        </Link>

        <div className="area-comparison-grid">
          {/* Highlighted ATS Resume Column */}
          <div className="area-comp-col highlight">
            <div className="area-comp-title">ATS Resume</div>
            <div className="area-comp-list">
              <div className="area-comp-item positive">
                <Check size={16} color="#2B3A24" />
                <span>100% ATS parser compliance</span>
              </div>
              <div className="area-comp-item positive">
                <Check size={16} color="#2B3A24" />
                <span>Live JD keyword analysis</span>
              </div>
              <div className="area-comp-item positive">
                <Check size={16} color="#2B3A24" />
                <span>16 professional templates</span>
              </div>
              <div className="area-comp-item positive">
                <Check size={16} color="#2B3A24" />
                <span>Vectorized clean PDF export</span>
              </div>
              <div className="area-comp-item positive">
                <Check size={16} color="#2B3A24" />
                <span>Full UTF-8 support</span>
              </div>
            </div>
          </div>

          {/* WebSurge Column */}
          <div className="area-comp-col">
            <div className="area-comp-title">WebSurge</div>
            <div className="area-comp-list">
              <div className="area-comp-item positive">
                <Check size={16} color="#5A6654" />
                <span>Basic templates</span>
              </div>
              <div className="area-comp-item positive">
                <Check size={16} color="#5A6654" />
                <span>Basic AI recommendations</span>
              </div>
              <div className="area-comp-item negative">
                <X size={16} color="#9E2A2B" />
                <span>Restricts customization</span>
              </div>
              <div className="area-comp-item negative">
                <X size={16} color="#9E2A2B" />
                <span>Monthly subscription lock-in</span>
              </div>
              <div className="area-comp-item negative">
                <X size={16} color="#9E2A2B" />
                <span>Potential display errors</span>
              </div>
            </div>
          </div>

          {/* HyperView Column */}
          <div className="area-comp-col">
            <div className="area-comp-title">HyperView</div>
            <div className="area-comp-list">
              <div className="area-comp-item negative">
                <X size={16} color="#9E2A2B" />
                <span>Broken multi-column parsing</span>
              </div>
              <div className="area-comp-item negative">
                <X size={16} color="#9E2A2B" />
                <span>No AI assistance</span>
              </div>
              <div className="area-comp-item negative">
                <X size={16} color="#9E2A2B" />
                <span>Steep learning curve</span>
              </div>
              <div className="area-comp-item negative">
                <X size={16} color="#9E2A2B" />
                <span>Layout shifts on export</span>
              </div>
              <div className="area-comp-item negative">
                <X size={16} color="#9E2A2B" />
                <span>Partial UTF-8 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIAL SPLIT (ORIGINAL ZEN BALANCING SPHERES) */}
      <section className="area-testimonial-split">
        <div className="area-zen-img-box">
          <img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85"
            alt="Zen balancing stone spheres"
            className="area-zen-img"
          />
        </div>

        <div>
          <div className="area-quote-text">
            “I was skeptical, but ATS Resume completely transformed my job search. The keyword match diagnostics are so clear, and after optimizing my bullet points I landed 4 interview calls in one week.”
          </div>
          <div className="area-quote-author">Mohd Zaid</div>
          <div className="area-quote-role">Full-Stack Engineer & Creator</div>
        </div>
      </section>

      {/* 8. STEP FLOW GRID ("Map Your Success") */}
      <section id="how-to" className="area-steps-section">
        <div className="area-steps-header">
          <h2>Map Your Success</h2>
          <Link to={ctaTo} className="btn-area-discover">
            Discover More
          </Link>
        </div>

        <div className="area-steps-grid">
          <div className="area-step-card">
            <div className="step-num" style={{ color: "#3E6528" }}>01</div>
            <h3>Pick a Layout</h3>
            <p>
              Choose from 16 ATS-tested templates built for engineering, management, design, and business.
            </p>
          </div>

          <div className="area-step-card">
            <div className="step-num" style={{ color: "#3E6528" }}>02</div>
            <h3>Match Your Target Job</h3>
            <p>
              Paste any job description to see matching keywords, missing skills, and live ATS score.
            </p>
          </div>

          <div className="area-step-card">
            <div className="step-num" style={{ color: "#3E6528" }}>03</div>
            <h3>Grow Your Career</h3>
            <p>
              Download print-ready, vectorized A4 PDF resumes and land your dream job interviews.
            </p>
          </div>
        </div>
      </section>

      {/* 9. ORIGINAL COASTAL CURVED BANNER + "Connect with us" */}
      <section id="contact" className="area-panoramic-box" style={{ marginBottom: "40px" }}>
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
          alt="Coastal mountain road"
          className="area-panoramic-img"
        />
      </section>

      <section className="area-connect-section">
        <h2>Connect with us</h2>
        <p>
          Create your resume in minutes and test it against real job descriptions to turn your experience into an advantage.
        </p>
        <Link to={ctaTo} className="btn-area-cta" style={{ padding: "14px 36px", fontSize: "0.95rem" }}>
          Create Resume Now <ArrowUpRight size={16} />
        </Link>
      </section>
    </main>
  );
}
