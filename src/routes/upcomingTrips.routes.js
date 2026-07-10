import express from "express";
import { upcomingTrip } from "../controllers/upcomingTrip.controller.js";
const router = express.Router();

// route for fetch all upcoming-trips
router.get("/upcoming-trips", upcomingTrip);

export default router;