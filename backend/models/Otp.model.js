import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiration: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
    rateLimitWindow: {
      type: Date,
      required: true,
    },
    rateLimitCount: {
      type: Number,
      default: 0,
    },
    maxRateLimitAttempts: {
      type: Number,
      default: 3,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    purpose: {
      type: String,
      enum: ['registration', 'password_reset'],
      default: 'registration',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for email and purpose
otpSchema.index({ email: 1, purpose: 1 });

// Index for automatic cleanup of expired OTPs
otpSchema.index({ otpExpiration: 1 }, { expireAfterSeconds: 0 });

const OTPModel = mongoose.model('OTP', otpSchema);

export default OTPModel;