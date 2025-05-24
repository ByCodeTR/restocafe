import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: []
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const { type, message, duration = 5000 } = action.payload;
      const id = Date.now();
      
      state.notifications.push({
        id,
        type,
        message,
        duration,
        isRead: false
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        n => n.id === action.payload
      );
      if (notification) {
        notification.isRead = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const {
  addNotification,
  removeNotification,
  markAsRead,
  clearNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer; 