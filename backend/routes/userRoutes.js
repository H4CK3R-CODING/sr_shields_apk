import express from 'express';
import {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  updateUserStatus,
  deleteUser
} from '../controllers/userController.js';
import { isAdmin, protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Get all users with filtering and pagination
router.get('/', getAllUsers);

// Get single user by ID
// router.get('/:id', getUserById);

// Toggle user active status
router.patch('/:id/toggle-status', toggleUserStatus);

// Update user status
// router.patch('/:id/status', updateUserStatus);

// Delete user (soft delete)
// router.delete('/:id', deleteUser);

export default router;
