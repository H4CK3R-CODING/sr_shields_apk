
// =====================================================
// 3. controllers/auth.controller.js - Auth Logic
// =====================================================

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTPModel from '../models/Otp.model.js';
import genOtp from '../utils/genOtp.js';
import sendMail from '../utils/sendMail.js';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
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
      gender
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      console.log("Missing required fields in registration");
      console.log("Request body:", req.body);
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate admin code if role is admin
    if (role === 'admin') {
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
          message: 'Department are required for admin registration'
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
    if (role === 'user') {
      if (!address || !dateOfBirth || !gender) {
        return res.status(400).json({
          success: false,
          message: 'Address, date of birth, and gender are required for user registration'
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
      role: role || 'user'
    };

    // Add role-specific fields
    if (role === 'admin') {
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
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user || user.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Compare passwords
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
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
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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
        message: 'Email is required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset code.',
      });
    }

    // Check for existing OTP record
    let otpRecord = await OTPModel.findOne({ 
      email: normalizedEmail,
      purpose: 'password_reset'
    });

    // Rate limiting check
    if (otpRecord) {
      const now = new Date();
      
      // Check if rate limit window is still active
      if (otpRecord.rateLimitWindow && otpRecord.rateLimitWindow > now) {
        if (otpRecord.rateLimitCount >= OTP_CONFIG.MAX_RATE_LIMIT_ATTEMPTS) {
          const remainingTime = Math.ceil(
            (otpRecord.rateLimitWindow - now) / 1000 / 60
          );
          return res.status(429).json({
            success: false,
            message: `Too many password reset requests. Please try again after ${remainingTime} minutes`,
          });
        }
      } else {
        // Reset rate limit if window has expired
        otpRecord.rateLimitCount = 0;
        otpRecord.rateLimitWindow = new Date(now.getTime() + OTP_CONFIG.RATE_LIMIT_WINDOW);
      }

      // Check resend cooldown
      if (otpRecord.updatedAt) {
        const timeSinceLastOTP = now - otpRecord.updatedAt;
        if (timeSinceLastOTP < OTP_CONFIG.RESEND_COOLDOWN) {
          const remainingSeconds = Math.ceil(
            (OTP_CONFIG.RESEND_COOLDOWN - timeSinceLastOTP) / 1000
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
        purpose: 'password_reset',
      });
    }

    // Send OTP via email
    const subject = 'Password Reset - Verification Code';
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1F2937; margin-bottom: 10px;">Password Reset Request</h1>
        </div>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <p style="color: #4B5563; font-size: 16px; margin-bottom: 15px;">
            Hello ${user.fullName},
          </p>
          <p style="color: #4B5563; font-size: 16px; margin-bottom: 15px;">
            We received a request to reset your password. Use the verification code below to proceed:
          </p>
          
          <div style="background-color: #FFFFFF; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #3B82F6; font-size: 36px; letter-spacing: 8px; margin: 0;">
              ${otp}
            </h1>
          </div>
          
          <p style="color: #EF4444; font-size: 14px; margin-top: 15px;">
            ⏱️ This code is valid for <strong>5 minutes</strong>.
          </p>
        </div>
        
        <div style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; border-left: 4px solid #F59E0B; margin-bottom: 20px;">
          <p style="color: #92400E; font-size: 14px; margin: 0;">
            <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact support if you're concerned about your account security.
          </p>
        </div>
        
        <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; margin-top: 30px;">
          <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
            Do not share this code with anyone. Our team will never ask for your verification code.
          </p>
        </div>
      </div>
    `;

    await sendMail(subject, message, normalizedEmail);

    return res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email',
      expiresIn: OTP_CONFIG.OTP_EXPIRATION_TIME / 1000, // in seconds
    });

  } catch (error) {
    console.error('Send Password Reset OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send password reset code',
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
        message: 'Email, OTP, and new password are required',
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain uppercase, lowercase, and number',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find OTP record
    const otpRecord = await OTPModel.findOne({ 
      email: normalizedEmail,
      purpose: 'password_reset'
    });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: 'No password reset request found. Please request a new code.',
      });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.otpExpiration) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
      });
    }

    // Check max attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      return res.status(403).json({
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new code.',
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
        message: 'Invalid verification code',
        remainingAttempts,
      });
    }

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
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
    const confirmationSubject = 'Password Reset Successful';
    const confirmationMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10B981; margin-bottom: 10px;">✓ Password Reset Successful</h1>
        </div>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <p style="color: #4B5563; font-size: 16px; margin-bottom: 15px;">
            Hello ${user.fullName},
          </p>
          <p style="color: #4B5563; font-size: 16px; margin-bottom: 15px;">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <p style="color: #4B5563; font-size: 14px;">
            Reset Date: ${new Date().toLocaleString()}
          </p>
        </div>
        
        <div style="background-color: #FEE2E2; padding: 15px; border-radius: 8px; border-left: 4px solid #EF4444; margin-bottom: 20px;">
          <p style="color: #991B1B; font-size: 14px; margin: 0;">
            <strong>Security Alert:</strong> If you didn't make this change, please contact our support team immediately.
          </p>
        </div>
        
        <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; margin-top: 30px;">
          <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    await sendMail(confirmationSubject, confirmationMessage, normalizedEmail);

    return res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.',
    });

  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};