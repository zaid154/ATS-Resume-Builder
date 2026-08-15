// Shared rendering helpers for resume templates.

export function dateRange(start, end, current) {
  const e = current ? "Present" : end;
  if (start && e) return `${start} – ${e}`;
  return start || e || "";
}

export function contactList(p = {}) {
  return [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean);
}

export function hasArr(a) {
  return Array.isArray(a) && a.length > 0;
}

// Renders a work / project / education section with a generic item shape.
export function Bullets({ items }) {
  const clean = (items || []).filter((b) => b && b.trim());
  if (!clean.length) return null;
  return (
    <ul>
      {clean.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}

export function EmptyDocGuide() {
  return (
    <div
      className="rd-empty-guide"
      style={{
        padding: "50px 24px",
        textAlign: "center",
        color: "#64748b",
        border: "2px dashed #cbd5e1",
        borderRadius: "12px",
        marginTop: "24px",
        background: "#f8fafc",
      }}
    >
      <h3 style={{ fontSize: "17px", color: "#334155", marginBottom: "8px", fontWeight: "700" }}>
        Live Resume Preview Canvas
      </h3>
      <p style={{ fontSize: "13px", color: "#64748b", maxWidth: "42ch", margin: "0 auto" }}>
        Fill out your personal info, experience, education, and skills in the left editor panel (or click <strong>Presets</strong>) to watch your resume build in real time.
      </p>
    </div>
  );
}

