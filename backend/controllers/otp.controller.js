import genOtp from "../utils/genOtp.js";
import sendMail from "../utils/sendMail.js";
import OTPModel from "../models/Otp.model.js";

// OTP Model Schema (for reference - implement in your database)
/*
OTP Schema:
{
  email: String (indexed),
  otp: String,
  otpExpiration: Date,
  attempts: Number,
  maxAttempts: Number (default: 5),
  rateLimitWindow: Date,
  rateLimitCount: Number,
  maxRateLimitAttempts: Number (default: 3),
  isVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
*/

// Configuration constants
const OTP_CONFIG = {
  OTP_EXPIRATION_TIME: 5 * 60 * 1000, // 5 minutes in milliseconds
  MAX_VERIFICATION_ATTEMPTS: 5,
  MAX_RATE_LIMIT_ATTEMPTS: 3,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes in milliseconds
  RESEND_COOLDOWN: 60 * 1000, // 1 minute cooldown between resends
};

/**
 * Generate and send OTP to user's email
 */
export const generateOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check for existing OTP record
    let otpRecord = await OTPModel.findOne({ email });

    // Rate limiting check
    if (otpRecord) {
      const now = new Date();

      // Check if rate limit window is still active
      if (otpRecord.rateLimitWindow && otpRecord.rateLimitWindow > now) {
        if (otpRecord.rateLimitCount >= OTP_CONFIG.MAX_RATE_LIMIT_ATTEMPTS) {
          const remainingTime = Math.ceil(
            (otpRecord.rateLimitWindow - now) / 1000 / 60,
          );
          return res.status(429).json({
            success: false,
            message: `Too many OTP requests. Please try again after ${remainingTime} minutes`,
          });
        }
      } else {
        // Reset rate limit if window has expired
        otpRecord.rateLimitCount = 0;
        otpRecord.rateLimitWindow = new Date(
          now.getTime() + OTP_CONFIG.RATE_LIMIT_WINDOW,
        );
      }

      // Check resend cooldown
      if (otpRecord.updatedAt) {
        const timeSinceLastOTP = now - otpRecord.updatedAt;
        if (timeSinceLastOTP < OTP_CONFIG.RESEND_COOLDOWN) {
          const remainingSeconds = Math.ceil(
            (OTP_CONFIG.RESEND_COOLDOWN - timeSinceLastOTP) / 1000,
          );
          return res.status(429).json({
            success: false,
            message: `Please wait ${remainingSeconds} seconds before requesting a new OTP`,
          });
        }
      }
    }

    // Generate new OTP
    const otp = genOtp();
    console.log(`Generated OTP for ${email}: ${otp}`); // For debugging; remove in production
    const otpExpiration = new Date(Date.now() + OTP_CONFIG.OTP_EXPIRATION_TIME);

    if (otpRecord) {
      // Update existing record
      otpRecord.otp = otp;
      otpRecord.otpExpiration = otpExpiration;
      otpRecord.attempts = 0; // Reset verification attempts
      otpRecord.rateLimitCount += 1;
      otpRecord.isVerified = false;
      await otpRecord.save();
    } else {
      // Create new record
      otpRecord = await OTPModel.create({
        email,
        otp,
        otpExpiration,
        attempts: 0,
        maxAttempts: OTP_CONFIG.MAX_VERIFICATION_ATTEMPTS,
        rateLimitWindow: new Date(Date.now() + OTP_CONFIG.RATE_LIMIT_WINDOW),
        rateLimitCount: 1,
        maxRateLimitAttempts: OTP_CONFIG.MAX_RATE_LIMIT_ATTEMPTS,
        isVerified: false,
      });
    }

    // Send OTP via email
    const subject = "Your OTP Verification Code";
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>OTP Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="background-color: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px;">
          ${otp}
        </h1>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p style="color: #888; font-size: 12px; margin-top: 30px;">
          Do not share this OTP with anyone.
        </p>
      </div>
    `;

    await sendMail(subject, message, email);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
      expiresIn: OTP_CONFIG.OTP_EXPIRATION_TIME / 1000, // in seconds
    });
  } catch (error) {
    console.error("Generate OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate OTP",
      error: error.message,
    });
  }
};

/**
 * Verify OTP submitted by user
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find OTP record
    const otpRecord = await OTPModel.findOne({ email });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "No OTP found for this email. Please request a new one.",
      });
    }

    // Check if already verified
    if (otpRecord.isVerified) {
      return res.status(400).json({
        success: false,
        message: "OTP already verified",
      });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.otpExpiration) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Check max attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      return res.status(403).json({
        success: false,
        message:
          "Maximum verification attempts exceeded. Please request a new OTP.",
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp.toString()) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();

      const remainingAttempts = otpRecord.maxAttempts - otpRecord.attempts;

      return res.status(400).json({
        success: false,
        message: `You have ${remainingAttempts} attempts left.`,
      });
    }

    // OTP is valid - mark as verified
    otpRecord.isVerified = true;
    await otpRecord.save();

    // Optional: Delete OTP record after successful verification
    await OTPModel.deleteOne({ email });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      email: otpRecord.email,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

/**
 * Resend OTP to user's email
 */
export const resendOTP = async (req, res) => {
  // This uses the same logic as generateOTP
  return generateOTP(req, res);
};

/**
 * Clean up expired OTP records (run as a cron job)
 */
export const cleanupExpiredOTPs = async () => {
  try {
    const result = await OTPModel.deleteMany({
      otpExpiration: { $lt: new Date() },
    });
    console.log(`Cleaned up ${result.deletedCount} expired OTP records`);
    return result;
  } catch (error) {
    console.error("Cleanup OTP Error:", error);
  }
};
