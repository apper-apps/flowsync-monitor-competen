import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow } from 'date-fns';
import { notificationService } from '@/services/api/notificationService';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.Id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      task: 'CheckSquare',
      customer: 'User',
      workflow: 'GitBranch',
      system: 'Bell'
    };
    return icons[type] || 'Bell';
  };

  const getNotificationColor = (type) => {
    const colors = {
      task: 'text-primary-600',
      customer: 'text-secondary-600',
      workflow: 'text-accent-600',
      system: 'text-slate-600'
    };
    return colors[type] || 'text-slate-600';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-20"
          >
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                <span className="text-sm text-slate-500">
                  {notifications.filter(n => !n.isRead).length} unread
                </span>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="text-sm text-slate-500 mt-2">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <ApperIcon name="BellOff" className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No notifications yet</p>
                  <p className="text-xs text-slate-400 mt-1">We'll notify you when something important happens</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.Id}
                      className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-primary-50/30' : ''
                      }`}
                      onClick={() => markAsRead(notification.Id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-slate-100 ${getNotificationColor(notification.type)}`}>
                          <ApperIcon 
                            name={getNotificationIcon(notification.type)} 
                            className="w-4 h-4" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-200">
                <button 
                  className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                  onClick={onClose}
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;