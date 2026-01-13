// routes/user/userProfile.routes.js
import express from "express";
import {
  changePassword,
  deleteUserAccount,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication and user role
router.use(protect);

// Profile routes
router
  .route("/profile")
  .get(getUserProfile) // Get user profile
  .put(updateUserProfile) // Update user profile
  .delete(deleteUserAccount); // Delete user account

// Change password route
router.put("/change-password", changePassword);

export default router;
