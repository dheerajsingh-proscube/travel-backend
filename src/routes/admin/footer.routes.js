import express from "express";
const router = express.Router();
import {
  footerContent,
  updateFooter,
} from "../../controllers/footer.countroller.js";
import { adminAuth } from "../../middleware/adminAuth.middleware.js";


router.get("/admin/footer", adminAuth, footerContent);
router.put('/admin/footer', adminAuth, updateFooter);


export default router;
