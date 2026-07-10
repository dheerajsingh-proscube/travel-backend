import express from "express";
import { formSubmit } from "../controllers/inquiry.controller.js";
const router = express.Router();

// submit contact form
router.post("/inquiries", formSubmit);

export default router;
