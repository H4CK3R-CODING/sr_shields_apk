// routes/jobRoutes.js
import express from 'express';
import {
  createJob,
  getAllJobsAdmin,
  getActiveJobs,
  trackJobView,
  applyForJob,
  updateJob,
  deleteJob,
  getJobApplications
} from '../controllers/jobController.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// User routes
router.get('/active', protect, getActiveJobs);
router.post('/:id/view', protect, trackJobView);
router.post('/:id/apply', protect, applyForJob);

// Admin routes
router.post('/', protect, isAdmin, createJob);
router.get('/admin/all', protect, isAdmin, getAllJobsAdmin);
router.get('/:id/applications', protect, isAdmin, getJobApplications);
router.put('/:id', protect, isAdmin, updateJob);
router.delete('/:id', protect, isAdmin, deleteJob);

export default router;
