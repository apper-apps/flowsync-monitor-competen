// Mock dashboard service for development
const mockData = {
  admin: {
    activeCustomers: 245,
    pendingTasks: 32,
    completionRate: 87,
    activeWorkflows: 12,
    taskSummary: [
      { type: 'call', count: 15, status: 'pending' },
      { type: 'email', count: 8, status: 'pending' },
      { type: 'whatsapp', count: 9, status: 'pending' }
    ],
    performanceData: [
      { name: 'Jan', completed: 65, pending: 28 },
      { name: 'Feb', completed: 78, pending: 22 },
      { name: 'Mar', completed: 82, pending: 18 },
      { name: 'Apr', completed: 75, pending: 25 },
      { name: 'May', completed: 88, pending: 12 },
      { name: 'Jun', completed: 92, pending: 8 }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'task_completed',
        message: 'John Doe completed call task for Sarah Wilson',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        user: { name: 'John Doe', avatar: null }
      },
      {
        id: 2,
        type: 'customer_added',
        message: 'New customer Michael Brown was added to the system',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        user: { name: 'Jane Smith', avatar: null }
      },
      {
        id: 3,
        type: 'workflow_triggered',
        message: 'Follow-up workflow triggered for 3 customers',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        user: { name: 'System', avatar: null }
      }
    ]
  },
  staff: {
    activeCustomers: 28,
    pendingTasks: 12,
    completionRate: 93,
    activeWorkflows: 3,
    taskSummary: [
      { type: 'call', count: 6, status: 'pending' },
      { type: 'email', count: 3, status: 'pending' },
      { type: 'whatsapp', count: 3, status: 'pending' }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'task_completed',
        message: 'You completed email task for Jennifer Davis',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        user: { name: 'You', avatar: null }
      },
      {
        id: 2,
        type: 'task_assigned',
        message: 'New call task assigned for Robert Johnson',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        user: { name: 'System', avatar: null }
      }
    ]
  }
};

export const dashboardService = {
async getDashboardData(role) {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Validate role parameter
      if (!role || typeof role !== 'string') {
        console.warn('Invalid role provided to getDashboardData:', role);
        return mockData.staff;
      }
      
      const data = mockData[role] || mockData.staff;
      
      // Validate data integrity
      if (!data || typeof data !== 'object') {
        throw new Error('Dashboard data is corrupted or unavailable');
      }
      
      return data;
    } catch (error) {
      console.error('Dashboard service error:', error);
      // Return fallback data instead of throwing
      return {
        activeCustomers: 0,
        pendingTasks: 0,
        completionRate: 0,
        activeWorkflows: 0,
        taskSummary: [],
        performanceData: [],
        recentActivities: []
      };
    }
  },

  async getKPIData() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalCustomers: 245,
      activeCustomers: 198,
      completedTasks: 1247,
      pendingTasks: 32,
      completionRate: 87.5,
      averageResponseTime: '2.3 hours'
    };
  },

  async getPerformanceMetrics(period = '6months') {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const periods = {
      '7days': [
        { name: 'Mon', completed: 12, pending: 3 },
        { name: 'Tue', completed: 15, pending: 2 },
        { name: 'Wed', completed: 18, pending: 4 },
        { name: 'Thu', completed: 14, pending: 6 },
        { name: 'Fri', completed: 22, pending: 2 },
        { name: 'Sat', completed: 8, pending: 1 },
        { name: 'Sun', completed: 5, pending: 0 }
      ],
      '30days': mockData.admin.performanceData,
      '6months': mockData.admin.performanceData
    };
    
    return periods[period] || periods['30days'];
  }
};