import express from 'express';
import { createNotice, getNotices } from '../controllers/notice.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/', upload.single('pdf'), createNotice);
router.get('/', getNotices);

export default router;
