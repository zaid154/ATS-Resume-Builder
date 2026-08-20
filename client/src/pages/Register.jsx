import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserPlus, User, Mail, Lock, Eye, EyeOff, Sparkles, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiError } from "../api/client.js";
import Logo from "../components/Logo.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created successfully!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(apiError(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-split-wrapper">
        {/* Left Side: Registration Form */}
        <div className="auth-form-side">
          <div style={{ marginBottom: "24px" }}>
            <Logo size="md" />
          </div>

          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.95rem", fontWeight: 400, color: "var(--text-heading)", margin: "0 0 6px" }}>
            Create your account
          </h1>
          <p style={{ margin: "0 0 24px", color: "var(--text-muted)", fontSize: "0.92rem" }}>
            Free forever. Build, score, and export unlimited ATS-friendly resumes.
          </p>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-heading)", marginBottom: "6px" }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  className="input"
                  style={{ paddingLeft: "42px", borderRadius: "12px", background: "var(--bg-subtle)", border: "1px solid var(--border-light)" }}
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Mohd Zaid"
                />
              </div>
            </div>

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
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-heading)", marginBottom: "6px" }}>
                Create Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  className="input"
                  style={{ paddingLeft: "42px", paddingRight: "42px", borderRadius: "12px", background: "var(--bg-subtle)", border: "1px solid var(--border-light)" }}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
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
              <UserPlus size={16} /> {loading ? "Creating Account…" : "Create Free Account ↗"}
            </button>
          </form>

          <p style={{ margin: "24px 0 0", fontSize: "0.88rem", color: "var(--text-muted)", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
              Sign in here ↗
            </Link>
          </p>
        </div>

        {/* Right Side: Editorial Feature Showcase */}
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
              <Sparkles size={13} color="#A3E635" /> 100% FREE CANDIDATE SUITE
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
              Join 50,000+ candidates landing higher-paying roles.
            </h2>

            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 24px" }}>
              Get instant access to 16+ recruiter-approved resume templates, live ATS scoring, and automated keyword match diagnostics.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#A3E635", display: "grid", placeItems: "center", color: "#182E11", flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>Unlimited Resumes & live version switching</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#A3E635", display: "grid", placeItems: "center", color: "#182E11", flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>Beat Workday, Taleo, Greenhouse & Lever screeners</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#A3E635", display: "grid", placeItems: "center", color: "#182E11", flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>No credit card required · Free forever</span>
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
              “The live keyword scoring engine pointed out 6 missing skills for the senior role I wanted. Landed the job with a 35% hike!”
            </div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#A3E635", marginTop: "6px" }}>
              Verified Candidate · Software Engineering
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
