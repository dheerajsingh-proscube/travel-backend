import express from "express";
import { getDashboardStats } from "../../controllers/admin/dashboard.controller.js";
import { adminAuth } from "../../middleware/adminAuth.middleware.js";

const router = express.Router();

// fetch dashboard content
router.get("/admin/dashboard", adminAuth, getDashboardStats);

export default router;