import express from "express";
import {
  getPackages,
  packageDetail,
  featuredPackage,
} from "../controllers/package.controller.js";
const router = express.Router();

// fetch all the availabe packages
router.get("/packages", getPackages);

// get featured packages
router.get("/packages/featured", featuredPackage);

// get specific package detail's
router.get("/packages/:id", packageDetail);

export default router;
