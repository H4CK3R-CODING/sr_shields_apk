
// models/Job.model.js
import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
    default: 'pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const attachmentSchema = new mongoose.Schema({
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

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
  },
  organization: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['government', 'private', 'banking', 'education', 'healthcare', 'other'],
    default: 'other',
  },
  salary: {
    type: String,
    trim: true,
  },
  experience: {
    type: String,
    trim: true,
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
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  attachments: [attachmentSchema],
  applications: [jobApplicationSchema],
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
}, {
  timestamps: true,
});

// Indexes
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ deadline: 1 });
jobSchema.index({ isFeatured: -1, isPinned: -1 });

// Virtual to check if job is expired
jobSchema.virtual('isExpired').get(function() {
  if (!this.deadline) return false;
  return new Date() > this.deadline;
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
