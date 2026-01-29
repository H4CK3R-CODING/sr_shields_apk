// src/services/authService.js
import axios from "axios";

// Base URL for your backend API
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Send OTP to user's email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Response with success status
 */
export const sendOTP = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-otp`, {
      email: email.trim().toLowerCase(),
    });

    return {
      success: true,
      message: response.data.message || "OTP sent successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Error sending OTP:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Failed to send OTP",
      error: error.response?.data || error.message,
    };
  }
};

/**
 * Verify OTP code
 * @param {string} email - User's email address
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<Object>} Response with verification status
 */
export const verifyOTP = async (email, otp) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
    });

    return {
      success: true,
      message: response.data.message || "OTP verified successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Invalid or expired OTP",
      error: error.response?.data || error.message,
    };
  }
};

/**
 * Resend OTP to user's email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Response with success status
 */
export const resendOTP = async (email) => {
  return sendOTP(email);
};

// Add these functions to your authService.js

export const sendPasswordResetOTP = async (email) => {
  try {
    // const response = await fetch(`${API_URL}/auth/forgot-password/send-otp`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ email }),
    // });

    const response = await axios.post(
      `${API_BASE_URL}/auth/forgot-password/send-otp`,
      {
        email: email.trim().toLowerCase(),
      },
    );

    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Send Password Reset OTP Error:", error);

    // Handle axios error response
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        message: error.response.data.message || "Failed to send OTP",
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        message: "Network error. Please check your connection.",
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      };
    }
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/forgot-password/reset`,
      { email, otp, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Reset Password Error:", error);

    // Handle axios error response
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        message: error.response.data.message || "Failed to reset password",
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        message: "Network error. Please check your connection.",
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      };
    }
  }
};
