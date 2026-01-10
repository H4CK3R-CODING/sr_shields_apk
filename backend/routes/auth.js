import express from "express";
import {
  signup,
  verifyOtp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  isLogin,
} from "../controllers/authController.js";
import { getProfile, loginUser, registerUser } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// router.post("/signup", signup);
// router.post("/verify-otp", verifyOtp);
// router.post("/signin", login);
// router.post("/logout", logout);
// router.get("/me", isLogin);

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getProfile);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
