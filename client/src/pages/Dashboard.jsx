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
  ShieldCheck,
  X,
  Check,
} from "lucide-react";
import api, { apiError } from "../api/client.js";
import { scoreColor } from "../lib/score.js";
import { computeLiveScore } from "../lib/liveScore.js";
import ResumePreview, { TEMPLATES } from "../components/templates/index.jsx";
import { useAuth } from "../context/AuthContext.jsx";




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
  const { user } = useAuth();
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
      {/* Luxury Editorial Dashboard Header */}
      <div className="dash-header-section" style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <span className="area-eyebrow" style={{ marginBottom: "10px" }}>
              <Sparkles size={13} color="#2D5016" /> Candidate Workspace · {user?.name || "Mohd Zaid"}
            </span>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", fontWeight: 400, margin: "0 0 6px", color: "var(--text-heading)", letterSpacing: "-0.02em" }}>
              Your Resume Portfolio
            </h1>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Manage, edit, and score your ATS-friendly career documents in real time.
            </p>
          </div>
          <button
            className="btn-area-cta"
            onClick={() => setShowTemplateModal(true)}
            disabled={creating}
            style={{ padding: "12px 26px", fontSize: "0.9rem" }}
          >
            <Plus size={18} /> {creating ? "Creating…" : "Create New Resume"}
          </button>
        </div>

        {/* Sleek Minimal Stats Bar */}
        {resumes.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginTop: "28px",
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-light)",
                borderRadius: "16px",
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background: "var(--bg-subtle)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--primary)",
                }}
              >
                <FileText size={22} />
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-heading)", lineHeight: 1.1 }}>
                  {stats.count}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "4px" }}>
                  Active Resumes
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-light)",
                borderRadius: "16px",
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background: "#EBF5EA",
                  display: "grid",
                  placeItems: "center",
                  color: "#2D5016",
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2D5016", lineHeight: 1.1 }}>
                  {stats.avgScore != null ? `${stats.avgScore}%` : "—"}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "4px" }}>
                  Average ATS Score
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-light)",
                borderRadius: "16px",
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background: "#FEF7E6",
                  display: "grid",
                  placeItems: "center",
                  color: "#B45309",
                }}
              >
                <Target size={22} />
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#B45309", lineHeight: 1.1 }}>
                  {stats.maxScore != null ? `${stats.maxScore}%` : "—"}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "4px" }}>
                  Highest Screener Score
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Input */}
      {resumes.length > 0 && (
        <div className="search-wrap" style={{ marginBottom: "28px" }}>
          <Search size={18} className="search-icon" style={{ color: "var(--text-muted)" }} />
          <input
            className="input search-input"
            style={{
              borderRadius: "9999px",
              background: "#FFFFFF",
              border: "1px solid var(--border-light)",
              padding: "12px 20px 12px 46px",
              fontSize: "0.92rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
            placeholder="Search resumes by title, candidate name, or target role…"
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
        <div className="empty-card" style={{ padding: "64px 32px", background: "#FFFFFF", border: "1px dashed var(--border-light)", borderRadius: "20px", textAlign: "center" }}>
          <FileStack size={44} style={{ color: "var(--primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 400, margin: "0 0 8px", color: "var(--text-heading)" }}>
            No Resumes in Workspace
          </h3>
          <p style={{ maxWidth: "460px", margin: "0 auto 24px", color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Create your first resume to score it against target job descriptions and export print-ready PDFs.
          </p>
          <button className="btn-area-cta" onClick={() => setShowTemplateModal(true)} disabled={creating} style={{ padding: "12px 28px", fontSize: "0.9rem" }}>
            <Plus size={18} /> Create Your First Resume
          </button>
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="empty-card" style={{ padding: "48px 24px", background: "#FFFFFF", borderRadius: "20px", textAlign: "center", border: "1px solid var(--border-light)" }}>
          <Search size={32} style={{ color: "var(--text-muted)", margin: "0 auto 12px" }} />
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 400, margin: "0 0 6px" }}>No matching resumes found</h3>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>No resume matches "{search}". Try searching another keyword.</p>
        </div>
      ) : (
        <div className="resume-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {filteredResumes.map((r, i) => {
            const displayScore = r.lastScore ?? computeLiveScore(r).score;
            const isExcellent = displayScore >= 85;
            const isGood = displayScore >= 70;
            return (
              <motion.div
                key={r._id}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border-light)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.25s ease",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                }}
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)", borderColor: "var(--primary)" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                {/* Card Top Banner / Metadata */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-subtle)" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "capitalize", color: "var(--primary)", background: "#FFFFFF", padding: "3px 10px", borderRadius: "9999px", border: "1px solid var(--border-light)" }}>
                    📄 {r.template || "Modern Clean"}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: "20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-heading)", margin: "0 0 6px", lineHeight: 1.3 }}>
                      {r.title}
                    </h3>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontWeight: 600, color: "var(--text-body)" }}>{r.personal?.fullName || "Candidate"}</span>
                      {r.personal?.jobTitle && <span>• {r.personal.jobTitle}</span>}
                    </div>
                  </div>

                  {/* Live Score Pill Box */}
                  <div style={{
                    background: isExcellent ? "#EBF5EA" : isGood ? "#FEF7E6" : "#FDF2F2",
                    border: `1px solid ${isExcellent ? "#D2E7C8" : isGood ? "#F5DEB3" : "#F5C6C7"}`,
                    borderRadius: "12px",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "auto",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ fontSize: "1.2rem", fontWeight: 800, color: isExcellent ? "#2D5016" : isGood ? "#B45309" : "#9E2A2B" }}>
                        {displayScore}%
                      </div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: isExcellent ? "#2D5016" : isGood ? "#B45309" : "#9E2A2B" }}>
                        {isExcellent ? "Excellent ATS Match" : isGood ? "Good Potential" : "Needs Optimization"}
                      </div>
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>Live Score</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", background: "#FFFFFF" }}>
                  <button
                    className="btn-area-cta"
                    style={{ flex: 1, padding: "8px 14px", fontSize: "0.82rem", justifyContent: "center" }}
                    onClick={() => navigate(`/builder/${r._id}`)}
                  >
                    <Pencil size={14} /> Edit Resume
                  </button>

                  <button
                    className="icon-btn"
                    style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--border-light)", background: "var(--bg-subtle)", display: "grid", placeItems: "center", cursor: "pointer" }}
                    onClick={() => navigate(`/analyze/${r._id}`)}
                    title="Analyze Job Match"
                  >
                    <Target size={15} color="var(--primary)" />
                  </button>

                  <button
                    className="icon-btn"
                    style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--border-light)", background: "var(--bg-subtle)", display: "grid", placeItems: "center", cursor: "pointer" }}
                    onClick={() => duplicate(r._id)}
                    title="Duplicate Resume"
                  >
                    <Copy size={14} color="var(--text-body)" />
                  </button>

                  <button
                    className="icon-btn"
                    style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--border-light)", background: "var(--bg-subtle)", display: "grid", placeItems: "center", cursor: "pointer" }}
                    onClick={() => remove(r._id, r.title)}
                    title="Delete Resume"
                  >
                    <Trash2 size={14} color="var(--danger)" />
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
            style={{ maxWidth: 1120, width: "95%", padding: 24, maxHeight: "90vh", borderRadius: 'var(--radius-lg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "1.4rem", fontWeight: 700, margin: 0, color: "var(--text-heading)" }}>
                  Choose a Resume Template
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                  Pick from 16 ATS-optimized designs built for recruiters and automated screeners.
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
                paddingBottom: 12,
                marginBottom: 20,
                borderBottom: "1px solid var(--border-light)",
              }}
            >
              {["All", "Popular", "Traditional", "Clean", "Modern", "Creative", "Tech"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTemplateCategory(cat)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "9999px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    border: templateCategory === cat ? "1px solid var(--primary)" : "1px solid var(--border-light)",
                    background: templateCategory === cat ? "var(--primary)" : "transparent",
                    color: templateCategory === cat ? "#ffffff" : "var(--text-body)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
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
                gap: 20,
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
                      background: "#FFFFFF",
                      borderRadius: "12px",
                      border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-light)",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: isSelected
                        ? "0 6px 20px rgba(43, 58, 36, 0.15)"
                        : "0 2px 8px rgba(0,0,0,0.03)",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                    }}
                  >
                    {/* Top Thumbnail Card Header */}
                    <div
                      style={{
                        height: 200,
                        background: "var(--bg-subtle)",
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
                          background: "#FFFFFF",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          color: "var(--primary)",
                          border: "1px solid var(--border-light)",
                        }}
                      >
                        {t.badge || "ATS Ready"}
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
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
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
                          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                          borderRadius: 2,
                          pointerEvents: "none",
                          userSelect: "none",
                        }}
                      >
                        <ResumePreview data={{ ...BLANK, template: t.id }} showPageBreak={false} />
                      </div>
                    </div>

                    {/* Bottom Info Section */}
                    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                      <h4 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: "1rem", fontWeight: 700, color: "var(--text-heading)" }}>
                        {t.name}
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4, flex: 1 }}>
                        {t.desc}
                      </p>

                      <button
                        className="btn-area-cta"
                        style={{ marginTop: 10, width: "100%", justifyContent: "center", padding: "8px 12px", fontSize: "0.8rem" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTemplateModal(false);
                          createResume({ ...BLANK, template: t.id });
                        }}
                      >
                        {creating ? "Creating..." : `Use ${t.name}`}
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
                paddingTop: 16,
                marginTop: 8,
                borderTop: "1px solid var(--border-light)",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Selected: <strong style={{ color: "var(--primary)" }}>{TEMPLATES.find((t) => t.id === selectedTemplate)?.name}</strong>
              </div>
              <div className="row" style={{ gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setShowTemplateModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn-area-cta"
                  style={{ padding: "10px 22px", fontSize: "0.85rem" }}
                  onClick={() => {
                    setShowTemplateModal(false);
                    createResume({ ...BLANK, template: selectedTemplate });
                  }}
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Continue with Selected"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

