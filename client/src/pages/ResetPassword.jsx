import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { KeyRound } from "lucide-react";
import api, { apiError } from "../api/client.js";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { 
        password: form.password, 
        confirmPassword: form.confirmPassword 
      });
      toast.success("Password reset successfully! You can now log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(apiError(err, "Failed to reset password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h1>Reset Password</h1>
        <p className="auth-sub">Enter your new password below.</p>

        <div className="field">
          <label>New Password</label>
          <input
            className="input"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>
        <div className="field">
          <label>Confirm Password</label>
          <input
            className="input"
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="••••••••"
          />
        </div>

        <button className="btn btn-primary btn-block" disabled={loading}>
          <KeyRound size={18} /> {loading ? "Resetting…" : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
