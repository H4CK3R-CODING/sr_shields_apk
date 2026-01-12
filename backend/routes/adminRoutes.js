
// ========================================
// routes/adminRoutes.js
import express from 'express';
import {
  getDashboardStats,
  getUserStats,
  // getSystemOverview,
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all admin routes
router.use(protect);
// router.use(isAdmin);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/stats/users', getUserStats);
// router.get('/system/overview', getSystemOverview);

export default router;