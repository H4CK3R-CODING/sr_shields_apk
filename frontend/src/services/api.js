// src/services/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // e.g., http://192.168.1.100:5000/api
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const authData = await AsyncStorage.getItem("authData");
      const token = authData ? JSON.parse(authData).token : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error getting token from storage:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - Token expired or invalid
      if (error.response.status === 401) {
        // Clear stored token
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("authData");

        // You can dispatch a logout action here if using Redux/Context
        // store.dispatch(logout());

        // Or navigate to login screen
        // NavigationService.navigate('Login');
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error("Access forbidden:", error.response.data.message);
      }

      // Handle 500 Server Error
      if (error.response.status === 500) {
        console.error("Server error:", error.response.data.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Notice API functions (add to existing api.js)
export const noticeAPI = {
  // Admin: Get all notices
  getAllNoticesAdmin: async (params) => {
    return await api.get("/notices/admin/all", { params });
  },

  // Admin: Create notice
  createNotice: async (noticeData) => {
    return await api.post("/notices", noticeData);
  },

  // Admin: Update notice
  updateNotice: async (noticeId, noticeData) => {
    return await api.put(`/notices/${noticeId}`, noticeData);
  },

  // Admin: Toggle notice status
  toggleNoticeStatus: async (noticeId) => {
    return await api.patch(`/notices/${noticeId}/toggle-status`);
  },

  // Admin: Toggle pin status
  togglePinStatus: async (noticeId) => {
    return await api.patch(`/notices/${noticeId}/toggle-pin`);
  },

  // Admin: Delete notice
  deleteNotice: async (noticeId) => {
    return await api.delete(`/notices/${noticeId}`);
  },

  // User: Get active notices
  getActiveNotices: async (params) => {
    return await api.get("/notices/active", { params });
  },

  // User/Admin: Get single notice
  getNoticeById: async (noticeId) => {
    return await api.get(`/notices/${noticeId}`);
  },
};


// Notification API functions
export const notificationAPI = {
  // Admin: Get all notifications
  getAllNotifications: async () => {
    return await api.get("/notifications/all");
  },

  // Admin: Create and send notification to all users
  createNotification: async (notificationData) => {
    return await api.post("/notifications", notificationData);
  },

  // Admin: Delete notification
  deleteNotification: async (notificationId) => {
    return await api.delete(`/notifications/${notificationId}`);
  },

  // User: Get my notifications
  getMyNotifications: async () => {
    return await api.get("/notifications/my-notifications");
  },

  // User: Mark notification as read
  markAsRead: async (notificationId) => {
    return await api.put(`/notifications/${notificationId}/read`);
  },
};
