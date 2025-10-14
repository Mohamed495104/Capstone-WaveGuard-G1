import express from "express";
import { syncUser, checkEmail } from "../controllers/authController.js";
const router = express.Router();

router.post("/sync", syncUser);
router.get("/check-email", checkEmail);

export default router;
