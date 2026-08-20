import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock, Eye, EyeOff, Sparkles, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiError } from "../api/client.js";
import Logo from "../components/Logo.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      toast.error(apiError(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-split-wrapper">
        {/* Left Side: Form */}
        <div className="auth-form-side">
          <div style={{ marginBottom: "24px" }}>
            <Logo size="md" />
          </div>

          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.95rem", fontWeight: 400, color: "var(--text-heading)", margin: "0 0 6px" }}>
            Welcome back
          </h1>
          <p style={{ margin: "0 0 24px", color: "var(--text-muted)", fontSize: "0.92rem" }}>
            Sign in to access your resumes, ATS analytics, and exports.
          </p>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-heading)", marginBottom: "6px" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  className="input"
                  style={{ paddingLeft: "42px", borderRadius: "12px", background: "var(--bg-subtle)", border: "1px solid var(--border-light)" }}
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-heading)", margin: 0 }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ fontSize: "0.82rem", color: "var(--primary)", fontWeight: 500, textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  className="input"
                  style={{ paddingLeft: "42px", paddingRight: "42px", borderRadius: "12px", background: "var(--bg-subtle)", border: "1px solid var(--border-light)" }}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-area-cta"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: "0.92rem", marginTop: "8px" }}
            >
              <LogIn size={16} /> {loading ? "Signing in…" : "Sign In to Workspace"}
            </button>
          </form>

          <p style={{ margin: "24px 0 0", fontSize: "0.88rem", color: "var(--text-muted)", textAlign: "center" }}>
            New to ATS Resume?{" "}
            <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
              Create an account ↗
            </Link>
          </p>
        </div>

        {/* Right Side: Editorial Showcase */}
        <div className="auth-showcase-side">
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.15)",
                padding: "4px 12px",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                marginBottom: "20px",
                backdropFilter: "blur(8px)",
              }}
            >
              <Sparkles size={13} color="#A3E635" /> SMART ATS PLATFORM
            </div>

            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.85rem",
                fontWeight: 400,
                lineHeight: 1.3,
                margin: "0 0 14px",
                color: "#FFFFFF",
              }}
            >
              Turn every job application into a 90%+ green signal.
            </h2>

            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 24px" }}>
              Build ATS-friendly resumes, diagnose keyword gaps with live scoring heuristics, and export pixel-perfect PDFs in seconds.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#A3E635", display: "grid", placeItems: "center", color: "#182E11", flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>16+ ATS-tested recruiter-approved layouts</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#A3E635", display: "grid", placeItems: "center", color: "#182E11", flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>Instant Job Description match analysis</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#A3E635", display: "grid", placeItems: "center", color: "#182E11", flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>100% Vectorized selectable PDF export</span>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "32px",
              padding: "14px 18px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div style={{ fontSize: "0.82rem", fontStyle: "italic", color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
              “ATS Resume helped me fix my bullet points and spot missing keywords. Got 4 interview calls in one week.”
            </div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#A3E635", marginTop: "6px" }}>
              Mohd Zaid · Full-Stack Developer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
