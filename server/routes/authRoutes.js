import express from "express";
const router = express.Router();
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protectedRoute, getMe);

export default router;