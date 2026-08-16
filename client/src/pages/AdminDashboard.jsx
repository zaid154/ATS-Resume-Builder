import { useEffect, useState } from "react";
import { Users, FileText, Trash2, ShieldCheck, Calendar, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api, { apiError } from "../api/client.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [allowThemeToggle, setAllowThemeToggle] = useState(() => {
    return localStorage.getItem("ats_allow_theme_toggle") !== "false";
  });

  useEffect(() => {
    const syncVisibility = () => {
      setAllowThemeToggle(localStorage.getItem("ats_allow_theme_toggle") !== "false");
    };
    window.addEventListener("ats_theme_config_change", syncVisibility);
    return () => window.removeEventListener("ats_theme_config_change", syncVisibility);
  }, []);

  const toggleThemeVisibility = () => {
    const nextVal = !allowThemeToggle;
    setAllowThemeToggle(nextVal);
    localStorage.setItem("ats_allow_theme_toggle", nextVal ? "true" : "false");
    window.dispatchEvent(new Event("ats_theme_config_change"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users")
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
    } catch (err) {
      toast.error(apiError(err, "Failed to load admin data"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user and all their resumes? This cannot be undone.")) {
      return;
    }
    
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      setUsers(users.filter(u => u.id !== userId));
      // Optionally re-fetch stats
      const statsRes = await api.get("/admin/stats");
      setStats(statsRes.data.stats);
    } catch (err) {
      toast.error(apiError(err, "Failed to delete user"));
    }
  };

  if (loading) {
    return (
      <div className="app-loader">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage users and monitor system statistics.</p>
        </div>

        <button
          onClick={toggleThemeVisibility}
          title={allowThemeToggle ? "Hide theme toggle for users" : "Show theme toggle for users"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 20,
            fontSize: "0.85rem",
            fontWeight: 700,
            border: allowThemeToggle ? "1px solid #3b82f6" : "1px solid #ef4444",
            background: allowThemeToggle ? "rgba(59, 130, 246, 0.1)" : "rgba(239, 68, 68, 0.1)",
            color: allowThemeToggle ? "#3b82f6" : "#ef4444",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <ShieldCheck size={16} />
          <span>Theme Switcher: {allowThemeToggle ? "Visible" : "Hidden"}</span>
          {allowThemeToggle ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      <div className="stats-row" style={{ marginTop: 20 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
            <Users size={20} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalUsers || 0}</div>
            <div className="stat-lbl">Total Users</div>
            <div style={{ fontSize: "0.75rem", color: "var(--success)", marginTop: 4 }}>
              +{stats?.newUsersLastWeek || 0} this week
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
            <FileText size={20} />
          </div>
          <div>
            <div className="stat-val">{stats?.totalResumes || 0}</div>
            <div className="stat-lbl">Total Resumes Built</div>
            <div style={{ fontSize: "0.75rem", color: "var(--success)", marginTop: 4 }}>
              +{stats?.newResumesLastWeek || 0} this week
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 30 }}>
        <div className="card-pad" style={{ borderBottom: "1px solid var(--border-light)" }}>
          <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Registered Users</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-subtle)", textAlign: "left", borderBottom: "2px solid var(--border-light)" }}>
                <th style={{ padding: "14px 24px", fontWeight: 600, color: "var(--text-muted)" }}>Name</th>
                <th style={{ padding: "14px 24px", fontWeight: 600, color: "var(--text-muted)" }}>Email</th>
                <th style={{ padding: "14px 24px", fontWeight: 600, color: "var(--text-muted)" }}>Role</th>
                <th style={{ padding: "14px 24px", fontWeight: 600, color: "var(--text-muted)" }}>Resumes</th>
                <th style={{ padding: "14px 24px", fontWeight: 600, color: "var(--text-muted)" }}>Joined</th>
                <th style={{ padding: "14px 24px", fontWeight: 600, color: "var(--text-muted)", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "14px 24px", fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: "14px 24px", color: "var(--text-muted)" }}>{u.email}</td>
                  <td style={{ padding: "14px 24px" }}>
                    {u.role === "admin" ? (
                      <span className="chip" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
                        <ShieldCheck size={12} /> Admin
                      </span>
                    ) : (
                      <span className="chip" style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}>
                        User
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "14px 24px", color: "var(--text-muted)" }}>{u.resumeCount}</td>
                  <td style={{ padding: "14px 24px", color: "var(--text-muted)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Calendar size={14} />
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: "14px 24px", textAlign: "right" }}>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: "6px 12px" }}
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={u.role === "admin"}
                      title={u.role === "admin" ? "Cannot delete admin users" : "Delete user"}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
