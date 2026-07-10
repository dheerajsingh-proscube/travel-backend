import express from "express";
import { getTestimonialCount, getTestimonials } from "../controllers/testimonial.controller.js";
const router = express.Router();

// get all testimonials
router.get("/testimonials", getTestimonials);
router.get("/testimonials/count", getTestimonialCount);


export default router;
