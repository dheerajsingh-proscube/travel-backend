import express from "express";
import { getCategoryCount, getCategoryData } from "../controllers/category.controller.js";
const router = express.Router();

// route for fetch category
router.get("/categories", getCategoryData);
router.get("/categories/count", getCategoryCount)

export default router;
