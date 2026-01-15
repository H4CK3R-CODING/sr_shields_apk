// routes/user/userProfile.routes.js
import express from "express";
import {
  changePassword,
  clearPushToken,
  deleteAccount,
  getProfile,
  savePushToken,
  updateNotificationPreference,
  updateProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication and user role
router.use(protect);

// Save push notification token
router.post("/push-token", savePushToken);
router.get("/clear-push-token", clearPushToken);

router.post("/notification-preference", protect, updateNotificationPreference);
// Profile routes
router
  .route("/profile")
  .get(getProfile) // Get user profile
  .put(updateProfile) // Update user profile
  .delete(deleteAccount); // Delete user account

// Change password route
router.put("/change-password", changePassword);

export default router;
