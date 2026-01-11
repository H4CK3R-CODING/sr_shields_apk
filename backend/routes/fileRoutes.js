
// =====================================================
// 6. routes/fileRoutes.js - File Upload Routes
// =====================================================
import express from 'express';
import { 
  uploadFile, 
  uploadMultipleFiles,
  addAttachmentToNotice,
  removeAttachmentFromNotice
} from '../controllers/fileController.js';
import { upload } from '../middleware/upload.js';
import { isAdmin, protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Upload single file
router.post('/upload', upload.single('file'), uploadFile);

// Upload multiple files
router.post('/upload-multiple', upload.array('files', 5), uploadMultipleFiles);

// Add attachment to notice
router.post('/notice/:noticeId/attachment', upload.single('file'), addAttachmentToNotice);

// Remove attachment from notice
router.delete('/notice/:noticeId/attachment/:attachmentId', removeAttachmentFromNotice);

// Test upload
router.post('/test-upload', async (req, res) => {
  try {
    const testFile = {
      originalname: 'test.txt',
      mimetype: 'text/plain',
      path: './test.txt'
    };
    
    const result = await uploadToDrive(testFile);
    res.json({ success: true, result });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

export default router;