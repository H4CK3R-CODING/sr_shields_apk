// src/state/authStore.js
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerPushToken } from "../utils/registerPushToken";
// api/axios.js
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  role: null, // 'admin' or 'user'
  isLoggedIn: false,
  isLoading: true, // Important: Start as true for initial load
  token: null,

  setUser: async (userData) => {
    const prevState = get() || {};

    const mergedUser = {
      ...prevState.user,
      ...userData,
    };

    set({
      ...prevState,
      user: mergedUser,
      role: mergedUser?.role || null,
      isLoggedIn: true,
    });

    // Prepare auth data
    const authData = {
      ...prevState,
      user: mergedUser,
      role: mergedUser?.role,
      isLoggedIn: true,
    };

    // Save to AsyncStorage for persistence
    await AsyncStorage.setItem("authData", JSON.stringify(authData));
  },

  // Initialize - Check AsyncStorage on app start
  initialize: async () => {
    try {
      set({ isLoading: true });

      // Try to get stored auth data
      const storedAuth = await AsyncStorage.getItem("authData");
      console.log("Stored auth data:", storedAuth);
      if (storedAuth && storedAuth !== undefined && storedAuth !== null) {
        const authData = JSON.parse(storedAuth);

        // Check if token is expired (optional)
        const isTokenValid = get().checkTokenExpiry(authData.accessToken);

        if (isTokenValid) {
          // Auto-login with stored data
          set({
            user: authData.user,
            role: authData.role,
            isLoggedIn: true,
            token: authData.token,
            isLoading: false,
          });

          console.log("✅ Auto-login successful:", authData?.user?.email);
        } else {
          // Token expired, clear data
          await get().logout();
        }
      } else {
        // No stored auth data
        set({ isLoading: false });
        console.log("ℹ️ No stored authentication found");
      }
    } catch (error) {
      console.error("❌ Initialize error:", error);
      set({ isLoading: false });
    }
  },

  // Login
  login: async (email, password) => {
    try {
      set({ isLoading: true });
      console.log(`🔐 Attempting login for: ${email}`);

      const { data, error } = await api.post("/auth/login", {
        email,
        password,
      });

      console.log(data);
      console.log(error);

      // Extract data from response
      const { user, token } = data.data;

      // Prepare auth data
      const authData = {
        user,
        role: user?.role,
        token,
      };

      // Save to AsyncStorage for persistence
      await AsyncStorage.setItem("authData", JSON.stringify(authData));

      // Update state
      set({
        user,
        role: user?.role,
        isLoggedIn: true,
        token,
        isLoading: false,
      });

      await registerPushToken();

      console.log("✅ Login successful:", user?.email);

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      console.error("❌ Login error:", error);

      // Handle different error responses
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";

      return { success: false, error: errorMessage };
    }
  },

  // Register
  register: async (userData, password) => {
    try {
      set({ isLoading: true });

      const { data } = await api.post("/auth/register", {
        ...userData,
        password,
      });

      set({ isLoading: false });
      console.log("Registration successful:", data);

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      console.error("Registration error:", error);

      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: async () => {
    try {

      const authData = await AsyncStorage.getItem("authData");
      const token = authData ? JSON.parse(authData).token : null;


      // Clear AsyncStorage
      await AsyncStorage.removeItem("authData");

      // Reset state
      set({
        user: null,
        role: null,
        isLoggedIn: false,
        token: null,
      });

      
      if (token) {
        const { data } = await api.get("/user/clear-push-token", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ Logout successful", data);
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  },

  // Update Profile
  updateProfile: async (updatedData) => {
    try {
      const currentUser = get().user;
      const currentRole = get().role;
      const currentToken = get().token;

      const updatedUser = {
        ...currentUser,
        ...updatedData,
      };

      // Update AsyncStorage
      const authData = {
        user: updatedUser,
        role: currentRole,
        token: currentToken,
      };

      await AsyncStorage.setItem("authData", JSON.stringify(authData));

      // Update state
      set({ user: updatedUser });

      console.log("✅ Profile updated successfully");
      return { success: true };
    } catch (error) {
      console.error("❌ Update profile error:", error);
      return { success: false, error: error.message };
    }
  },

  // Check token expiry (for JWT tokens)
  checkTokenExpiry: (token) => {
    // For mock tokens, always return true
    // In production with real JWT tokens:
    try {
      // Uncomment when using real JWT tokens:
      // import jwtDecode from 'jwt-decode';
      // const decoded = jwtDecode(token);
      // const currentTime = Date.now() / 1000;
      // return decoded.exp > currentTime;

      return true; // Mock: always valid
    } catch (error) {
      return false;
    }
  },

  // Make authenticated API calls (helper function)
  makeAuthenticatedRequest: async (url, options = {}) => {
    const token = get().token;

    if (!token) {
      throw new Error("No authentication token");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // If token expired (401), logout
    if (response.status === 401) {
      await get().logout();
      throw new Error("Session expired. Please login again.");
    }

    return response;
  },

  // Get current auth state
  getAuthState: () => {
    const state = get();
    return {
      isLoggedIn: state.isLoggedIn,
      user: state.user,
      role: state.role,
      isLoading: state.isLoading,
    };
  },
}));

export default useAuthStore;
