import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Target, Sparkles, Check, X, Lightbulb, ArrowLeft, Pencil, Copy, AlertTriangle } from "lucide-react";
import api, { apiError } from "../api/client.js";
import ScoreRing from "../components/ScoreRing.jsx";
import { scoreColor } from "../lib/score.js";

const SAMPLE_JDS = [
  {
    label: "Full-Stack Engineer",
    text: `We are seeking a Senior Full-Stack Developer to build and scale modern web applications.
Requirements:
- Strong experience with JavaScript, React.js, Node.js, and Express.js
- Proficiency in database design with MongoDB, PostgreSQL, and REST API architecture
- Familiarity with CI/CD, Git, Docker, System Design, and Cloud Services (AWS / GCP)
- Experience writing unit tests with Jest and optimizing performance
Responsibilities: Collaborate with cross-functional teams, ship clean code, and optimize scalable backends.`,
  },
  {
    label: "Data Scientist",
    text: `Looking for a Senior Data Scientist to design predictive machine learning models and NLP pipelines.
Requirements:
- Proficient in Python, SQL, PyTorch, TensorFlow, and Pandas
- Experience with Machine Learning algorithms, Data Science, and ETL pipelines
- Knowledge of Snowflake, Big Data processing, and Tableau data visualization
- Strong background in statistics and predictive modeling.`,
  },
  {
    label: "Product Manager",
    text: `Hiring a Product Manager to lead SaaS feature roadmap execution.
Requirements:
- 3+ years experience in SaaS Product Management, Agile & Scrum methodologies
- Strong skills in User Research, A/B Testing, Mixpanel, and Customer Discovery
- Ability to define wireframing requirements in Figma and prioritize backlog items in Jira.`,
  },
];

