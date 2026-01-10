import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  driveFileId: String,
  fileName: String,
  fileSize: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notice', noticeSchema);
