import multer from 'multer';

export const upload = multer({
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.includes('pdf')) {
      cb(new Error('Only PDF files allowed'));
    }
    cb(null, true);
  }
});
