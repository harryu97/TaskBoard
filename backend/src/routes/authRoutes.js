import express from "express";
import { signup, login, checkAuth } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.get("/check", verifyToken, checkAuth);
router.get("")
export default router;
