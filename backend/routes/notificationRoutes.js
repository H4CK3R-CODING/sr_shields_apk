import express from "express";
import { isAdmin, protect } from "../middleware/auth.middleware.js";
import { createNotification, deleteNotification, getAllNotifications, getUserNotifications, markAsRead } from "../controllers/notificationController.js";

const router = express.Router();


// Admin routes
router.post('/', protect, isAdmin, createNotification);
router.get('/all', protect, isAdmin, getAllNotifications);
router.delete('/:id', protect, isAdmin, deleteNotification);

// User routes
router.get('/my-notifications', protect, getUserNotifications);
router.put('/:notificationId/read', protect, markAsRead);


export default router;
