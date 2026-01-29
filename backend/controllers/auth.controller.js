// =====================================================
// 3. controllers/auth.controller.js - Auth Logic
// =====================================================

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OTPModel from "../models/Otp.model.js";
import genOtp from "../utils/genOtp.js";
import sendMail from "../utils/sendMail.js";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      isEmailVerified,
      confirmPassword,
      role,
      // Admin specific
      department,
      // User specific
      address,
      dateOfBirth,
      gender,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      console.log("Missing required fields in registration");
      console.log("Request body:", req.body);
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Validate admin code if role is admin
    if (role === "admin") {
      // const VALID_ADMIN_CODE = process.env.ADMIN_REGISTRATION_CODE || 'ADMIN2024';
      // if (adminCode !== VALID_ADMIN_CODE) {
      //   return res.status(400).json({
      //     success: false,
      //     message: 'Invalid admin registration code'
      //   });
      // }

      // Check if required admin fields are provided
      if (!department) {
        return res.status(400).json({
          success: false,
          message: "Department are required for admin registration",
        });
      }

      // Check if employee ID already exists
      // const existingEmployee = await User.findOne({ employeeId });
      // if (existingEmployee) {
      //   return res.status(400).json({
      //     success: false,
      //     message: 'Employee ID already exists'
      //   });
      // }
    }

    // Validate user specific fields
    if (role === "user") {
      if (!address || !dateOfBirth || !gender) {
        return res.status(400).json({
          success: false,
          message:
            "Address, date of birth, and gender are required for user registration",
        });
      }
    }

    // Create user object
    const userData = {
      fullName,
      email,
      phone,
      password,
      isEmailVerified: isEmailVerified || false,
      role: role || "user",
    };

    // Add role-specific fields
    if (role === "admin") {
      userData.department = department;
    } else {
      userData.address = address;
      userData.dateOfBirth = dateOfBirth;
      userData.gender = gender;
    }

    // Create new user
    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user || user.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Compare passwords
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// import OTPModel from '../models/OTP.js';
// import User from '../models/User.js';
// import genOtp from '../utils/genOtp.js';
// import sendMail from '../utils/sendMail.js';
// import bcrypt from 'bcryptjs';

const OTP_CONFIG = {
  OTP_EXPIRATION_TIME: 5 * 60 * 1000, // 5 minutes
  MAX_VERIFICATION_ATTEMPTS: 5,
  MAX_RATE_LIMIT_ATTEMPTS: 3,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RESEND_COOLDOWN: 60 * 1000, // 1 minute
};

/**
 * Step 1: Send OTP for password reset
 * POST /api/auth/forgot-password/send-otp
 */
