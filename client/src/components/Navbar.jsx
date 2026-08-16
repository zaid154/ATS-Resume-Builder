import { Link, useNavigate, useLocation } from "react-router-dom";
import { FileText, LogOut, LayoutDashboard, Target, Sparkles, Sun, Moon, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useState, useEffect } from "react";

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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleThemeVisibility = () => {
    const nextVal = !allowThemeToggle;
    setAllowThemeToggle(nextVal);
    localStorage.setItem("ats_allow_theme_toggle", nextVal ? "true" : "false");
    window.dispatchEvent(new Event("ats_theme_config_change"));
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
    : "U";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to={user ? "/dashboard" : "/"} className="brand">
          <span className="brand-mark">
            <FileText size={18} />
          </span>
          <span>
            ATS<span className="brand-accent">Resume</span>
          </span>
        </Link>

        <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Admin: show/hide theme toggle */}
          {isAdmin && (
            <button
              onClick={toggleThemeVisibility}
              title={allowThemeToggle ? "Hide theme toggle for users" : "Show theme toggle for users"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 16,
                fontSize: "0.74rem",
                fontWeight: 700,
                border: allowThemeToggle ? "1px solid #3b82f6" : "1px solid #ef4444",
                background: allowThemeToggle ? "rgba(59, 130, 246, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: allowThemeToggle ? "#3b82f6" : "#ef4444",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <ShieldCheck size={13} />
              <span>Theme Switcher: {allowThemeToggle ? "Visible" : "Hidden"}</span>
              {allowThemeToggle ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>
          )}

          {/* Theme toggle */}
          {(allowThemeToggle || isAdmin) && (
            <button
              className="icon-btn"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              style={{
                borderRadius: "50%",
                width: 36,
                height: 36,
                border: "1px solid var(--border-light)",
                background: "var(--bg-subtle)",
                color: "var(--text-heading)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              {theme === "dark" ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#64748b" />}
            </button>
          )}


          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/analyze"
                className={`nav-link ${isActive("/analyze") ? "active" : ""}`}
              >
                <Target size={16} />
                <span>Analyzer</span>
              </Link>

              <div className="nav-user-chip" title={user.email}>
                <span className="avatar-dot">{userInitials}</span>
                <span className="user-name">{user.name}</span>
              </div>

              <button className="btn btn-ghost btn-sm" onClick={handleLogout} title="Logout">
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${isActive("/login") ? "active" : ""}`}
              >
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get started <Sparkles size={14} />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}


