// backend/src/routes/logTokenRoutes.js
import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
    console.log("User JWT Token:", req.body.token);
    res.json({ message: "Token logged" });
});

export default router;