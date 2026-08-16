import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import api, { apiError } from "../api/client.js";

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
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h1>Forgot Password</h1>
        <p className="auth-sub">Enter your email to receive a password reset link.</p>

        <div className="field">
          <label>Email</label>
          <input
            className="input"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <button className="btn btn-primary btn-block" disabled={loading}>
          <Send size={18} /> {loading ? "Sending…" : "Send Reset Link"}
        </button>

        <p className="auth-alt">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
