// controllers/adminController.js
import Job from '../models/Job.model.js';
import Form from '../models/Form.model.js';
import Notification from '../models/Notification.js';
import User from "../models/User.js";

// Get Admin Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalForms = await Form.countDocuments();
    const totalNotifications = await Notification.countDocuments();
    const activeJobs = await Job.countDocuments();
    const activeForms = await Form.countDocuments();
    const usersThisMonth = await User.countDocuments();
    const jobsThisMonth = await Job.countDocuments();

    // Get recent activities
    const recentActivities = await getRecentActivities();

    // Compile stats
    const stats = {
      totalUsers,
      totalJobs,
      totalForms,
      totalNotifications,
      activeJobs,
      activeForms,
      usersThisMonth,
      jobsThisMonth,
    };

    res.status(200).json({
      success: true,
      stats,
      recentActivities,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message,
    });
  }
};

// Helper function to get recent activities
async function getRecentActivities() {
  try {
    const activities = [];

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('fullName createdAt');

    recentUsers.forEach(user => {
      activities.push({
        icon: 'person-add',
        color: '#3B82F6',
        title: 'New User Registered',
        description: `${user.fullName} joined the platform`,
        time: getTimeAgo(user.createdAt),
        timestamp: user.createdAt,
      });
    });

    // Get recent jobs
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select('title organization createdAt');

    recentJobs.forEach(job => {
      activities.push({
        icon: 'briefcase',
        color: '#10B981',
        title: 'New Job Posted',
        description: `${job.title} at ${job.organization}`,
        time: getTimeAgo(job.createdAt),
        timestamp: job.createdAt,
      });
    });

    // Get recent forms
    const recentForms = await Form.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select('title createdAt');

    recentForms.forEach(form => {
      activities.push({
        icon: 'document-text',
        color: '#F59E0B',
        title: 'New Form Added',
        description: form.title,
        time: getTimeAgo(form.createdAt),
        timestamp: form.createdAt,
      });
    });

    // Sort all activities by timestamp and return top 10
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10)
      .map(({ timestamp, ...activity }) => activity);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
}

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

// Get User Statistics
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments();
    const inactiveUsers = 0;

    // Users by month (last 6 months)
    const usersByMonth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $limit: 6
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        usersByMonth,
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message,
    });
  }
};

// Get System Overview
// export const getSystemOverview = async (req, res) => {
//   try {
//     const overview = {
//       database: {
//         status: 'connected',
//         uptime: process.uptime(),
//       },
//       server: {
//         status: 'running',
//         version: process.version,
//         platform: process.platform,
//       },
//       memory: {
//         used: process.memoryUsage().heapUsed,
//         total: process.memoryUsage().heapTotal,
//       },
//     };

//     res.status(200).json({
//       success: true,
//       overview,
//     });
//   } catch (error) {
//     console.error('Error fetching system overview:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching system overview',
//       error: error.message,
//     });
//   }
// };
