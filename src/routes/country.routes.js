import express from "express";
import { getCountries } from "../controllers/country.controller.js";
const router = express.Router();

// api for fetch data of all the countries
router.get("/countries", getCountries);

export default router;
