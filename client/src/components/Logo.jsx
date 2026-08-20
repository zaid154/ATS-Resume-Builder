export default function Logo({
  size = "md",
  variant = "full",
  showBadge = false,
  badgeText = "ATS 90+",
  style = {},
  className = "",
}) {
  const sizes = {
    sm: { img: 30, fontSize: "1.15rem", radius: 8, badgeFont: "0.65rem", gap: "8px" },
    md: { img: 38, fontSize: "1.4rem", radius: 10, badgeFont: "0.7rem", gap: "10px" },
    lg: { img: 48, fontSize: "1.7rem", radius: 12, badgeFont: "0.75rem", gap: "12px" },
    xl: { img: 64, fontSize: "2.2rem", radius: 16, badgeFont: "0.85rem", gap: "16px" },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div
      className={`ats-brand-logo ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        textDecoration: "none",
        userSelect: "none",
        ...style,
      }}
    >
      {/* 3D High-End Matte Green Tile Icon */}
      <img
        src="/logo-3d.png"
        alt="ATS Resume"
        style={{
          width: s.img,
          height: s.img,
          borderRadius: s.radius,
          objectFit: "cover",
          flexShrink: 0,
          boxShadow: "0 3px 10px rgba(27, 49, 20, 0.15)",
        }}
      />

      {/* Typography Lockup */}
      {variant !== "icon-only" && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", lineHeight: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontFamily: "var(--font-sans)",
              fontSize: s.fontSize,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: "var(--text-heading)",
            }}
          >
            ATS
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--primary)",
                marginLeft: "2px",
                letterSpacing: "-0.01em",
              }}
            >
              Resume
            </span>
          </div>

          {showBadge && (
            <span
              style={{
                fontSize: s.badgeFont,
                fontWeight: 700,
                color: "#2D5016",
                background: "#EBF5EA",
                padding: "2px 7px",
                borderRadius: "9999px",
                border: "1px solid #D2E7C8",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
