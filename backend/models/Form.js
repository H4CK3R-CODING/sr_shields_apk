import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  driveFileId: String,
  fileName: String,
  fileSize: Number,
  downloads: { type: Number, default: 0 }
});

export default mongoose.model('Form', formSchema);
