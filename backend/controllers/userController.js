// controllers/userController.js
import User from '../models/User.js';

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 20 } = req.query;

    // Build filter query
    let filter = {};
    
    // Filter by role
    if (role) {
      filter.role = role;
    }
    
    // Filter by active status
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    // Search by name, email, or phone
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    // Get statistics
    const stats = {
      totalUsers: await User.countDocuments({ role: 'user' }),
      activeUsers: await User.countDocuments({ role: 'user', isActive: true }),
      inactiveUsers: await User.countDocuments({ role: 'user', isActive: false }),
      totalAdmins: await User.countDocuments({ role: 'admin' }),
    };

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      stats,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get single user by ID (Admin only)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Toggle user active status (Admin only)
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deactivating admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot deactivate admin users'
      });
    }

    // Toggle isActive status
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// Delete user (Admin only) - Soft delete by setting isActive to false
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    // Soft delete - just deactivate
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};


/**
 * Get User/Admin Profile
 * @route GET /api/user/profile OR /api/admin/profile
 * @access Private (User/Admin)
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Build response based on role
    const profileData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Add role-specific fields
    if (user.role === "user") {
      profileData.address = user.address;
      profileData.dateOfBirth = user.dateOfBirth;
      profileData.gender = user.gender;
    }

    if (user.role === "admin") {
      profileData.department = user.department;
    }

    res.status(200).json({
      success: true,
      user: profileData,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load profile",
      error: error.message,
    });
  }
};

/**
 * Update User/Admin Profile
 * @route PUT /api/user/profile OR /api/admin/profile
 * @access Private (User/Admin)
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, address, dateOfBirth, gender, department } = req.body;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Common validation
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 2 characters",
      });
    }

    if (!phone || !phone.match(/^[0-9]{10}$/)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number",
      });
    }

    // Update common fields
    user.fullName = fullName.trim();
    user.phone = phone;

    // Role-specific validation and updates
    if (user.role === "user") {
      if (!address || address.trim().length < 5) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid address (minimum 5 characters)",
        });
      }

      if (!dateOfBirth) {
        return res.status(400).json({
          success: false,
          message: "Date of birth is required",
        });
      }

      if (!["male", "female", "other"].includes(gender)) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid gender",
        });
      }

      user.address = address.trim();
      user.dateOfBirth = new Date(dateOfBirth);
      user.gender = gender;
    }

    if (user.role === "admin") {
      if (!department || department.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Department is required for admin users",
        });
      }

      user.department = department.trim();
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select("-password");

    // Build response based on role
    const profileData = {
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      isEmailVerified: updatedUser.isEmailVerified,
      lastLogin: updatedUser.lastLogin,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    if (updatedUser.role === "user") {
      profileData.address = updatedUser.address;
      profileData.dateOfBirth = updatedUser.dateOfBirth;
      profileData.gender = updatedUser.gender;
    }

    if (updatedUser.role === "admin") {
      profileData.department = updatedUser.department;
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: profileData,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

/**
 * Change Password (User/Admin)
 * @route PUT /api/user/change-password OR /api/admin/change-password
 * @access Private (User/Admin)
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Find user with password field
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};

/**
 * Delete Account (User/Admin)
 * @route DELETE /api/user/profile OR /api/admin/profile
 * @access Private (User/Admin)
 */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete account",
      });
    }

    // Find user with password
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Soft delete - deactivate account
    user.isActive = false;
    await user.save();

    // Or hard delete if you prefer
    // await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
};