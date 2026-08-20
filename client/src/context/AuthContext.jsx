import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Only set loading=true on first render if an actual token exists!
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("ats_token")));

  // Restore session on first load if a token exists.
  useEffect(() => {
    const token = localStorage.getItem("ats_token");
    if (!token) {
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      // If backend is taking too long to wake up, don't freeze auth forever
      setLoading(false);
    }, 5000);

    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("ats_token");
        setUser(null);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => clearTimeout(timeoutId);
  }, []);

  const persist = useCallback((token, nextUser) => {
    localStorage.setItem("ats_token", token);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await api.post("/auth/login", { email, password });
      persist(res.data.token, res.data.user);
      return res.data.user;
    },
    [persist]
  );

  const register = useCallback(
    async (name, email, password) => {
      const res = await api.post("/auth/register", { name, email, password });
      persist(res.data.token, res.data.user);
      return res.data.user;
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("ats_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
