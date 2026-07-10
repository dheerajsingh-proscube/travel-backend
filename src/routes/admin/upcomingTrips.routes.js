import express from "express";
import {
  upcomingTrip,
  createUpcomingTrip,
  updateUpcomingTrip,
  deleteUpcomingTrip,
} from "../../controllers/upcomingTrip.controller.js";
import { adminAuth } from "../../middleware/adminAuth.middleware.js";

const router = express.Router();

// route to get upcoming-trip content
router.get("/admin/upcoming-trips", upcomingTrip);

// route for creating new upcoming-trips
router.post("/admin/upcoming-trips", adminAuth, createUpcomingTrip);

// route for updating upcoming-trips
router.put("/admin/upcoming-trips/:id", adminAuth, updateUpcomingTrip);

// route for delete upcoming-trips
router.delete("/admin/upcoming-trips/:id", adminAuth, deleteUpcomingTrip);

export default router;
