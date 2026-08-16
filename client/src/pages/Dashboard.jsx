import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Plus,
  FileText,
  Pencil,
  Target,
  Copy,
  Trash2,
  FileStack,
  Search,
  Award,
  BarChart3,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import api, { apiError } from "../api/client.js";
import { scoreColor } from "../lib/score.js";
import { computeLiveScore } from "../lib/liveScore.js";
import ResumePreview, { TEMPLATES } from "../components/templates/index.jsx";




const BLANK = {
  title: "My Professional Resume",
  template: "modern",
  accent: "#2563eb",
  personal: {
    fullName: "Jane Doe",
    jobTitle: "Senior Software Engineer",
    email: "jane.doe@example.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    website: "janedoe.dev",
    linkedin: "linkedin.com/in/janedoe",
    github: "github.com/janedoe",
    summary:
      "Senior Software Engineer with 5+ years building microservices, REST/GraphQL APIs, and React apps. Reduced API latency by 45% and led engineering sprints.",
  },
  experience: [
    {
      company: "Tech Solutions Inc.",
      role: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: "Present",
      current: true,
      bullets: [
        "Built RESTful microservices handling 500k+ daily requests with Node.js and Express.",
        "Optimized MongoDB database indexing and aggregation pipelines, reducing query execution times by 40%.",
        "Collaborated in an agile team of 8 engineers to ship modern React.js web interfaces and design tokens.",
        "Set up CI/CD pipeline with GitHub Actions, speeding up releases by 35%.",
      ],
    },
    {
      company: "CloudScale Systems",
      role: "Full-Stack Developer",
      location: "Austin, TX",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      current: false,
      bullets: [
        "Built real-time collaborative dashboard features with WebSockets, React, and Redis.",
        "Automated SaaS subscription billing workflow integrating Stripe API for over 35,000 active users.",
        "Reduced AWS EC2 infrastructure costs by $14,000 annually through container auto-scaling.",
      ],
    },
  ],
  education: [
    {
      school: "California State University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "Sep 2015",
      endDate: "May 2019",
      grade: "3.8 GPA",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "REST API",
    "Docker",
    "AWS",
    "Git",
    "CI/CD",
  ],
  projects: [
    {
      name: "DevPulse - Realtime Monitoring",
      description: "Automated synthetic monitoring tool checking endpoint health every 60 seconds with Slack alerts.",
      link: "github.com/janedoe/devpulse",
      tech: ["Node.js", "React", "MongoDB", "Docker"],
    },
    {
      name: "Portfolio Platform",
      description: "Full-stack web application with user authentication, database auto-sync, and responsive design.",
      link: "github.com/janedoe/portfolio",
      tech: ["React", "Express", "Tailwind CSS"],
    },
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
    },
    {
      name: "MongoDB Certified Developer",
      issuer: "MongoDB Inc.",
      date: "2022",
    },
  ],
  languages: ["English (Native)", "Spanish (Professional)"],
};



