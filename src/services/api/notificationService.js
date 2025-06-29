// Mock notification service for development
const mockNotifications = [
  {
    Id: 1,
    title: 'Task Overdue',
    message: 'Follow up call for Sarah Wilson is overdue',
    type: 'task',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    priority: 'high',
    actionUrl: '/tasks/1'
  },
  {
    Id: 2,
    title: 'New Customer Added',
    message: 'Michael Brown has been added to your customer list',
    type: 'customer',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    priority: 'medium',
    actionUrl: '/customers/2'
  },
  {
    Id: 3,
    title: 'Workflow Completed',
    message: 'Follow-up workflow completed for Jennifer Davis',
    type: 'workflow',
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    priority: 'low',
    actionUrl: '/workflows'
  },
  {
    Id: 4,
    title: 'System Update',
    message: 'CRM system will undergo maintenance tonight at 11 PM',
    type: 'system',
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    priority: 'medium',
    actionUrl: null
  },
  {
    Id: 5,
    title: 'Task Completed',
    message: 'Email task for Robert Johnson has been completed',
    type: 'task',
    isRead: true,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    priority: 'low',
    actionUrl: '/tasks/4'
  }
];

export const notificationService = {
  async getAll(limit = 50, offset = 0) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Simulate occasional errors
    if (Math.random() < 0.05) {
      throw new Error('Failed to fetch notifications');
    }
    
    // Sort by creation date (newest first)
    const sorted = [...mockNotifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply pagination
    const paginated = sorted.slice(offset, offset + limit);
    
    return paginated;
  },

  async getUnread() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockNotifications.filter(n => !n.isRead);
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const notification = mockNotifications.find(n => n.Id === parseInt(id));
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    return { ...notification };
  },

  async markAsRead(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockNotifications.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Notification not found');
    }
    
    mockNotifications[index].isRead = true;
    return { ...mockNotifications[index] };
  },

  async markAllAsRead() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    mockNotifications.forEach(notification => {
      notification.isRead = true;
    });
    
    return { success: true, markedCount: mockNotifications.length };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockNotifications.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Notification not found');
    }
    
    mockNotifications.splice(index, 1);
    return { success: true };
  },

  async create(notificationData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newNotification = {
      Id: Math.max(...mockNotifications.map(n => n.Id)) + 1,
      ...notificationData,
      isRead: false,
      createdAt: new Date(),
      priority: notificationData.priority || 'medium'
    };
    
    mockNotifications.unshift(newNotification);
    return { ...newNotification };
  },

  async getByType(type) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockNotifications.filter(n => n.type === type);
  },

  async getStats() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const total = mockNotifications.length;
    const unread = mockNotifications.filter(n => !n.isRead).length;
    const byType = mockNotifications.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total,
      unread,
      read: total - unread,
      byType
    };
  },

  async clearOld(daysOld = 30) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    const initialCount = mockNotifications.length;
    
    // Remove old notifications
    for (let i = mockNotifications.length - 1; i >= 0; i--) {
      if (new Date(mockNotifications[i].createdAt) < cutoffDate) {
        mockNotifications.splice(i, 1);
      }
    }
    
    const removedCount = initialCount - mockNotifications.length;
    return { success: true, removedCount };
  },

  // Real-time notification simulation
  subscribe(callback) {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every interval
        const types = ['task', 'customer', 'workflow', 'system'];
        const titles = {
          task: 'New Task Assigned',
          customer: 'Customer Updated',
          workflow: 'Workflow Triggered',
          system: 'System Alert'
        };
        const messages = {
          task: 'A new task has been assigned to you',
          customer: 'Customer information has been updated',
          workflow: 'Automated workflow has been triggered',
          system: 'System notification requires attention'
        };
        
        const type = types[Math.floor(Math.random() * types.length)];
        const newNotification = {
          Id: Math.max(...mockNotifications.map(n => n.Id)) + 1,
          title: titles[type],
          message: messages[type],
          type,
          isRead: false,
          createdAt: new Date(),
          priority: 'medium'
        };
        
        mockNotifications.unshift(newNotification);
        callback(newNotification);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }
};