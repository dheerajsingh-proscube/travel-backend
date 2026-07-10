import express from "express";
import {
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  destinationDetail,
} from "../../controllers/destination.controller.js";
import { adminAuth } from "../../middleware/adminAuth.middleware.js";

const router = express.Router();

// fetch destination list
router.get("/admin/destinations", getDestination);

router.get("/admin/destinations/:id", destinationDetail);

// create new destination
router.post("/admin/destinations", adminAuth, createDestination);

// update destination
router.put("/admin/destinations/:id", adminAuth, updateDestination);

// delete destination
router.delete("/admin/destinations/:id", adminAuth, deleteDestination);

export default router;
