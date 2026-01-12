// models/Notice.model.js - Updated with Google Drive Support
import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  // Google Drive specific fields
  fileId: {
    type: String, // Google Drive file ID
    default: null,
  },
  viewLink: {
    type: String, // Link to view the file
    default: null,
  },
  downloadLink: {
    type: String, // Direct download link
    default: null,
  },
  previewLink: {
    type: String, // Preview/embed link
    default: null,
  },
  mimeType: {
    type: String,
    default: 'application/octet-stream',
  },
  source: {
    type: String,
    enum: ['server-upload', 'google-drive'],
    default: 'server-upload',
  },
  size: {
    type: Number, // File size in bytes
    default: null,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Notice description is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "general",
        "important",
        "event",
        "holiday",
        "maintenance",
        "announcement",
      ],
      default: "general",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    targetAudience: {
      type: String,
      enum: ["all", "users", "admins"],
      default: "all",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    expiryDate: {
      type: Date,
      default: null, // null means no expiry
    },
    attachments: [attachmentSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    viewedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
noticeSchema.index({ isActive: 1, createdAt: -1 });
noticeSchema.index({ isPinned: -1, createdAt: -1 });
noticeSchema.index({ category: 1, isActive: 1 });
noticeSchema.index({ expiryDate: 1 });

// Virtual to check if notice is expired
noticeSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Method to increment views
noticeSchema.methods.incrementViews = async function(userId) {
  // Check if user already viewed
  const alreadyViewed = this.viewedBy.some(
    view => view.user.toString() === userId.toString()
  );

  if (!alreadyViewed) {
    this.views += 1;
    this.viewedBy.push({ user: userId, viewedAt: new Date() });
    await this.save();
  }

  return this;
};

// Static method to get active notices
noticeSchema.statics.getActiveNotices = function(filters = {}) {
  const query = { isActive: true };
  
  // Check if not expired
  query.$or = [
    { expiryDate: null },
    { expiryDate: { $gt: new Date() } }
  ];

  // Apply additional filters
  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.targetAudience) {
    query.targetAudience = { $in: ['all', filters.targetAudience] };
  }

  return this.find(query)
    .sort({ isPinned: -1, createdAt: -1 })
    .populate('createdBy', 'fullName email');
};

// Pre-save hook to handle pinned notices limit (optional)
noticeSchema.pre('save', async function(next) {
  if (this.isPinned && this.isModified('isPinned')) {
    // Optionally limit number of pinned notices
    const pinnedCount = await this.constructor.countDocuments({ 
      isPinned: true,
      _id: { $ne: this._id }
    });

    if (pinnedCount >= 5) {
      // Unpin the oldest pinned notice
      await this.constructor.findOneAndUpdate(
        { isPinned: true, _id: { $ne: this._id } },
        { isPinned: false },
        { sort: { updatedAt: 1 } }
      );
    }
  }
  next();
});

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;