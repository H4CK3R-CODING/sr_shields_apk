// src/state/contentStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useContentStore = create((set, get) => ({
  // State
  notifications: [],
  notices: [],
  jobs: [],
  forms: [],
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Notifications
  addNotification: async (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const notifications = [newNotification, ...get().notifications];
    set({ notifications });
    await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
  },

  deleteNotification: async (id) => {
    const notifications = get().notifications.filter(n => n.id !== id);
    set({ notifications });
    await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
  },

  markNotificationAsRead: async (id) => {
    const notifications = get().notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    set({ notifications });
    await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
  },

  // Notices
  addNotice: async (notice) => {
    const newNotice = {
      id: Date.now().toString(),
      ...notice,
      createdAt: new Date().toISOString(),
    };
    const notices = [newNotice, ...get().notices];
    set({ notices });
    await AsyncStorage.setItem('notices', JSON.stringify(notices));
  },

  updateNotice: async (id, updatedData) => {
    const notices = get().notices.map(n => 
      n.id === id ? { ...n, ...updatedData } : n
    );
    set({ notices });
    await AsyncStorage.setItem('notices', JSON.stringify(notices));
  },

  deleteNotice: async (id) => {
    const notices = get().notices.filter(n => n.id !== id);
    set({ notices });
    await AsyncStorage.setItem('notices', JSON.stringify(notices));
  },

  // Jobs
  addJob: async (job) => {
    const newJob = {
      id: Date.now().toString(),
      ...job,
      createdAt: new Date().toISOString(),
      applicants: 0,
    };
    const jobs = [newJob, ...get().jobs];
    set({ jobs });
    await AsyncStorage.setItem('jobs', JSON.stringify(jobs));
  },

  updateJob: async (id, updatedData) => {
    const jobs = get().jobs.map(j => 
      j.id === id ? { ...j, ...updatedData } : j
    );
    set({ jobs });
    await AsyncStorage.setItem('jobs', JSON.stringify(jobs));
  },

  deleteJob: async (id) => {
    const jobs = get().jobs.filter(j => j.id !== id);
    set({ jobs });
    await AsyncStorage.setItem('jobs', JSON.stringify(jobs));
  },

  // Forms
  addForm: async (form) => {
    const newForm = {
      id: Date.now().toString(),
      ...form,
      createdAt: new Date().toISOString(),
      downloads: 0,
    };
    const forms = [newForm, ...get().forms];
    set({ forms });
    await AsyncStorage.setItem('forms', JSON.stringify(forms));
  },

  updateForm: async (id, updatedData) => {
    const forms = get().forms.map(f => 
      f.id === id ? { ...f, ...updatedData } : f
    );
    set({ forms });
    await AsyncStorage.setItem('forms', JSON.stringify(forms));
  },

  deleteForm: async (id) => {
    const forms = get().forms.filter(f => f.id !== id);
    set({ forms });
    await AsyncStorage.setItem('forms', JSON.stringify(forms));
  },

  incrementFormDownloads: async (id) => {
    const forms = get().forms.map(f => 
      f.id === id ? { ...f, downloads: (f.downloads || 0) + 1 } : f
    );
    set({ forms });
    await AsyncStorage.setItem('forms', JSON.stringify(forms));
  },

  // Load data from AsyncStorage
  loadAllData: async () => {
    try {
      set({ loading: true });
      const [notificationsData, noticesData, jobsData, formsData] = await Promise.all([
        AsyncStorage.getItem('notifications'),
        AsyncStorage.getItem('notices'),
        AsyncStorage.getItem('jobs'),
        AsyncStorage.getItem('forms'),
      ]);

      set({
        notifications: notificationsData ? JSON.parse(notificationsData) : [],
        notices: noticesData ? JSON.parse(noticesData) : [],
        jobs: jobsData ? JSON.parse(jobsData) : [],
        forms: formsData ? JSON.parse(formsData) : [],
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Clear all data
  clearAllData: async () => {
    await AsyncStorage.multiRemove(['notifications', 'notices', 'jobs', 'forms']);
    set({ notifications: [], notices: [], jobs: [], forms: [] });
  },
}));

export default useContentStore;