import express from "express";
import {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} from "../../controllers/country.controller.js";
import { adminAuth } from "../../middleware/adminAuth.middleware.js";

const router = express.Router();

// fetch countries list
router.get("/admin/countries", getCountries);

// create new country
router.post("/admin/countries", adminAuth, createCountry);

// update country
router.put("/admin/countries/:id", adminAuth, updateCountry);

// delete country
router.delete("/admin/countries/:id", adminAuth, deleteCountry);

export default router;
