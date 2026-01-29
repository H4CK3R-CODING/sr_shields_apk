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
      <div style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F9FAFB;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
                    
                    <!-- Header with Gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 40px 30px; text-align: center;">
                            <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="white"/>
                                    <path d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="#3B82F6"/>
                                </svg>
                            </div>
                            <h1 style="color: #FFFFFF; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Verify Your Identity</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 10px 0 0 0;">One-Time Password Authentication</p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">
                                Hello!
                            </p>
                            <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                We received a request to verify your identity. Please use the One-Time Password (OTP) below to complete your verification:
                            </p>
                            
                            <!-- OTP Code Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 3px; border-radius: 12px;">
                                        <div style="background-color: #FFFFFF; padding: 35px 30px; text-align: center; border-radius: 10px;">
                                            <p style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px 0; font-weight: 600;">Your Verification Code</p>
                                            <h1 style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 48px; letter-spacing: 14px; margin: 0; font-weight: 700; font-family: 'Courier New', monospace;">
                                                ${otp}
                                            </h1>
                                            <div style="margin-top: 20px; padding: 12px 24px; background-color: #DBEAFE; border-radius: 8px; display: inline-block;">
                                                <p style="color: #1E40AF; font-size: 14px; margin: 0; font-weight: 600;">
                                                    ⏱️ Expires in 5 minutes
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- How to Use Instructions -->
                            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="width: 40px; vertical-align: top;">
                                            <div style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                                <span style="color: #FFFFFF; font-size: 16px; font-weight: bold;">ℹ</span>
                                            </div>
                                        </td>
                                        <td style="padding-left: 15px;">
                                            <p style="color: #374151; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">How to use this code:</p>
                                            <ol style="color: #6B7280; font-size: 14px; line-height: 1.7; margin: 0; padding-left: 20px;">
                                                <li style="margin-bottom: 6px;">Return to the verification page</li>
                                                <li style="margin-bottom: 6px;">Enter the 5-digit code shown above</li>
                                                <li style="margin-bottom: 0;">Click "Verify" to continue</li>
                                            </ol>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Security Notice -->
                            <div style="background: linear-gradient(to right, #FEF3C7, #FDE68A); padding: 20px; border-radius: 10px; border-left: 4px solid #F59E0B; margin-bottom: 25px;">
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="width: 30px; vertical-align: top;">
                                            <div style="background-color: #F59E0B; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                                <span style="color: #FFFFFF; font-size: 16px; font-weight: bold;">⚠</span>
                                            </div>
                                        </td>
                                        <td style="padding-left: 15px;">
                                            <p style="color: #92400E; font-size: 14px; margin: 0; font-weight: 600; line-height: 1.5;">
                                                Security Notice
                                            </p>
                                            <p style="color: #78350F; font-size: 13px; margin: 5px 0 0 0; line-height: 1.5;">
                                                If you didn't request this verification code, please ignore this email. Your account remains secure and no action is needed.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Security Tips -->
                            <div style="background-color: #EEF2FF; padding: 20px; border-radius: 10px; border-left: 4px solid #3B82F6;">
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="width: 30px; vertical-align: top;">
                                            <span style="font-size: 20px;">🔒</span>
                                        </td>
                                        <td style="padding-left: 15px;">
                                            <p style="color: #1E40AF; font-size: 14px; margin: 0; font-weight: 600; line-height: 1.6;">
                                                Security Reminder
                                            </p>
                                            <p style="color: #3730A3; font-size: 13px; margin: 5px 0 0 0; line-height: 1.5;">
                                                Never share this OTP with anyone, including our support team. We will never ask for your verification code via email, phone, or any other channel.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
                                This is an automated message. Please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                            <div style="margin-bottom: 15px;">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.35-.91-6-4.6-6-8V8.3l6-3.11 6 3.11V12c0 3.4-2.65 7.09-6 8z" fill="#3B82F6"/>
                                    <path d="M10.5 13.5l-2-2-1.5 1.5 3.5 3.5 5.5-5.5-1.5-1.5z" fill="#3B82F6"/>
                                </svg>
                            </div>
                            <p style="color: #6B7280; font-size: 12px; margin: 0 0 8px 0; font-weight: 600;">
                                🛡️ Your security is our top priority
                            </p>
                            <p style="color: #9CA3AF; font-size: 12px; margin: 0; line-height: 1.5;">
                                This verification code was generated to protect your account.
                            </p>
                            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                                <p style="color: #9CA3AF; font-size: 11px; margin: 0;">
                                    © 2024 Your Company Name. All rights reserved.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
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
