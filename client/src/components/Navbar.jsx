import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard, Target, Sun, Moon, ShieldCheck, ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useState, useEffect, useRef } from "react";
import Logo from "./Logo.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("ats_theme") || "light";
  });

  const [allowThemeToggle, setAllowThemeToggle] = useState(() => {
    return localStorage.getItem("ats_allow_theme_toggle") !== "false";
  });
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = user?.role === "admin" || (user?.email && user.email.toLowerCase().includes("admin"));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ats_theme", theme);
  }, [theme]);

  useEffect(() => {
    const syncVisibility = () => {
      setAllowThemeToggle(localStorage.getItem("ats_allow_theme_toggle") !== "false");
    };
    window.addEventListener("ats_theme_config_change", syncVisibility);
    return () => window.removeEventListener("ats_theme_config_change", syncVisibility);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MZ";

  return (
    <header className="area-header-wrapper">
      <div className="area-header">
        <Link to={user ? "/dashboard" : "/"} style={{ textDecoration: "none", display: "inline-flex" }}>
          <Logo size="md" />
        </Link>

        {/* Center Floating Navigation */}
        <nav className="area-nav-pill">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`area-nav-link ${isActive("/dashboard") ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                to="/analyze"
                className={`area-nav-link ${isActive("/analyze") ? "active" : ""}`}
              >
                ATS Analyzer
              </Link>
              <a href="/#templates" className="area-nav-link">
                Templates
              </a>
              <a href="/#how-to" className="area-nav-link">
                Guide
              </a>
            </>
          ) : (
            <>
              <a href="/#benefits" className="area-nav-link">
                Features
              </a>
              <a href="/#templates" className="area-nav-link">
                Templates
              </a>
              <a href="/#scoring" className="area-nav-link">
                ATS Scoring
              </a>
              <a href="/#how-to" className="area-nav-link">
                How-to
              </a>
            </>
          )}
        </nav>

        {/* Right Action Area */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Theme toggle */}
          {allowThemeToggle && (
            <button
              className="icon-btn"
              onClick={toggleTheme}
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid var(--border-light)",
                background: "var(--bg-surface)",
                color: "var(--text-heading)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              {theme === "dark" ? <Sun size={16} color="#d4af37" /> : <Moon size={16} color="var(--primary)" />}
            </button>
          )}

          {user ? (
            <div 
              className="nav-user-chip" 
              title={user.email}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                position: "relative",
                cursor: "pointer",
                borderRadius: "9999px",
                padding: "5px 14px 5px 6px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)"
              }}
            >
              <span className="avatar-dot" style={{ borderRadius: "50%", background: "var(--primary)", width: 28, height: 28, display: "grid", placeItems: "center", color: "#fff", fontSize: "0.75rem", fontWeight: 700 }}>
                {userInitials}
              </span>
              <span className="user-name" style={{ fontWeight: 600, fontSize: "0.88rem" }}>{user.name}</span>
              
              {dropdownOpen && (
                <div 
                  className="user-dropdown-menu"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "10px",
                    background: "#FFFFFF",
                    border: "1px solid var(--border-light)",
                    borderRadius: "14px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    minWidth: "180px",
                    zIndex: 100,
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}
                >
                  <Link
                    to="/dashboard"
                    className="nav-link"
                    style={{ padding: "8px 12px", width: "100%", fontSize: "0.85rem", borderRadius: "8px" }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard size={15} />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/analyze"
                    className="nav-link"
                    style={{ padding: "8px 12px", width: "100%", fontSize: "0.85rem", borderRadius: "8px" }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Target size={15} />
                    <span>ATS Analyzer</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="nav-link"
                      style={{ padding: "8px 12px", width: "100%", fontSize: "0.85rem", borderRadius: "8px" }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ShieldCheck size={15} />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <button 
                    className="btn btn-ghost btn-sm" 
                    onClick={() => { handleLogout(); setDropdownOpen(false); }}
                    style={{ padding: "8px 12px", width: "100%", justifyContent: "flex-start", color: "var(--danger)", border: "none", fontSize: "0.85rem", borderRadius: "8px" }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link
                to="/login"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                  padding: "8px 14px",
                  textDecoration: "none"
                }}
              >
                Sign In
              </Link>
              <Link to="/register" className="btn-area-cta">
                Create Resume <ArrowUpRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


