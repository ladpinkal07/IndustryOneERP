import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import ToastContainer from '../components/common/ToastContainer';

const NotificationContext = createContext(null);

let toastCounter = 0;

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [toastPlacement, setToastPlacement] = useState('top-right');

  // Persistent notifications (header bell dropdown)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Database Connection Verified',
      message: 'MySQL pool latency 1.2ms (Healthy)',
      time: 'Just now',
      type: 'success',
      read: false,
    },
    {
      id: 2,
      title: 'Schema Migration v1 Applied',
      message: 'System settings table initialized',
      time: '15m ago',
      type: 'info',
      read: false,
    },
  ]);

  // Toast Dismissal
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Add Toast helper
  const addToast = useCallback((message, { type = 'info', title = null, duration = 4000 } = {}) => {
    toastCounter += 1;
    const newId = `toast-${toastCounter}-${Date.now()}`;
    const newToast = {
      id: newId,
      message,
      type,
      title,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);
    return newId;
  }, []);

  // Convenience Toast Methods
  const toast = useMemo(
    () => ({
      success: (message, options) => addToast(message, { ...options, type: 'success' }),
      error: (message, options) => addToast(message, { ...options, type: 'error', duration: options?.duration || 5000 }),
      warning: (message, options) => addToast(message, { ...options, type: 'warning' }),
      info: (message, options) => addToast(message, { ...options, type: 'info' }),
      custom: (message, options) => addToast(message, options),
      dismiss: dismissToast,
      setPlacement: setToastPlacement,
    }),
    [addToast, dismissToast]
  );

  // Persistent Notification Actions
  const addNotification = useCallback(({ title, message, type = 'info' }) => {
    const newItem = {
      id: Date.now(),
      title,
      message,
      time: 'Just now',
      type,
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    toast,
    notifications,
    addNotification,
    markAllNotificationsAsRead,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Global Floating Toast Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
        placement={toastPlacement}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export function useToast() {
  const { toast } = useNotification();
  return toast;
}
