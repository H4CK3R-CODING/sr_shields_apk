// models/Notice.model.js
import mongoose from "mongoose";

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
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    attachments: [
      {
        fileId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        viewLink: {
          type: String,
          required: true,
        },
        downloadLink: {
          type: String,
          required: true,
        },
        mimeType: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
        thumbnailLink: String,
        uploadedAt: {
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

// Index for better query performance
noticeSchema.index({ isActive: 1, createdAt: -1 });
noticeSchema.index({ isPinned: -1, createdAt: -1 });

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
