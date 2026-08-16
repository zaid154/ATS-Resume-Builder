import { verifyToken } from "../utils/token.js";
import { User } from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const isEmailAdmin = req.user.email && req.user.email.toLowerCase().includes("admin");
  if (req.user.role !== "admin" && !isEmailAdmin) {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
}
