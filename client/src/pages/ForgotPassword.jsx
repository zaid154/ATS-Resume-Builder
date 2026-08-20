import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Send, Mail, ArrowLeft } from "lucide-react";
import api, { apiError } from "../api/client.js";
import Logo from "../components/Logo.jsx";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent to your email!");
      setEmail("");
    } catch (err) {
      toast.error(apiError(err, "Failed to send reset link"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container" style={{ minHeight: "calc(100vh - 120px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#FFFFFF",
          borderRadius: "24px",
          border: "1px solid var(--border-light)",
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.05)",
          padding: "44px 36px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <Logo size="md" />
        </div>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.9rem", fontWeight: 400, color: "var(--text-heading)", margin: "0 0 6px", textAlign: "center" }}>
          Forgot Password?
        </h1>
        <p style={{ margin: "0 0 28px", color: "var(--text-muted)", fontSize: "0.92rem", textAlign: "center" }}>
          Enter your registered email address and we'll send you a secure link to reset your password.
        </p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-area-cta"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: "0.92rem", marginTop: "6px" }}
          >
            <Send size={16} /> {loading ? "Sending Link…" : "Send Reset Link"}
          </button>
        </form>

        <div style={{ marginTop: "28px", textAlign: "center" }}>
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.88rem",
              color: "var(--text-body)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={15} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
