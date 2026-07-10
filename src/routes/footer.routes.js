import express from "express";
import { footerContent } from "../controllers/footer.countroller.js";
const router = express.Router();

// fetch the footer content
router.get("/footer", footerContent);

export default router;
