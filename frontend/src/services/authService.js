// src/services/authService.js
import axios from "axios";

// Base URL for your backend API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

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
      message: response.data.message || 'OTP sent successfully',
      data: response.data,
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP',
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
      message: response.data.message || 'OTP verified successfully',
      data: response.data,
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid or expired OTP',
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