// routes/noticeRoutes.js - Updated with Attachment Routes
import express from 'express';
import {
  createNotice,
  getAllNoticesAdmin,
  getActiveNotices,
  getNoticeById,
  updateNotice,
  toggleNoticeStatus,
  togglePinStatus,
  deleteNotice,
  addAttachment,
  removeAttachment,
  getNoticeStats
} from '../controllers/noticeController.js';
import { isAdmin, protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public/User routes (require authentication)
router.get('/active', protect, getActiveNotices);
router.get('/stats', protect, isAdmin, getNoticeStats);
router.get('/:id', protect, getNoticeById);

// Admin routes - Notice CRUD
router.post('/', protect, isAdmin, createNotice);
router.get('/admin/all', protect, isAdmin, getAllNoticesAdmin);
router.put('/:id', protect, isAdmin, updateNotice);
router.patch('/:id/toggle-status', protect, isAdmin, toggleNoticeStatus);
router.patch('/:id/toggle-pin', protect, isAdmin, togglePinStatus);
router.delete('/:id', protect, isAdmin, deleteNotice);

// Admin routes - Attachment Management
router.post('/:id/attachments', protect, isAdmin, addAttachment);
router.delete('/:id/attachments/:attachmentId', protect, isAdmin, removeAttachment);

export default router;