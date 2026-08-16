import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { getStats, getUsers, deleteUser } from "../controllers/adminController.js";

const router = express.Router();

// Apply auth and admin middleware to all routes in this file
router.use(requireAuth, requireAdmin);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

export default router;
