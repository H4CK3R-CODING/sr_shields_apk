
// models/Form.model.js
import mongoose from "mongoose";

const formAttachmentSchema = new mongoose.Schema({
  name: String,
  url: String,
  type: String,
  fileId: String,
  viewLink: String,
  downloadLink: String,
  previewLink: String,
  mimeType: String,
  source: {
    type: String,
    enum: ['server-upload', 'google-drive'],
    default: 'server-upload',
  },
  size: Number,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Form title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Form description is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['government', 'certificate', 'application', 'income', 'other'],
    default: 'other',
  },
  requirements: [{
    type: String,
    trim: true,
  }],
  deadline: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'upcoming'],
    default: 'active',
  },
  isImportant: {
    type: Boolean,
    default: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  attachments: [formAttachmentSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  viewedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  downloads: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes
formSchema.index({ status: 1, createdAt: -1 });
formSchema.index({ category: 1, status: 1 });
formSchema.index({ deadline: 1 });
formSchema.index({ isImportant: -1, isPinned: -1 });

// Virtual to check if form is expired
formSchema.virtual('isExpired').get(function() {
  if (!this.deadline) return false;
  return new Date() > this.deadline;
});

const Form = mongoose.model('Form', formSchema);

export default Form;
