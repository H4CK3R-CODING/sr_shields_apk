import Notification from "../models/Notification.js";
import User from "../models/User.js";
import UserNotification from "../models/UserNotification.model.js";
import { sendPushToUsers } from "../services/expoPush.service.js";

export const createNotification = async (req, res) => {
  try {
    const { title, message, priority } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    const notification = await Notification.create({
      title,
      message,
      priority: priority || "normal",
      createdBy: req.user.id,
    });

    // Create notification entry for every user
    const allUsers = await User.find({ role: "user" }).select(
      "_id expoPushToken"
    );

    const userNotifications = allUsers.map((u) => ({
      user: u._id,
      notification: notification._id,
    }));

    await UserNotification.insertMany(userNotifications);

    // 4️⃣ Filter users WITH push tokens (in memory)
    const pushUsers = allUsers.filter(
      (u) =>
        u.notificationPreferences.push.enabled &&
        u.expoPushToken &&
        u.expoPushToken.trim() !== ""
    );

    // 5️⃣ Send push notifications
    await sendPushToUsers(pushUsers, {
      title: "New Announcement",
      message,
      data: {
        screen: "Notifications",
        notificationId: notification._id,
      },
    });

    for (const user of allUsers) {
      // Send email if enabled
      if (user.notificationPreferences.email.enabled) {
        sendMail({ subject: title, message, gmailTo: user.email });
      }
    }

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all notifications (for admin)
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "fullName email");

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

// Get notifications for a specific user
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await UserNotification.find({
      user: req.user.id,
    })
      .populate("notification")
      .sort({ createdAt: 1 }); // chat-style order

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications: notifications,
    });
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndDelete(id);
    await UserNotification.deleteMany({ notification: id });

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    });
  }
};

// Mark notification as read for a user
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await UserNotification.findOneAndUpdate(
      {
        user: req.user.id,
        notification: notificationId,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Error updating notification",
      error: error.message,
    });
  }
};
