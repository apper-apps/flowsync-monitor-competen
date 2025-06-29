// Mock API service for workflows
// Replace with actual API calls when backend is ready

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for development
const mockWorkflows = [
  {
    Id: '1',
    name: 'Welcome New Customers',
    description: 'Automated welcome sequence for new customer onboarding',
    trigger: 'customer_created',
    isActive: true,
    steps: [
      { type: 'email', template: 'welcome_email', delay: 0 },
      { type: 'sms', template: 'welcome_sms', delay: 24 },
      { type: 'task', title: 'Follow-up call', delay: 72 }
    ],
    stats: {
      triggered: 245,
      completed: 198,
      successRate: 81
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    Id: '2',
    name: 'Package Renewal Reminder',
    description: 'Remind customers about upcoming package renewals',
    trigger: 'package_expiring',
    isActive: true,
    steps: [
      { type: 'email', template: 'renewal_reminder', delay: 0 },
      { type: 'task', title: 'Customer call', delay: 168 },
      { type: 'email', template: 'final_notice', delay: 336 }
    ],
    stats: {
      triggered: 89,
      completed: 67,
      successRate: 75
    },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T11:45:00Z'
  },
  {
    Id: '3',
    name: 'Customer Satisfaction Survey',
    description: 'Send satisfaction surveys after service completion',
    trigger: 'service_completed',
    isActive: false,
    steps: [
      { type: 'email', template: 'satisfaction_survey', delay: 24 },
      { type: 'sms', template: 'survey_reminder', delay: 168 }
    ],
    stats: {
      triggered: 156,
      completed: 123,
      successRate: 79
    },
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-15T16:10:00Z'
  }
];

export const workflowService = {
  // Get all workflows
  async getAll() {
    try {
      await delay(800); // Simulate network delay
      return [...mockWorkflows];
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
      throw new Error('Failed to load workflows');
    }
  },

  // Get workflow by ID
  async getById(id) {
    try {
      await delay(500);
      const workflow = mockWorkflows.find(w => w.Id === id);
      if (!workflow) {
        throw new Error('Workflow not found');
      }
      return { ...workflow };
    } catch (error) {
      console.error('Failed to fetch workflow:', error);
      throw new Error('Failed to load workflow');
    }
  },

  // Create new workflow
  async create(workflowData) {
    try {
      await delay(1000);
      const newWorkflow = {
        Id: Date.now().toString(),
        ...workflowData,
        isActive: workflowData.isActive ?? true,
        stats: {
          triggered: 0,
          completed: 0,
          successRate: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockWorkflows.push(newWorkflow);
      return { ...newWorkflow };
    } catch (error) {
      console.error('Failed to create workflow:', error);
      throw new Error('Failed to create workflow');
    }
  },

  // Update workflow
  async update(id, workflowData) {
    try {
      await delay(800);
      const index = mockWorkflows.findIndex(w => w.Id === id);
      if (index === -1) {
        throw new Error('Workflow not found');
      }
      
      const updatedWorkflow = {
        ...mockWorkflows[index],
        ...workflowData,
        updatedAt: new Date().toISOString()
      };
      
      mockWorkflows[index] = updatedWorkflow;
      return { ...updatedWorkflow };
    } catch (error) {
      console.error('Failed to update workflow:', error);
      throw new Error('Failed to update workflow');
    }
  },

  // Delete workflow
  async delete(id) {
    try {
      await delay(600);
      const index = mockWorkflows.findIndex(w => w.Id === id);
      if (index === -1) {
        throw new Error('Workflow not found');
      }
      
      mockWorkflows.splice(index, 1);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      throw new Error('Failed to delete workflow');
    }
  },

  // Toggle workflow active status
  async toggle(id, isActive) {
    try {
      await delay(500);
      const index = mockWorkflows.findIndex(w => w.Id === id);
      if (index === -1) {
        throw new Error('Workflow not found');
      }
      
      mockWorkflows[index] = {
        ...mockWorkflows[index],
        isActive,
        updatedAt: new Date().toISOString()
      };
      
      return { ...mockWorkflows[index] };
    } catch (error) {
      console.error('Failed to toggle workflow:', error);
      throw new Error('Failed to update workflow status');
    }
  },

  // Get workflow statistics
  async getStats(id) {
    try {
      await delay(400);
      const workflow = mockWorkflows.find(w => w.Id === id);
      if (!workflow) {
        throw new Error('Workflow not found');
      }
      
      return {
        ...workflow.stats,
        recentTriggers: [
          { date: '2024-01-20', count: 12 },
          { date: '2024-01-19', count: 8 },
          { date: '2024-01-18', count: 15 }
        ]
      };
    } catch (error) {
      console.error('Failed to fetch workflow stats:', error);
      throw new Error('Failed to load workflow statistics');
    }
  }
};