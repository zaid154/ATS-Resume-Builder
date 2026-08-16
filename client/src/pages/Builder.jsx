import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Palette,
  Plus,
  Trash2,
  Download,
  Target,
  Check,
  Loader2,
  Save,
  ChevronUp,
  ChevronDown,
  Sparkles,
  FileJson,
  Copy,
  Upload,
  ZoomIn,
  ZoomOut,
  Eye,
  Maximize2,
  X,
} from "lucide-react";
import api, { apiError } from "../api/client.js";
import ResumePreview, { TEMPLATES, ACCENTS } from "../components/templates/index.jsx";
import Section from "../components/builder/Section.jsx";
import TagInput from "../components/builder/TagInput.jsx";

import { computeLiveScore } from "../lib/liveScore.js";
import { PRESETS } from "../lib/presets.js";
import { scoreColor } from "../lib/score.js";

const BLANK = {
  experience: { company: "", role: "", location: "", startDate: "", endDate: "", current: false, bullets: [""] },
  education: { school: "", degree: "", field: "", startDate: "", endDate: "", grade: "" },
  projects: { name: "", description: "", link: "", tech: [] },
  certifications: { name: "", issuer: "", date: "" },
};

export default function Builder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [saveState, setSaveState] = useState("saved"); // saved | dirty | saving
  const [showPresets, setShowPresets] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [zoom, setZoom] = useState(0.7);
  const [fullPreview, setFullPreview] = useState(false);
  const skipSave = useRef(true);
  const fileInputRef = useRef(null);



  // ---- Load ----
  useEffect(() => {
    let alive = true;
    api
      .get(`/resumes/${id}`)
      .then((res) => {
        if (alive) setData(res.data.resume);
      })
      .catch((err) => {
        toast.error(apiError(err, "Resume not found"));
        navigate("/dashboard");
      });
    return () => {
      alive = false;
    };
  }, [id, navigate]);

  // ---- Debounced autosave ----
  useEffect(() => {
    if (!data) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    setSaveState("dirty");
    const t = setTimeout(() => save(data), 1100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // ---- Warn on unsaved changes ----
  useEffect(() => {
    const handler = (e) => {
      if (saveState !== "saved") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [saveState]);

  const save = async (snapshot) => {
    setSaveState("saving");
    try {
      const currentScore = computeLiveScore(snapshot).score;
      // eslint-disable-next-line no-unused-vars
      const { _id, user, createdAt, updatedAt, __v, ...payload } = snapshot;
      await api.put(`/resumes/${id}`, { ...payload, lastScore: currentScore });
      setSaveState("saved");
    } catch (err) {
      toast.error(apiError(err, "Save failed"));
      setSaveState("dirty");
    }
  };


  // ---- Update helpers ----
  const patch = (partial) => setData((d) => ({ ...d, ...partial }));
  const setPersonal = (key, val) =>
    setData((d) => ({ ...d, personal: { ...d.personal, [key]: val } }));

  const setItem = (section, index, key, val) =>
    setData((d) => {
      const list = [...d[section]];
      list[index] = { ...list[index], [key]: val };
      return { ...d, [section]: list };
    });
  const addItem = (section) =>
    setData((d) => ({ ...d, [section]: [...d[section], { ...BLANK[section] }] }));
  const removeItem = (section, index) =>
    setData((d) => ({ ...d, [section]: d[section].filter((_, i) => i !== index) }));

  const moveItem = (section, index, direction) => {
    setData((d) => {
      const list = [...d[section]];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return d;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...d, [section]: list };
    });
  };

  const setBullet = (ei, bi, val) =>
    setData((d) => {
      const exp = [...d.experience];
      const bullets = [...exp[ei].bullets];
      bullets[bi] = val;
      exp[ei] = { ...exp[ei], bullets };
      return { ...d, experience: exp };
    });
  const addBullet = (ei) =>
    setData((d) => {
      const exp = [...d.experience];
      exp[ei] = { ...exp[ei], bullets: [...exp[ei].bullets, ""] };
      return { ...d, experience: exp };
    });
  const removeBullet = (ei, bi) =>
    setData((d) => {
      const exp = [...d.experience];
      exp[ei] = { ...exp[ei], bullets: exp[ei].bullets.filter((_, i) => i !== bi) };
      return { ...d, experience: exp };
    });

  const exportPDF = () => {
    const prev = document.title;
    document.title = data.title || "resume";
    window.print();
    setTimeout(() => (document.title = prev), 600);
  };

  const exportJSON = () => {
    if (!data) return;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.title || "resume").toLowerCase().replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON backup exported!");
  };

  const importJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.personal || parsed.experience || parsed.skills) {
          patch({
            title: parsed.title || data.title,
            template: parsed.template || data.template,
            accent: parsed.accent || data.accent,
            personal: { ...data.personal, ...parsed.personal },
            experience: parsed.experience || data.experience,
            education: parsed.education || data.education,
            projects: parsed.projects || data.projects,
            certifications: parsed.certifications || data.certifications,
            skills: parsed.skills || data.skills,
            languages: parsed.languages || data.languages,
          });
          toast.success("Resume data imported!");
        } else {
          toast.error("Invalid resume JSON structure");
        }
      } catch (err) {
        toast.error("Could not parse JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const copyPlainText = () => {
    if (!data) return;
    const p = data.personal || {};
    let text = `${p.fullName || "Resume"}\n`;
    if (p.jobTitle) text += `${p.jobTitle}\n`;
    const contacts = [p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(
      Boolean
    );
    if (contacts.length) text += `${contacts.join(" | ")}\n`;
    if (p.summary) text += `\nSUMMARY:\n${p.summary}\n`;

    if (data.experience?.length) {
      text += `\nEXPERIENCE:\n`;
      data.experience.forEach((e) => {
        text += `${e.role || "Role"} - ${e.company || "Company"} (${e.startDate || ""} ${
          e.current ? "Present" : e.endDate || ""
        })\n`;
        if (e.location) text += `${e.location}\n`;
        (e.bullets || []).forEach((b) => {
          if (b.trim()) text += `• ${b}\n`;
        });
        text += `\n`;
      });
    }

    if (data.education?.length) {
      text += `EDUCATION:\n`;
      data.education.forEach((e) => {
        text += `${e.degree || "Degree"} in ${e.field || "Field"} - ${e.school || ""}\n`;
      });
      text += `\n`;
    }

    if (data.skills?.length) {
      text += `SKILLS:\n${data.skills.join(", ")}\n`;
    }

    navigator.clipboard.writeText(text);
    toast.success("Plain text resume copied to clipboard!");
  };

  const loadPreset = (presetData) => {
    if (window.confirm("Replace current content with this sample preset?")) {
      patch(presetData);
      toast.success("Preset loaded!");
      setShowPresets(false);
    }
  };

  const liveStats = data ? computeLiveScore(data) : { score: 0, label: "Empty" };

  if (!data) {
    return (
      <div className="app-loader">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="builder-workspace">
      <div className="builder-toolbar">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={16} />
        </button>

        <input
          className="title-input"
          value={data.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Resume title"
        />

        <div className="live-score-pill" style={{ borderColor: scoreColor(liveStats.score) }}>
          <span className="dot" style={{ background: scoreColor(liveStats.score) }} />
          <span>ATS Strength:</span>
          <strong style={{ color: scoreColor(liveStats.score) }}>{liveStats.score}/100</strong>
          <small>({liveStats.label})</small>
        </div>

        <span className={`save-state ${saveState}`}>
          {saveState === "saving" ? (
            <>
              <Loader2 size={14} className="spin-inline" /> Saving…
            </>
          ) : saveState === "dirty" ? (
            <>Unsaved changes</>
          ) : (
            <>
              <Check size={14} /> Saved
            </>
          )}
        </span>

        <div className="toolbar-spacer" />

        {/* Action controls */}
        <div className="builder-toolbar-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowPresets(!showPresets)}
            title="Load sample resume preset"
          >
            <Sparkles size={15} /> Presets
          </button>

          <Link className="btn btn-ghost btn-sm" to={`/analyze/${id}`}>
            <Target size={15} /> Analyze
          </Link>

          <div className="more-menu-wrapper">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
            >
              Tools <ChevronDown size={14} />
            </button>
            {showMoreMenu && (
              <div className="more-menu-popover" onClick={() => setShowMoreMenu(false)}>
                <button className="more-menu-item" onClick={exportJSON}>
                  <FileJson size={14} /> Backup JSON
                </button>
                <button className="more-menu-item" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={14} /> Import JSON
                </button>
                <button className="more-menu-item" onClick={copyPlainText}>
                  <Copy size={14} /> Copy Plain Text
                </button>
                <button className="more-menu-item" onClick={() => save(data)}>
                  <Save size={14} /> Save Snapshot
                </button>
              </div>
            )}
          </div>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={importJSON}
            style={{ display: "none" }}
          />

          <button className="btn btn-primary btn-sm" onClick={exportPDF}>
            <Download size={15} /> Download PDF
          </button>
        </div>
      </div>

      {/* Preset Modal Selector */}
      {showPresets && (
        <div className="preset-modal-backdrop" onClick={() => setShowPresets(false)}>
          <div className="preset-modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              <Sparkles size={18} style={{ verticalAlign: "-3px", color: "var(--primary)" }} /> Choose a Sample Preset
            </h3>
            <p className="rc-sub">
              Load a sample resume to quickly test templates or get started.
            </p>
            <div className="preset-list">
              {PRESETS.map((p) => (
                <div className="preset-card" key={p.id} onClick={() => loadPreset(p.data)}>
                  <h4>{p.name}</h4>
                  <p>{p.data.personal.summary.slice(0, 100)}…</p>
                  <div className="preset-tags">
                    {p.data.skills.slice(0, 5).map((s) => (
                      <span className="tag" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost btn-block" onClick={() => setShowPresets(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="builder-body">
        {/* ---------------- Editor ---------------- */}
        <div className="editor-scroll-panel">
          {/* Personal */}
          <Section icon={User} title="Personal details">
            <div className="grid-2">
              <div className="field">
                <label>Full name</label>
                <input
                  className="input"
                  value={data.personal.fullName}
                  onChange={(e) => setPersonal("fullName", e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="field">
                <label>Job title</label>
                <input
                  className="input"
                  value={data.personal.jobTitle}
                  onChange={(e) => setPersonal("jobTitle", e.target.value)}
                  placeholder="Frontend Engineer"
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  className="input"
                  value={data.personal.email}
                  onChange={(e) => setPersonal("email", e.target.value)}
                  placeholder="jane@email.com"
                />
              </div>
              <div className="field">
                <label>Phone</label>
                <input
                  className="input"
                  value={data.personal.phone}
                  onChange={(e) => setPersonal("phone", e.target.value)}
                  placeholder="+1 555 123 4567"
                />
              </div>
              <div className="field">
                <label>Location</label>
                <input
                  className="input"
                  value={data.personal.location}
                  onChange={(e) => setPersonal("location", e.target.value)}
                  placeholder="Berlin, Germany"
                />
              </div>
              <div className="field">
                <label>Website / Portfolio</label>
                <input
                  className="input"
                  value={data.personal.website}
                  onChange={(e) => setPersonal("website", e.target.value)}
                  placeholder="janedoe.dev"
                />
              </div>
              <div className="field">
                <label>LinkedIn</label>
                <input
                  className="input"
                  value={data.personal.linkedin}
                  onChange={(e) => setPersonal("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/jane"
                />
              </div>
              <div className="field">
                <label>GitHub</label>
                <input
                  className="input"
                  value={data.personal.github}
                  onChange={(e) => setPersonal("github", e.target.value)}
                  placeholder="github.com/jane"
                />
              </div>
            </div>
            <div className="field">
              <label>Professional summary</label>
              <textarea
                className="textarea"
                value={data.personal.summary}
                onChange={(e) => setPersonal("summary", e.target.value)}
                placeholder="2–3 lines summarizing your experience, strengths and what you're looking for."
              />
            </div>
          </Section>

          {/* Experience */}
          <Section icon={Briefcase} title="Experience" count={data.experience.length}>
            {data.experience.map((e, i) => (
              <div className="item-block" key={i}>
                <div className="item-head">
                  <span>Experience {i + 1}</span>
                  <div className="row" style={{ gap: 4 }}>
                    <button
                      className="icon-btn"
                      onClick={() => moveItem("experience", i, -1)}
                      disabled={i === 0}
                      title="Move up"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => moveItem("experience", i, 1)}
                      disabled={i === data.experience.length - 1}
                      title="Move down"
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button className="icon-btn" onClick={() => removeItem("experience", i)} title="Remove">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="field">
                    <label>Role</label>
                    <input
                      className="input"
                      value={e.role}
                      onChange={(ev) => setItem("experience", i, "role", ev.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Company</label>
                    <input
                      className="input"
                      value={e.company}
                      onChange={(ev) => setItem("experience", i, "company", ev.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Start</label>
                    <input
                      className="input"
                      value={e.startDate}
                      onChange={(ev) => setItem("experience", i, "startDate", ev.target.value)}
                      placeholder="Jan 2022"
                    />
                  </div>
                  <div className="field">
                    <label>End</label>
                    <input
                      className="input"
                      value={e.endDate}
                      onChange={(ev) => setItem("experience", i, "endDate", ev.target.value)}
                      placeholder="Present"
                      disabled={e.current}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Location</label>
                  <input
                    className="input"
                    value={e.location}
                    onChange={(ev) => setItem("experience", i, "location", ev.target.value)}
                  />
                </div>
                <label className="row" style={{ fontSize: "0.85rem", gap: 6, marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    checked={e.current}
                    onChange={(ev) => setItem("experience", i, "current", ev.target.checked)}
                  />
                  I currently work here
                </label>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-soft)" }}>
                  Achievements
                </label>
                {e.bullets.map((b, bi) => (
                  <div className="bullet-row" key={bi}>
                    <textarea
                      className="textarea"
                      value={b}
                      onChange={(ev) => setBullet(i, bi, ev.target.value)}
                      placeholder="Led… / Built… / Reduced… (start with an action verb, add numbers)"
                    />
                    <button className="icon-btn" onClick={() => removeBullet(i, bi)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button className="add-btn" onClick={() => addBullet(i)}>
                  <Plus size={15} /> Add achievement
                </button>
              </div>
            ))}
            <button className="add-btn" onClick={() => addItem("experience")}>
              <Plus size={16} /> Add experience
            </button>
          </Section>

          {/* Education */}
          <Section icon={GraduationCap} title="Education" count={data.education.length}>
            {data.education.map((e, i) => (
              <div className="item-block" key={i}>
                <div className="item-head">
                  <span>Education {i + 1}</span>
                  <div className="row" style={{ gap: 4 }}>
                    <button
                      className="icon-btn"
                      onClick={() => moveItem("education", i, -1)}
                      disabled={i === 0}
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => moveItem("education", i, 1)}
                      disabled={i === data.education.length - 1}
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button className="icon-btn" onClick={() => removeItem("education", i)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="field">
                    <label>School</label>
                    <input
                      className="input"
                      value={e.school}
                      onChange={(ev) => setItem("education", i, "school", ev.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Degree</label>
                    <input
                      className="input"
                      value={e.degree}
                      onChange={(ev) => setItem("education", i, "degree", ev.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Field of study</label>
                    <input
                      className="input"
                      value={e.field}
                      onChange={(ev) => setItem("education", i, "field", ev.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Grade / GPA</label>
                    <input
                      className="input"
                      value={e.grade}
                      onChange={(ev) => setItem("education", i, "grade", ev.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Start</label>
                    <input
                      className="input"
                      value={e.startDate}
                      onChange={(ev) => setItem("education", i, "startDate", ev.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>End</label>
                    <input
                      className="input"
                      value={e.endDate}
                      onChange={(ev) => setItem("education", i, "endDate", ev.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={() => addItem("education")}>
              <Plus size={16} /> Add education
            </button>
          </Section>

          {/* Skills */}
          <Section icon={Wrench} title="Skills" count={data.skills.length}>
            <TagInput
              value={data.skills}
              onChange={(skills) => patch({ skills })}
              placeholder="e.g. React, Node.js, TypeScript — Enter to add"
            />
          </Section>

          {/* Projects */}
          <Section icon={FolderGit2} title="Projects" count={data.projects.length}>
            {data.projects.map((pr, i) => (
              <div className="item-block" key={i}>
                <div className="item-head">
                  <span>Project {i + 1}</span>
                  <div className="row" style={{ gap: 4 }}>
                    <button
                      className="icon-btn"
                      onClick={() => moveItem("projects", i, -1)}
                      disabled={i === 0}
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => moveItem("projects", i, 1)}
                      disabled={i === data.projects.length - 1}
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button className="icon-btn" onClick={() => removeItem("projects", i)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="field">
                  <label>Name</label>
                  <input
                    className="input"
                    value={pr.name}
                    onChange={(ev) => setItem("projects", i, "name", ev.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Description</label>
                  <textarea
                    className="textarea"
                    value={pr.description}
                    onChange={(ev) => setItem("projects", i, "description", ev.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Link</label>
                  <input
                    className="input"
                    value={pr.link}
                    onChange={(ev) => setItem("projects", i, "link", ev.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Tech used</label>
                  <TagInput
                    value={pr.tech}
                    onChange={(tech) => setItem("projects", i, "tech", tech)}
                  />
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={() => addItem("projects")}>
              <Plus size={16} /> Add project
            </button>
          </Section>

          {/* Certifications & languages */}
          <Section icon={Award} title="Certifications & languages" defaultOpen={false}>
            {data.certifications.map((c, i) => (
              <div className="item-block" key={i}>
                <div className="item-head">
                  <span>Certification {i + 1}</span>
                  <div className="row" style={{ gap: 4 }}>
                    <button
                      className="icon-btn"
                      onClick={() => moveItem("certifications", i, -1)}
                      disabled={i === 0}
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => moveItem("certifications", i, 1)}
                      disabled={i === data.certifications.length - 1}
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button className="icon-btn" onClick={() => removeItem("certifications", i)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="field">
                    <label>Name</label>
                    <input
                      className="input"
                      value={c.name}
                      onChange={(ev) => setItem("certifications", i, "name", ev.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Issuer</label>
                    <input
                      className="input"
                      value={c.issuer}
                      onChange={(ev) => setItem("certifications", i, "issuer", ev.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={() => addItem("certifications")}>
              <Plus size={16} /> Add certification
            </button>
            <div className="field" style={{ marginTop: 16 }}>
              <label>Languages</label>
              <TagInput
                value={data.languages}
                onChange={(languages) => patch({ languages })}
                placeholder="e.g. English, Hindi, German"
              />
            </div>
          </Section>

          {/* Design */}
          <Section icon={Palette} title="Design">
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-soft)" }}>
              Template
            </label>
            <div className="template-picker" style={{ marginTop: 8 }}>
              {TEMPLATES.map((t) => (
                <div
                  key={t.id}
                  className={`template-opt ${data.template === t.id ? "active" : ""}`}
                  onClick={() => patch({ template: t.id })}
                >
                  <div className="template-thumb" />
                  {t.name}
                </div>
              ))}
            </div>
            <label
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--text-soft)",
                display: "block",
                margin: "16px 0 8px",
              }}
            >
              Accent colour
            </label>
            <div className="accent-row">
              {ACCENTS.map((c) => (
                <span
                  key={c}
                  className={`accent-dot ${data.accent === c ? "active" : ""}`}
                  style={{ background: c }}
                  onClick={() => patch({ accent: c })}
                />
              ))}
              <label
                className="accent-dot custom-color-picker"
                title="Custom color"
                style={{ background: data.accent || "#2563eb", display: "inline-grid", placeItems: "center" }}
              >
                <input
                  type="color"
                  value={data.accent || "#2563eb"}
                  onChange={(e) => patch({ accent: e.target.value })}
                  style={{ opacity: 0, width: 0, height: 0, cursor: "pointer" }}
                />
                <span style={{ color: "#fff", fontSize: "10px", fontWeight: "bold" }}>+</span>
              </label>
            </div>
          </Section>
        </div>

        {/* ---------------- Preview ---------------- */}
        <div className="preview-sticky-panel">
          <div className="preview-controls">
            <div className="row" style={{ gap: 8 }}>
              <span className="pv-label">
                <Eye size={14} /> Live Canvas
              </span>
              <select
                className="select-template-quick"
                value={data.template || "modern"}
                onChange={(e) => patch({ template: e.target.value })}
                title="Quick Template Switcher"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    🎨 {t.name}
                  </option>
                ))}
              </select>
              <span
                style={{
                  color: "#16a34a",
                  fontSize: "0.72rem",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  padding: "2px 8px",
                  borderRadius: 12,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                📄 1 Page A4 Standard
              </span>
            </div>


            <div className="row" style={{ gap: 4 }}>
              <button
                className="btn btn-ghost btn-sm"
                style={{ padding: "3px 7px" }}
                onClick={() => setZoom((z) => Math.max(0.4, z - 0.08))}
                title="Zoom out"
              >
                <ZoomOut size={13} />
              </button>
              <span className="zoom-val">{Math.round(zoom * 100)}%</span>
              <button
                className="btn btn-ghost btn-sm"
                style={{ padding: "3px 7px" }}
                onClick={() => setZoom((z) => Math.min(1.2, z + 0.08))}
                title="Zoom in"
              >
                <ZoomIn size={13} />
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ padding: "3px 8px", fontSize: "0.75rem" }}
                onClick={() => setZoom(0.7)}
                title="Fit to screen"
              >
                Fit
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ padding: "3px 7px" }}
                onClick={() => setFullPreview(true)}
                title="Full screen view"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          <div className="preview-frame">
            <div
              className="preview-scaler-wrapper"
              style={{
                width: `${Math.round(780 * zoom)}px`,
                height: `${Math.round(1040 * zoom)}px`,
                position: "relative",
                flexShrink: 0,
              }}
            >
              <div
                className="preview-scaler-inner"
                style={{
                  width: "780px",
                  transformOrigin: "top left",
                  transform: `scale(${zoom})`,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                }}
              >
                <ResumePreview data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {fullPreview && (
        <div className="fullscreen-modal-backdrop" onClick={() => setFullPreview(false)}>
          <div className="fullscreen-modal-head" onClick={(e) => e.stopPropagation()}>
            <span className="row" style={{ gap: 8, fontSize: "1.1rem", fontWeight: 700 }}>
              <Eye size={18} /> Fullscreen Resume Canvas
            </span>
            <button className="btn btn-ghost btn-sm" onClick={() => setFullPreview(false)}>
              <X size={18} /> Close
            </button>
          </div>
          <div className="fullscreen-modal-body" onClick={(e) => e.stopPropagation()}>
            <ResumePreview data={data} />
          </div>
        </div>
      )}
    </div>
  );
}



