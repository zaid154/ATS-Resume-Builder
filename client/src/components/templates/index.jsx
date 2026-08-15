import { forwardRef } from "react";
import ModernTemplate from "./ModernTemplate.jsx";
import ClassicTemplate from "./ClassicTemplate.jsx";
import MinimalTemplate from "./MinimalTemplate.jsx";
import ElegantTemplate from "./ElegantTemplate.jsx";
import TechTemplate from "./TechTemplate.jsx";
import CorporateTemplate from "./CorporateTemplate.jsx";
import CompactTemplate from "./CompactTemplate.jsx";
import MinimalSerifTemplate from "./MinimalSerifTemplate.jsx";
import TimelineTemplate from "./TimelineTemplate.jsx";
import CreativeTemplate from "./CreativeTemplate.jsx";
import AcademicTemplate from "./AcademicTemplate.jsx";
import BoldTemplate from "./BoldTemplate.jsx";
import CleanGridTemplate from "./CleanGridTemplate.jsx";
import SlateTemplate from "./SlateTemplate.jsx";
import StartupTemplate from "./StartupTemplate.jsx";
import SwissTemplate from "./SwissTemplate.jsx";
import "./resume.css";

export const TEMPLATES = [
  { id: "modern", name: "Modern Corporate", badge: "Popular", desc: "Clean single-column ATS layout with primary accent bar", Component: ModernTemplate },
  { id: "classic", name: "Ivy Classic", badge: "Traditional", desc: "Classic serif typography designed for Finance, Law & Advisory", Component: ClassicTemplate },
  { id: "minimal", name: "Silicon Minimal", badge: "Clean", desc: "Minimalist tech layout with thin dividers and crisp hierarchy", Component: MinimalTemplate },
  { id: "elegant", name: "Executive Sidebar", badge: "2-Column", desc: "Sophisticated 2-column sidebar layout for Senior Leadership", Component: ElegantTemplate },
  { id: "tech", name: "Tech Lead & Dev", badge: "Engineering", desc: "Developer-focused design with code tech stack badges", Component: TechTemplate },
  { id: "corporate", name: "Fortune 500 Banner", badge: "Corporate", desc: "High-impact header banner for Enterprise & Consulting roles", Component: CorporateTemplate },
  { id: "compact", name: "Dense One-Pager", badge: "Max Density", desc: "Maximized content space for candidates with extensive experience", Component: CompactTemplate },
  { id: "minimal_serif", name: "Editorial Serif", badge: "Editorial", desc: "Refined editorial typography for Product Managers & Writers", Component: MinimalSerifTemplate },
  { id: "timeline", name: "Career Timeline", badge: "Timeline", desc: "Visual chronological timeline layout emphasizing career growth", Component: TimelineTemplate },
  { id: "creative", name: "Product & Design", badge: "Creative", desc: "Modern visual aesthetic tailored for UX Designers & Creative Leads", Component: CreativeTemplate },
  { id: "academic", name: "Academic Research", badge: "Academic", desc: "Structured layout for Research, Higher Education & CVs", Component: AcademicTemplate },
  { id: "bold", name: "Bold Block Header", badge: "Leadership", desc: "Bold header blocks making a strong executive first impression", Component: BoldTemplate },
  { id: "clean_grid", name: "Clean Grid", badge: "Grid", desc: "Structured 2-column grid organizing experience and technical skills", Component: CleanGridTemplate },
  { id: "slate", name: "Professional Slate", badge: "Slate", desc: "Subtle slate accents with high-contrast readable typography", Component: SlateTemplate },
  { id: "startup", name: "Startup Founder & PM", badge: "Startup", desc: "Dynamic startup style highlighting impact, metrics & initiatives", Component: StartupTemplate },
  { id: "swiss", name: "Swiss Minimalist", badge: "Swiss", desc: "Grid-aligned Swiss typography with ultra-clean white space", Component: SwissTemplate },
];


export const ACCENTS = [
  "#2563eb", // Royal Blue
  "#0ea5e9", // Ocean Cyan
  "#7c3aed", // Deep Purple
  "#db2777", // Emerald Pink
  "#059669", // Mint Green
  "#ea580c", // Sunset Orange
  "#0f172a", // Obsidian Dark
  "#475569", // Slate Slate
];

// Renders the chosen template with the accent colour applied via CSS variable.
const ResumePreview = forwardRef(function ResumePreview(
  { data, showPageBreak = false, fitContent = false },
  ref
) {
  const tpl = TEMPLATES.find((t) => t.id === data.template) || TEMPLATES[0];
  const Template = tpl.Component;
  return (
    <div
      ref={ref}
      style={{
        "--accent": data.accent || "#2563eb",
        "--doc-min-height": fitContent ? "auto" : "1040px",
        position: "relative",
      }}
    >
      <Template data={data} />
      {showPageBreak && !fitContent && <div className="a4-page-break-line" />}
    </div>
  );
});




export default ResumePreview;