export default function Analyzer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState(id || "");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get("/resumes")
      .then((res) => {
        setResumes(res.data.resumes);
        if (!id && res.data.resumes[0]) setSelectedId(res.data.resumes[0]._id);
      })
      .catch((err) => toast.error(apiError(err)));
  }, [id]);

  const analyze = async () => {
    if (!selectedId) return toast.error("Select a resume first");
    if (jd.trim().length < 20) return toast.error("Paste a fuller job description");
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post("/ats/analyze", { resumeId: selectedId, jobDescription: jd });
      setResult(res.data.result);
    } catch (err) {
      toast.error(apiError(err, "Analysis failed"));
    } finally {
      setLoading(false);
    }
  };

  const copyKeyword = (kw) => {
    navigator.clipboard.writeText(kw);
    toast.success(`Copied "${kw}" to clipboard!`);
  };

  return (
    <div className="container">
      {/* Luxury Header */}
      <div className="dash-header-section" style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span className="area-eyebrow" style={{ marginBottom: "8px" }}>
              <Target size={13} color="#2D5016" /> ATS Screener Diagnostics & Job Match
            </span>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.3rem", fontWeight: 400, margin: "0 0 6px", color: "var(--text-heading)" }}>
              ATS Resume Analyzer
            </h1>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Score your resume against real job descriptions to identify missing keywords and formatting gaps.
            </p>
          </div>
          <button
            className="btn btn-ghost"
            style={{ borderRadius: "9999px", padding: "10px 20px", border: "1px solid var(--border-light)", background: "#FFFFFF" }}
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
        </div>
      </div>

      {resumes.length === 0 ? (
        <div className="empty-card" style={{ padding: "64px 32px", background: "#FFFFFF", borderRadius: "20px", textAlign: "center", border: "1px dashed var(--border-light)" }}>
          <Target size={44} style={{ color: "var(--primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 400, margin: "0 0 8px", color: "var(--text-heading)" }}>No Resume to Analyze</h3>
          <p style={{ maxWidth: "440px", margin: "0 auto 24px", color: "var(--text-muted)", fontSize: "0.95rem" }}>Create a resume first in your workspace, then come back to score it against target job descriptions.</p>
          <Link to="/dashboard" className="btn-area-cta" style={{ padding: "12px 28px", fontSize: "0.9rem" }}>
            Go to Workspace
          </Link>
        </div>
      ) : (
        <div className="analyzer-grid">
          {/* Input Card */}
          <div className="card card-pad" style={{ background: "#FFFFFF", border: "1px solid var(--border-light)", borderRadius: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)", padding: "28px" }}>
            <div className="field">
              <label style={{ fontWeight: 600, color: "var(--text-heading)", marginBottom: 8, fontSize: "0.9rem" }}>Select Resume</label>
              <select
                className="input"
                style={{ borderRadius: "12px", background: "var(--bg-subtle)", border: "1px solid var(--border-light)", padding: "10px 14px", fontSize: "0.92rem", fontWeight: 500 }}
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title} {r.personal?.fullName ? `— ${r.personal.fullName}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="field" style={{ marginTop: 20 }}>
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ marginBottom: 0, fontWeight: 600, color: "var(--text-heading)", fontSize: "0.9rem" }}>Target Job Description</label>
                <div className="row" style={{ gap: 6 }}>
                  {SAMPLE_JDS.map((s, idx) => (
                    <button
                      key={idx}
                      className="btn btn-ghost btn-sm"
                      style={{ borderRadius: "9999px", fontSize: "0.75rem", padding: "4px 10px", background: "var(--bg-subtle)", border: "1px solid var(--border-light)" }}
                      onClick={() => setJd(s.text)}
                      type="button"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                className="textarea"
                style={{ minHeight: 240, marginTop: 6, borderRadius: "12px", background: "var(--bg-subtle)", border: "1px solid var(--border-light)", padding: "14px", fontSize: "0.9rem", lineHeight: 1.5 }}
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the full job description here (skills, requirements, responsibilities)…"
              />
              <p className="field-hint" style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 6 }}>
                We extract key technical & role terminology and match them against your resume syntax.
              </p>
            </div>

            <button className="btn-area-cta" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "0.9rem", marginTop: 8 }} onClick={analyze} disabled={loading}>
              <Target size={18} /> {loading ? "Evaluating Match…" : "Analyze Resume Match"}
            </button>
            {selectedId && (
              <Link
                to={`/builder/${selectedId}`}
                className="btn btn-ghost btn-block"
                style={{ marginTop: 10, borderRadius: "9999px", fontSize: "0.85rem", padding: "10px", justifyContent: "center" }}
              >
                <Pencil size={15} /> Edit this Resume in Builder
              </Link>
            )}
          </div>

          {/* Results Card */}
          <div className="card card-pad" style={{ background: "#FFFFFF", border: "1px solid var(--border-light)", borderRadius: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)", padding: "28px" }}>
            {!result ? (
              <div className="empty" style={{ padding: "40px 10px" }}>
                <Sparkles size={40} />
                <h3>Your score appears here</h3>
                <p>Pick a resume, paste a job description, and hit Analyze.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Score header */}
                <div className="row" style={{ gap: 20, alignItems: "center" }}>
                  <ScoreRing score={result.score} />
                  <div>
                    <span
                      className="rating-badge"
                      style={{
                        background: `${scoreColor(result.score)}22`,
                        color: scoreColor(result.score),
                      }}
                    >
                      {result.rating}
                    </span>
                    <p style={{ margin: "10px 0 0", color: "var(--text-soft)", fontSize: "0.9rem" }}>
                      Matched <strong>{result.matchedKeywords.length}</strong> of{" "}
                      <strong>{result.totalKeywords}</strong> key terms · {result.wordCount} words
                    </p>
                  </div>
                </div>

                {/* Breakdown */}
                <h4 className="section-title" style={{ marginTop: 26 }}>
                  Score breakdown
                </h4>
                {result.breakdown.map((b) => (
                  <div className="breakdown-row" key={b.key}>
                    <div className="br-head">
                      <span>{b.label}</span>
                      <span style={{ color: scoreColor(b.score) }}>{b.score}%</span>
                    </div>
                    <div className="br-bar">
                      <div
                        className="br-fill"
                        style={{ width: `${b.score}%`, background: scoreColor(b.score) }}
                      />
                    </div>
                    <div className="br-tip">{b.tip}</div>
                  </div>
                ))}

                {/* Keywords */}
                <h4 className="section-title" style={{ marginTop: 22 }}>
                  Matched keywords ({result.matchedKeywords.length})
                </h4>
                {result.matchedKeywords.length ? (
                  <div className="keyword-cloud">
                    {result.matchedKeywords.map((k) => (
                      <span className="kw kw-match" key={k}>
                        <Check size={12} /> {k}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="br-tip">No overlap yet — add relevant keywords below.</p>
                )}

                {/* Critical Missing Skills Warning */}
                {result.criticalMissing?.length > 0 && (
                  <div className="weak-bullets-box" style={{ marginTop: 20, background: "#fef2f2", borderColor: "#fecaca" }}>
                    <h4 className="section-title" style={{ color: "#dc2626" }}>
                      <AlertTriangle size={14} style={{ verticalAlign: "-2px" }} /> Critical Missing Requirements ({result.criticalMissing.length})
                    </h4>
                    <p className="br-tip" style={{ marginBottom: 8, color: "#991b1b" }}>
                      These skills are explicitly listed as required in the job posting:
                    </p>
                    <div className="keyword-cloud">
                      {result.criticalMissing.map((k) => (
                        <span
                          className="kw kw-miss clickable-kw"
                          key={k}
                          onClick={() => copyKeyword(k)}
                          title="Click to copy keyword"
                          style={{ background: "#fee2e2", borderColor: "#fca5a5", color: "#991b1b" }}
                        >
                          <X size={12} /> {k} <Copy size={11} style={{ marginLeft: 2 }} />
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords */}
                <h4 className="section-title" style={{ marginTop: 22 }}>
                  Matched keywords ({result.matchedKeywords.length})
                </h4>
                {result.matchedKeywords.length ? (
                  <div className="keyword-cloud">
                    {result.matchedKeywords.map((k) => (
                      <span className="kw kw-match" key={k}>
                        <Check size={12} /> {k}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="br-tip">No overlap yet — add relevant keywords below.</p>
                )}

                <h4 className="section-title" style={{ marginTop: 18 }}>
                  Missing keywords ({result.missingKeywords.length}) <small style={{ textTransform: "none", fontWeight: "normal" }}>(Click to copy)</small>
                </h4>
                {result.missingKeywords.length ? (
                  <div className="keyword-cloud">
                    {result.missingKeywords.map((k) => (
                      <span
                        className="kw kw-miss clickable-kw"
                        key={k}
                        onClick={() => copyKeyword(k)}
                        title="Click to copy keyword"
                      >
                        <X size={12} /> {k} <Copy size={11} style={{ marginLeft: 2 }} />
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="br-tip">Great — you covered the key terms.</p>
                )}

                {/* Weak Bullets Warning */}
                {result.weakBullets?.length > 0 && (
                  <div className="weak-bullets-box" style={{ marginTop: 20 }}>
                    <h4 className="section-title" style={{ color: "#d97706" }}>
                      <AlertTriangle size={14} style={{ verticalAlign: "-2px" }} /> Weak Achievement Bullets
                    </h4>
                    <p className="br-tip" style={{ marginBottom: 8 }}>
                      These bullets don't start with strong action verbs (Led, Built, Engineered, Reduced):
                    </p>
                    <ul className="weak-bullets-list">
                      {result.weakBullets.map((wb, idx) => (
                        <li key={idx}>"{wb}"</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Strengths & Weaknesses */}
                {((result.strengths && result.strengths.length > 0) || (result.weaknesses && result.weaknesses.length > 0)) && (
                  <div className="grid-2" style={{ marginTop: 22 }}>
                    {result.strengths?.length > 0 && (
                      <div className="card-pad" style={{ padding: 14, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8 }}>
                        <h4 className="section-title" style={{ color: "#16a34a", marginBottom: 6 }}>
                          <Check size={14} style={{ verticalAlign: "-2px" }} /> Key Strengths
                        </h4>
                        <ul style={{ paddingLeft: 16, margin: 0, fontSize: "0.82rem", color: "#15803d" }}>
                          {result.strengths.map((st, i) => (
                            <li key={i}>{st}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.weaknesses?.length > 0 && (
                      <div className="card-pad" style={{ padding: 14, background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: 8 }}>
                        <h4 className="section-title" style={{ color: "#d97706", marginBottom: 6 }}>
                          <AlertTriangle size={14} style={{ verticalAlign: "-2px" }} /> Key Gaps
                        </h4>
                        <ul style={{ paddingLeft: 16, margin: 0, fontSize: "0.82rem", color: "#b45309" }}>
                          {result.weaknesses.map((wk, i) => (
                            <li key={i}>{wk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Suggestions */}
                <h4 className="section-title" style={{ marginTop: 22 }}>
                  <Lightbulb size={14} style={{ verticalAlign: "-2px" }} /> Actionable Suggestions
                </h4>
                {result.suggestions.map((s, i) => (
                  <div className="suggestion" key={i}>
                    <span className={`prio prio-${s.priority}`}>{s.priority}</span>
                    <span>{s.text}</span>
                  </div>
                ))}

              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

