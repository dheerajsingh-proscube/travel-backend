import express from "express";
import {
  getTestimonials,
  createTestimonials,
  updateTestimonials,
  deleteTestimonials,
  getTestimonialById,
} from "../../controllers/testimonial.controller.js";
import { adminAuth } from "../../middleware/adminAuth.middleware.js";

const router = express.Router();

// route to get testimonials detail's
router.get("/admin/testimonials", getTestimonials);
router.get("/admin/testimonials/:id", getTestimonialById);

// route for creating new testimonials
router.post("/admin/testimonials", adminAuth, createTestimonials);

// route for updating testimonials
router.put("/admin/testimonials/:id", adminAuth, updateTestimonials);

// route for delete testimonials
router.delete("/admin/testimonials/:id", adminAuth, deleteTestimonials);

export default router;
