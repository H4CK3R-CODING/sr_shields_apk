
// routes/noticeRoutes.js
import express from 'express';
import {
  createNotice,
  getAllNoticesAdmin,
  getActiveNotices,
  getNoticeById,
  updateNotice,
  toggleNoticeStatus,
  togglePinStatus,
  deleteNotice
} from '../controllers/noticeController.js';
import { isAdmin, protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public/User routes (require authentication)
router.get('/active', protect, getActiveNotices);
router.get('/:id', protect, getNoticeById);

// Admin routes
router.post('/', protect, isAdmin, createNotice);
router.get('/admin/all', protect, isAdmin, getAllNoticesAdmin);
router.put('/:id', protect, isAdmin, updateNotice);
router.patch('/:id/toggle-status', protect, isAdmin, toggleNoticeStatus);
router.patch('/:id/toggle-pin', protect, isAdmin, togglePinStatus);
router.delete('/:id', protect, isAdmin, deleteNotice);

export default router;