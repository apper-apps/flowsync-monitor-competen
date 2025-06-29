// Mock API service for reports and analytics
// Replace with actual API calls when backend is ready

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data generator functions
const generateDates = (days) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const generateRandomData = (length, min = 0, max = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

// Mock report data based on period and branch
const generateMockReportData = (period, branch) => {
  const days = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '1y': 365
  }[period] || 30;

  const branchMultiplier = {
    'all': 1,
    'main': 0.4,
    'downtown': 0.25,
    'north': 0.2,
    'south': 0.15
  }[branch] || 1;

  const baseCustomers = Math.floor(1247 * branchMultiplier);
  const baseTasks = Math.floor(896 * branchMultiplier);
  const baseWorkflows = Math.floor(23 * branchMultiplier);
  const baseRevenue = Math.floor(125420 * branchMultiplier);

  return {
    // Key metrics
    totalCustomers: baseCustomers,
    customerGrowth: Math.floor(Math.random() * 15) + 5,
    tasksCompleted: baseTasks,
    taskGrowth: Math.floor(Math.random() * 20) + 10,
    activeWorkflows: baseWorkflows,
    workflowEfficiency: Math.floor(Math.random() * 15) + 80,
    revenueImpact: baseRevenue,
    revenueGrowth: Math.floor(Math.random() * 12) + 8,

    // Performance chart data
    performanceChart: {
      dates: generateDates(Math.min(days, 30)),
      tasksCompleted: generateRandomData(Math.min(days, 30), 10, 50),
      customersAdded: generateRandomData(Math.min(days, 30), 5, 25),
      workflowsTriggered: generateRandomData(Math.min(days, 30), 8, 35)
    },

    // Staff performance data
    staffPerformance: {
      names: ['Sarah Johnson', 'Mike Chen', 'Lisa Rodriguez', 'David Kim', 'Emma Wilson'],
      completedTasks: generateRandomData(5, 45, 95)
    },

    // Top performing staff
    topStaff: [
      {
        id: '1',
        name: 'Sarah Johnson',
        branch: branch === 'all' ? 'Main Branch' : 'Main Branch',
        tasksCompleted: Math.floor(Math.random() * 30) + 85
      },
      {
        id: '2',
        name: 'Mike Chen',
        branch: branch === 'all' ? 'Downtown Branch' : 'Downtown Branch',
        tasksCompleted: Math.floor(Math.random() * 25) + 78
      },
      {
        id: '3',
        name: 'Lisa Rodriguez',
        branch: branch === 'all' ? 'North Branch' : 'North Branch',
        tasksCompleted: Math.floor(Math.random() * 20) + 72
      },
      {
        id: '4',
        name: 'David Kim',
        branch: branch === 'all' ? 'South Branch' : 'South Branch',
        tasksCompleted: Math.floor(Math.random() * 18) + 68
      },
      {
        id: '5',
        name: 'Emma Wilson',
        branch: branch === 'all' ? 'Main Branch' : 'Main Branch',
        tasksCompleted: Math.floor(Math.random() * 15) + 65
      }
    ],

    // Package statistics
    packageStats: [
      {
        name: 'Premium Package',
        customers: Math.floor(baseCustomers * 0.35),
        percentage: 35
      },
      {
        name: 'Standard Package',
        customers: Math.floor(baseCustomers * 0.45),
        percentage: 45
      },
      {
        name: 'Basic Package',
        customers: Math.floor(baseCustomers * 0.20),
        percentage: 20
      }
    ],

    // Recent milestones
    milestones: [
      {
        id: '1',
        type: 'achievement',
        title: '1000+ Customers Milestone',
        description: 'Reached 1000 active customers this month',
        date: '2 days ago'
      },
      {
        id: '2',
        type: 'info',
        title: 'New Workflow Activated',
        description: 'Customer satisfaction survey workflow is now live',
        date: '5 days ago'
      },
      {
        id: '3',
        type: 'achievement',
        title: 'High Task Completion Rate',
        description: '95% task completion rate achieved this week',
        date: '1 week ago'
      },
      {
        id: '4',
        type: 'warning',
        title: 'Branch Performance Alert',
        description: 'South branch showing lower activity levels',
        date: '1 week ago'
      }
    ]
  };
};

export const reportService = {
  // Get comprehensive reports
  async getReports(period = '30d', branch = 'all') {
    try {
      await delay(1200); // Simulate longer load time for complex data
      
      const reportData = generateMockReportData(period, branch);
      
      return reportData;
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      throw new Error('Failed to load report data');
    }
  },

  // Get specific metric data
  async getMetrics(metric, period = '30d', branch = 'all') {
    try {
      await delay(600);
      
      const reportData = generateMockReportData(period, branch);
      
      switch (metric) {
        case 'customers':
          return {
            total: reportData.totalCustomers,
            growth: reportData.customerGrowth,
            trend: generateRandomData(7, -5, 15)
          };
        case 'tasks':
          return {
            total: reportData.tasksCompleted,
            growth: reportData.taskGrowth,
            trend: generateRandomData(7, 5, 25)
          };
        case 'workflows':
          return {
            total: reportData.activeWorkflows,
            efficiency: reportData.workflowEfficiency,
            trend: generateRandomData(7, 0, 10)
          };
        case 'revenue':
          return {
            total: reportData.revenueImpact,
            growth: reportData.revenueGrowth,
            trend: generateRandomData(7, 100, 500)
          };
        default:
          throw new Error('Invalid metric type');
      }
    } catch (error) {
      console.error('Failed to fetch metric data:', error);
      throw new Error('Failed to load metric data');
    }
  },

  // Export reports
  async exportReports(format = 'pdf', period = '30d', branch = 'all') {
    try {
      await delay(2000); // Simulate export processing time
      
      // In a real implementation, this would generate and return a file
      const exportData = {
        format,
        period,
        branch,
        generatedAt: new Date().toISOString(),
        downloadUrl: `/api/reports/export/${Date.now()}.${format}`
      };
      
      return exportData;
    } catch (error) {
      console.error('Failed to export reports:', error);
      throw new Error('Failed to export report data');
    }
  },

  // Get branch comparison data
  async getBranchComparison(period = '30d') {
    try {
      await delay(800);
      
      const branches = ['main', 'downtown', 'north', 'south'];
      const comparisonData = branches.map(branch => {
        const data = generateMockReportData(period, branch);
        return {
          branch: branch.charAt(0).toUpperCase() + branch.slice(1) + ' Branch',
          customers: data.totalCustomers,
          tasks: data.tasksCompleted,
          revenue: data.revenueImpact,
          efficiency: data.workflowEfficiency
        };
      });
      
      return comparisonData;
    } catch (error) {
      console.error('Failed to fetch branch comparison:', error);
      throw new Error('Failed to load branch comparison data');
    }
  }
};