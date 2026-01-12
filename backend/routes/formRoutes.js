
// routes/formRoutes.js
import express from 'express';
import {
  createForm,
  getAllFormsAdmin,
  getActiveForms,
  trackFormView,
  updateForm,
  deleteForm
} from '../controllers/formController.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// User routes
router.get('/active', protect, getActiveForms);
router.post('/:id/view', protect, trackFormView);

// Admin routes
router.post('/', protect, isAdmin, createForm);
router.get('/admin/all', protect, isAdmin, getAllFormsAdmin);
router.put('/:id', protect, isAdmin, updateForm);
router.delete('/:id', protect, isAdmin, deleteForm);

export default router;
