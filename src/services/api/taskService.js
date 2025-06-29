// Mock task service for development
const mockTasks = [
  {
    Id: 1,
    customerId: 1,
    customerName: 'Sarah Wilson',
    description: 'Follow up on insurance inquiry',
    type: 'call',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    assignedTo: 'John Doe',
    notes: 'Customer interested in life insurance policy'
  },
  {
    Id: 2,
    customerId: 2,
    customerName: 'Michael Brown',
    description: 'Send quote via email',
    type: 'email',
    status: 'overdue',
    priority: 'high',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    assignedTo: 'Jane Smith',
    notes: 'Auto insurance quote requested'
  },
  {
    Id: 3,
    customerId: 3,
    customerName: 'Jennifer Davis',
    description: 'WhatsApp follow-up on claim status',
    type: 'whatsapp',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    assignedTo: 'John Doe',
    notes: 'Claim processed successfully, customer notified'
  },
  {
    Id: 4,
    customerId: 4,
    customerName: 'Robert Johnson',
    description: 'Schedule appointment for policy review',
    type: 'call',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    assignedTo: 'Jane Smith',
    notes: 'Annual review due next month'
  },
  {
    Id: 5,
    customerId: 5,
    customerName: 'Emily Chen',
    description: 'Send policy documents via email',
    type: 'email',
    status: 'pending',
    priority: 'low',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    assignedTo: 'John Doe',
    notes: 'New policy activated, send welcome package'
  }
];

export const taskService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simulate occasional errors
    if (Math.random() < 0.05) {
      throw new Error('Failed to fetch tasks');
    }
    
    return [...mockTasks];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const task = mockTasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error('Task not found');
    }
    
    return { ...task };
  },

  async getByCustomerId(customerId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return mockTasks.filter(t => t.customerId === parseInt(customerId));
  },

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTask = {
      Id: Math.max(...mockTasks.map(t => t.Id)) + 1,
      ...taskData,
      status: 'pending',
      createdAt: new Date(),
      dueDate: new Date(taskData.dueDate)
    };
    
    mockTasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockTasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks[index] = { ...mockTasks[index], ...updates };
    return { ...mockTasks[index] };
  },

  async complete(id, notes = '') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockTasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks[index] = {
      ...mockTasks[index],
      status: 'completed',
      completedAt: new Date(),
      notes: notes || mockTasks[index].notes
    };
    
    return { ...mockTasks[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockTasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks.splice(index, 1);
    return true;
  },

  async getTasksByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return mockTasks.filter(t => t.status === status);
  },

  async getOverdueTasks() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const now = new Date();
    return mockTasks.filter(t => t.status === 'pending' && new Date(t.dueDate) < now);
  }
};