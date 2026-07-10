import express from "express";
import { getDestination, destinationDetail } from "../controllers/destination.controller.js";
const router = express.Router();

// fetch all the destination
router.get("/destinations", getDestination);

// get destination details
router.get('/destination/:id', destinationDetail)
export default router;
