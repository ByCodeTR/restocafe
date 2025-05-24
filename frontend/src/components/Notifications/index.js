import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification, markAsRead } from '../../store/slices/notificationSlice';
import { FiX, FiInfo, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const NotificationItem = ({ notification, onClose }) => {
  const { id, type, message, duration } = notification;
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    info: <FiInfo className="w-5 h-5 text-blue-500" />,
    success: <FiCheckCircle className="w-5 h-5 text-green-500" />,
    warning: <FiAlertCircle className="w-5 h-5 text-yellow-500" />,
    error: <FiAlertCircle className="w-5 h-5 text-red-500" />
  };

  const bgColors = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200'
  };

  return (
    <div
      className={`flex items-center p-4 mb-4 rounded-lg border ${bgColors[type]} shadow-lg transition-all duration-300`}
      role="alert"
    >
      <div className="mr-3">{icons[type]}</div>
      <div className="flex-1 mr-2">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <FiX className="w-5 h-5" />
      </button>
    </div>
  );
};

const Notifications = () => {
  const notifications = useSelector(state => state.notifications.notifications);
  const dispatch = useDispatch();

  const handleClose = (id) => {
    dispatch(markAsRead(id));
    dispatch(removeNotification(id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-96 space-y-4">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={handleClose}
        />
      ))}
    </div>
  );
};

export default Notifications; 