export default function Dashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [templateCategory, setTemplateCategory] = useState("All");



  const load = async () => {
    try {
      const res = await api.get("/resumes");
      setResumes(res.data.resumes);
    } catch (err) {
      toast.error(apiError(err, "Could not load resumes"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createResume = async (initialData = BLANK) => {
    setCreating(true);
    try {
      const res = await api.post("/resumes", initialData);
      toast.success("Resume created");
      navigate(`/builder/${res.data.resume._id}`);
    } catch (err) {
      toast.error(apiError(err, "Could not create resume"));
      setCreating(false);
    }
  };

  const duplicate = async (id) => {
    try {
      await api.post(`/resumes/${id}/duplicate`);
      toast.success("Resume duplicated");
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const remove = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/resumes/${id}`);
      setResumes((r) => r.filter((x) => x._id !== id));
      toast.success("Resume deleted");
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    if (!resumes.length) return { count: 0, avgScore: null, maxScore: null };
    const scores = resumes.map((r) => r.lastScore ?? computeLiveScore(r).score);
    const count = resumes.length;
    const sum = scores.reduce((acc, s) => acc + s, 0);
    const avgScore = Math.round(sum / scores.length);
    const maxScore = Math.max(...scores);
    return { count, avgScore, maxScore };
  }, [resumes]);

  // Search filter
  const filteredResumes = useMemo(() => {
    if (!search.trim()) return resumes;
    const q = search.toLowerCase();
    return resumes.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.personal?.fullName?.toLowerCase().includes(q) ||
        r.personal?.jobTitle?.toLowerCase().includes(q) ||
        r.template?.toLowerCase().includes(q)
    );
  }, [resumes, search]);

  return (
    <div className="container">
      {/* Header */}
      <div className="page-head">
        <div>
          <h1>Resumes</h1>
          <p>Build, score, and manage your ATS-friendly professional resumes.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowTemplateModal(true)} disabled={creating}>
          <Plus size={18} /> {creating ? "Creating…" : "Create Resume"}
        </button>

      </div>

      {/* Stats Summary Row */}
      {resumes.length > 0 && (
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
              <FileStack size={20} />
            </div>
            <div>
              <div className="stat-val">{stats.count}</div>
              <div className="stat-lbl">Total Resumes</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
              <BarChart3 size={20} />
            </div>
            <div>
              <div className="stat-val">{stats.avgScore != null ? `${stats.avgScore}%` : "—"}</div>
              <div className="stat-lbl">Average ATS Score</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f3e8ff", color: "#7c3aed" }}>
              <Award size={20} />
            </div>
            <div>
              <div className="stat-val">{stats.maxScore != null ? `${stats.maxScore}%` : "—"}</div>
              <div className="stat-lbl">Highest Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      {resumes.length > 0 && (
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            className="input search-input"
            placeholder="Search resumes by title, candidate name, or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {loading ? (
        <div className="app-loader" style={{ minHeight: 240 }}>
          <div className="spinner" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="empty-card">
          <FileStack size={44} />
          <h3>No Resumes Yet</h3>
          <p>Create your first resume to score it against job descriptions and export to PDF.</p>
          <button className="btn btn-primary btn-lg" onClick={() => setShowTemplateModal(true)} disabled={creating}>
            <Plus size={18} /> Create Resume
          </button>

        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="empty-card" style={{ padding: "40px 20px" }}>
          <Search size={36} />
          <h3>No matching resumes found</h3>
          <p>No resume matches "{search}". Try searching another keyword.</p>
        </div>
      ) : (
        <div className="resume-grid">
          {filteredResumes.map((r, i) => {
            const displayScore = r.lastScore ?? computeLiveScore(r).score;
            return (
              <motion.div
                key={r._id}
                className="resume-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <div className="rc-top">
                  <div>
                    <h3>{r.title}</h3>
                    <div className="rc-sub">
                      {r.personal?.fullName || "Unnamed Candidate"}
                      {r.personal?.jobTitle ? ` · ${r.personal.jobTitle}` : ""}
                    </div>
                  </div>
                  <div
                    className="score-badge"
                    style={{ background: scoreColor(displayScore) }}
                    title="ATS score"
                  >
                    {displayScore}
                  </div>
                </div>


              <div className="row" style={{ gap: 8 }}>
                <span className="chip chip-template">
                  <FileText size={12} /> {r.template}
                </span>
                <span className="rc-sub">
                  Updated {new Date(r.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="rc-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/builder/${r._id}`)}
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate(`/analyze/${r._id}`)}
                >
                  <Target size={14} /> Analyze
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => duplicate(r._id)}
                  title="Duplicate"
                >
                  <Copy size={14} />
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => remove(r._id, r.title)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    )}

      {/* Clean 3-Column Visual Card Grid Template Chooser Modal */}
      {showTemplateModal && (
        <div className="preset-modal-backdrop" onClick={() => setShowTemplateModal(false)}>
          <div
            className="preset-modal"
            style={{ maxWidth: 1120, width: "95%", padding: 24, maxHeight: "90vh", borderRadius: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "var(--text-heading)" }}>
                  Choose a Resume Template
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                  Pick from 16 clean layouts — all designed to work well with ATS parsers.
                </p>
              </div>
              <button className="icon-btn" onClick={() => setShowTemplateModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 10,
                marginBottom: 16,
                borderBottom: "1px solid var(--border-light)",
              }}
            >
              {["All", "Popular", "Traditional", "Clean", "Modern", "Creative", "Tech"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTemplateCategory(cat)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    border: templateCategory === cat ? "1.5px solid var(--primary)" : "1px solid var(--border-light)",
                    background: templateCategory === cat ? "var(--primary)" : "#ffffff",
                    color: templateCategory === cat ? "#ffffff" : "var(--text-body)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat === "All" ? `All Templates (${TEMPLATES.length})` : cat}
                </button>
              ))}
            </div>

            {/* 3-Column Card Grid Container */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 18,
                maxHeight: "60vh",
                overflowY: "auto",
                paddingRight: 6,
                paddingBottom: 16,
              }}
            >
              {TEMPLATES.filter((t) => {
                if (templateCategory === "All") return true;
                return (t.badge || "").toLowerCase().includes(templateCategory.toLowerCase());
              }).map((t) => {
                const isSelected = selectedTemplate === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    style={{
                      background: "#ffffff",
                      borderRadius: 12,
                      border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-light)",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: isSelected
                        ? "0 8px 24px rgba(37,99,235,0.22)"
                        : "0 2px 8px rgba(0,0,0,0.05)",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                    }}
                  >
                    {/* Top Thumbnail Card Header */}
                    <div
                      style={{
                        height: 200,
                        background: "#f1f5f9",
                        overflow: "hidden",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingTop: 10,
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      {/* Badge tag */}
                      <span
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          zIndex: 10,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          background: "rgba(255,255,255,0.92)",
                          backdropFilter: "blur(4px)",
                          padding: "3px 8px",
                          borderRadius: 12,
                          color: "var(--primary)",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        {t.badge || "ATS Friendly"}
                      </span>

                      {isSelected && (
                        <div
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            zIndex: 10,
                            background: "var(--primary)",
                            color: "#ffffff",
                            borderRadius: "50%",
                            padding: 4,
                            boxShadow: "0 2px 6px rgba(37,99,235,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Check size={14} />
                        </div>
                      )}

                      {/* Mini Scaled Document Thumbnail */}
                      <div
                        style={{
                          width: 780,
                          height: 1040,
                          transform: "scale(0.24)",
                          transformOrigin: "top center",
                          background: "#ffffff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          borderRadius: 4,
                          pointerEvents: "none",
                          userSelect: "none",
                        }}
                      >
                        <ResumePreview data={{ ...BLANK, template: t.id }} showPageBreak={false} />
                      </div>
                    </div>

                    {/* Bottom Info Section */}
                    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-heading)" }}>
                        {t.name}
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.35, flex: 1 }}>
                        {t.desc}
                      </p>

                      <button
                        className={isSelected ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
                        style={{ marginTop: 10, width: "100%", justifyContent: "center" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTemplateModal(false);
                          createResume({ ...BLANK, template: t.id });
                        }}
                      >
                        {creating ? "Creating..." : `Use ${t.name} ✨`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div
              className="row"
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 14,
                marginTop: 8,
                borderTop: "1px solid var(--border-light)",
              }}
            >
              <div style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                Selected: <strong style={{ color: "var(--primary)" }}>{TEMPLATES.find((t) => t.id === selectedTemplate)?.name}</strong>
              </div>
              <div className="row" style={{ gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setShowTemplateModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowTemplateModal(false);
                    createResume({ ...BLANK, template: selectedTemplate });
                  }}
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Continue with Selected ✨"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

