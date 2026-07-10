import express from "express";
import {
  getPackages,
  createPackages,
  updatePackages,
  deletePackages,
  packageDetail,
} from "../../controllers/package.controller.js";
import { adminAuth } from "../../middleware/adminAuth.middleware.js";

const router = express.Router();

// route to get package content
router.get("/admin/packages", getPackages);
router.get("/admin/packages/:id", packageDetail);




// route for creating new packages
router.post("/admin/packages", adminAuth, createPackages);

// route for updating packages
router.put("/admin/packages/:id", adminAuth, updatePackages);

// route for delete packages
router.delete("/admin/packages/:id", adminAuth, deletePackages);

export default router;