export const sendPasswordResetOTP = async (req, res) => {
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

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, you will receive a password reset code.",
      });
    }

    // Check for existing OTP record
    let otpRecord = await OTPModel.findOne({
      email: normalizedEmail,
      purpose: "password_reset",
    });

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
            message: `Too many password reset requests. Please try again after ${remainingTime} minutes`,
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
            message: `Please wait ${remainingSeconds} seconds before requesting a new code`,
          });
        }
      }
    }

    // Generate new OTP
    const otp = genOtp();
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
        email: normalizedEmail,
        otp,
        otpExpiration,
        attempts: 0,
        maxAttempts: OTP_CONFIG.MAX_VERIFICATION_ATTEMPTS,
        rateLimitWindow: new Date(Date.now() + OTP_CONFIG.RATE_LIMIT_WINDOW),
        rateLimitCount: 1,
        maxRateLimitAttempts: OTP_CONFIG.MAX_RATE_LIMIT_ATTEMPTS,
        isVerified: false,
        purpose: "password_reset",
      });
    }

    // Send OTP via email
    const subject = "Password Reset - Verification Code";
    const message = `
    <div style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F9FAFB;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
                    
                    <!-- Header with Gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); padding: 40px 30px; text-align: center;">
                            <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zm3 5v3H9V7c0-1.654 1.346-3 3-3s3 1.346 3 3z" fill="white"/>
                                </svg>
                            </div>
                            <h1 style="color: #FFFFFF; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Password Reset Request</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 10px 0 0 0;">Secure verification code inside</p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">
                                Hello ${user.fullName},
                            </p>
                            <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                We received a request to reset your password. To proceed with resetting your password, please use the verification code below:
                            </p>
                            
                            <!-- OTP Code Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); padding: 3px; border-radius: 12px;">
                                        <div style="background-color: #FFFFFF; padding: 30px; text-align: center; border-radius: 10px;">
                                            <p style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px 0; font-weight: 600;">Your Verification Code</p>
                                            <h1 style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 42px; letter-spacing: 12px; margin: 0; font-weight: 700; font-family: 'Courier New', monospace;">
                                                ${otp}
                                            </h1>
                                            <div style="margin-top: 20px; padding: 12px 20px; background-color: #FEF3C7; border-radius: 8px; display: inline-block;">
                                                <p style="color: #92400E; font-size: 14px; margin: 0; font-weight: 600;">
                                                    ⏱️ Valid for 5 minutes only
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security Notice -->
                            <div style="background: linear-gradient(to right, #FEF3C7, #FDE68A); padding: 20px; border-radius: 10px; border-left: 4px solid #F59E0B; margin-bottom: 30px;">
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
                                                If you didn't request this password reset, please ignore this email or contact our support team immediately if you're concerned about your account security.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Instructions -->
                            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                                <p style="color: #374151; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">How to reset your password:</p>
                                <ol style="color: #6B7280; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                    <li style="margin-bottom: 8px;">Return to the password reset page</li>
                                    <li style="margin-bottom: 8px;">Enter the verification code shown above</li>
                                    <li style="margin-bottom: 0;">Create your new secure password</li>
                                </ol>
                            </div>
                            
                            <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                                This is an automated message, please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                            <div style="margin-bottom: 15px;">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.35-.91-6-4.6-6-8V8.3l6-3.11 6 3.11V12c0 3.4-2.65 7.09-6 8z" fill="#667EEA"/>
                                    <path d="M10.5 13.5l-2-2-1.5 1.5 3.5 3.5 5.5-5.5-1.5-1.5z" fill="#667EEA"/>
                                </svg>
                            </div>
                            <p style="color: #6B7280; font-size: 12px; margin: 0 0 8px 0; font-weight: 600;">
                                🔒 Do not share this code with anyone
                            </p>
                            <p style="color: #9CA3AF; font-size: 12px; margin: 0; line-height: 1.5;">
                                Our team will never ask for your verification code via email, phone, or any other channel.
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

    await sendMail(subject, message, normalizedEmail);

    return res.status(200).json({
      success: true,
      message: "Password reset code sent to your email",
      expiresIn: OTP_CONFIG.OTP_EXPIRATION_TIME / 1000, // in seconds
    });
  } catch (error) {
    console.error("Send Password Reset OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send password reset code",
      error: error.message,
    });
  }
};

/**
 * Step 2: Reset Password (Verify OTP + Set New Password in one call)
 * POST /api/auth/forgot-password/reset
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validation
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required",
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    if (
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must contain uppercase, lowercase, and number",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find OTP record
    const otpRecord = await OTPModel.findOne({
      email: normalizedEmail,
      purpose: "password_reset",
    });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "No password reset request found. Please request a new code.",
      });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.otpExpiration) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    // Check max attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      return res.status(403).json({
        success: false,
        message:
          "Maximum verification attempts exceeded. Please request a new code.",
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
        message: "Invalid verification code",
        remainingAttempts,
      });
    }

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    // user.password = hashedPassword;

    user.password = newPassword;
    await user.save();

    // Delete OTP record after successful password reset
    await OTPModel.deleteOne({ _id: otpRecord._id });

    // Optional: Send confirmation email
    const confirmationSubject = "Password Reset Successful";
    const confirmationMessage = `
    <div style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F9FAFB;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
                    
                    <!-- Header with Success Theme -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                            <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" fill="white" opacity="0.3"/>
                                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <h1 style="color: #FFFFFF; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Password Reset Successful!</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 10px 0 0 0;">Your account is now secured with a new password</p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">
                                Hello ${user.fullName},
                            </p>
                            <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                Great news! Your password has been successfully reset. You can now log in to your account using your new password.
                            </p>
                            
                            <!-- Success Confirmation Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 3px; border-radius: 12px;">
                                        <div style="background-color: #FFFFFF; padding: 25px; border-radius: 10px;">
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="width: 50px; vertical-align: top;">
                                                        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5 13l4 4L19 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg>
                                                        </div>
                                                    </td>
                                                    <td style="padding-left: 15px;">
                                                        <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                                                            Password Changed Successfully
                                                        </p>
                                                        <p style="color: #6B7280; font-size: 14px; margin: 0; line-height: 1.5;">
                                                            <strong>Reset Date:</strong> ${new Date().toLocaleString(
                                                              "en-US",
                                                              {
                                                                weekday: "long",
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute:
                                                                  "2-digit",
                                                                hour12: true,
                                                              },
                                                            )}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security Alert -->
                            <div style="background: linear-gradient(to right, #FEE2E2, #FECACA); padding: 20px; border-radius: 10px; border-left: 4px solid #EF4444; margin-bottom: 30px;">
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="width: 30px; vertical-align: top;">
                                            <div style="background-color: #EF4444; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                                <span style="color: #FFFFFF; font-size: 16px; font-weight: bold;">!</span>
                                            </div>
                                        </td>
                                        <td style="padding-left: 15px;">
                                            <p style="color: #991B1B; font-size: 14px; margin: 0; font-weight: 600; line-height: 1.5;">
                                                Security Alert
                                            </p>
                                            <p style="color: #B91C1C; font-size: 13px; margin: 5px 0 0 0; line-height: 1.5;">
                                                If you didn't make this change, please contact our support team immediately to secure your account. Your account may be compromised.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Security Tips -->
                            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                                <p style="color: #374151; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">
                                    🛡️ Security Tips for Your Account:
                                </p>
                                <ul style="color: #6B7280; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                    <li style="margin-bottom: 8px;">Use a strong, unique password that you don't use anywhere else</li>
                                    <li style="margin-bottom: 8px;">Enable two-factor authentication for extra security</li>
                                    <li style="margin-bottom: 8px;">Never share your password with anyone</li>
                                    <li style="margin-bottom: 0;">Regularly review your account activity</li>
                                </ul>
                            </div>
                            
                            <!-- Call to Action Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);">
                                            Log In to Your Account
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                                Need help? Contact our support team anytime.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                            <div style="margin-bottom: 15px;">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.35-.91-6-4.6-6-8V8.3l6-3.11 6 3.11V12c0 3.4-2.65 7.09-6 8z" fill="#10B981"/>
                                    <path d="M10.5 13.5l-2-2-1.5 1.5 3.5 3.5 5.5-5.5-1.5-1.5z" fill="#10B981"/>
                                </svg>
                            </div>
                            <p style="color: #6B7280; font-size: 12px; margin: 0 0 8px 0; font-weight: 600;">
                                🔒 Your account security is our top priority
                            </p>
                            <p style="color: #9CA3AF; font-size: 12px; margin: 0; line-height: 1.5;">
                                This is an automated message. Please do not reply to this email.
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

    await sendMail(confirmationSubject, confirmationMessage, normalizedEmail);

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};
