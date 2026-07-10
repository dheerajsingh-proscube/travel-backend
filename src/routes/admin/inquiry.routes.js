import express from "express";
import {
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "../../controllers/inquiry.controller.js";
import { adminAuth } from "../../middleware/adminAuth.middleware.js";

const router = express.Router();

// route to get inquiry
router.get("/admin/inquiries", adminAuth, getInquiries);

// route for updating inquiries
router.put("/admin/inquiries/:id", adminAuth, updateInquiryStatus);

// route for delete inquiries
router.delete("/admin/inquiries/:id", adminAuth, deleteInquiry);

export default router;
