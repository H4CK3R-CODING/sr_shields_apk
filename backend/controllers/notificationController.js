import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const createNotification = async (req, res) => {
  try {
    const { title, message, priority } = req.body;

    // Validate input
    if (!title || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and message are required' 
      });
    }

    // Create notification
    const notification = new Notification({
      title,
      message,
      priority: priority || 'normal',
      createdBy: req.user.id, // Assuming admin user ID from auth middleware
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: `Notification created successfully`,
      notification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating notification',
      error: error.message 
    });
  }
};



// Get all notifications (for admin)
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching notifications',
      error: error.message 
    });
  }
};



// Get notifications for a specific user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all notifications (not user-specific)
    const notifications = await Notification.find()
      .sort({ createdAt: -1 });

    // Get user's read notifications
    const user = await User.findById(userId).select('readNotifications');

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications: notifications,
      readNotifications: user.readNotifications || []
    });

  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching notifications',
      error: error.message 
    });
  }
};



// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting notification',
      error: error.message 
    });
  }
};



// Mark notification as read for a user
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    
    if (!user.readNotifications.includes(notificationId)) {
      user.readNotifications.push(notificationId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating notification',
      error: error.message 
    });
  }
};
