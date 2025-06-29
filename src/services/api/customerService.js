// Mock customer service for development
const mockCustomers = [
  {
    Id: 1,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    whatsapp: '+1234567890',
    branch: 'Downtown',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastContacted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    assignedAgent: 'John Doe',
    notes: 'Interested in life insurance. High priority client.',
    tags: ['VIP', 'Life Insurance']
  },
  {
    Id: 2,
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    whatsapp: '+1234567891',
    branch: 'North Branch',
    status: 'active',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    lastContacted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    assignedAgent: 'Jane Smith',
    notes: 'Auto insurance renewal due next month.',
    tags: ['Auto Insurance']
  },
  {
    Id: 3,
    name: 'Jennifer Davis',
    email: 'jennifer.davis@email.com',
    whatsapp: '+1234567892',
    branch: 'South Branch',
    status: 'completed',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    lastContacted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    assignedAgent: 'John Doe',
    notes: 'Home insurance policy completed successfully.',
    tags: ['Home Insurance', 'Completed']
  },
  {
    Id: 4,
    name: 'Robert Johnson',
    email: 'robert.johnson@email.com',
    whatsapp: '+1234567893',
    branch: 'Downtown',
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    lastContacted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    assignedAgent: 'Jane Smith',
    notes: 'Business insurance inquiry. Schedule follow-up.',
    tags: ['Business Insurance']
  },
  {
    Id: 5,
    name: 'Emily Chen',
    email: 'emily.chen@email.com',
    whatsapp: '+1234567894',
    branch: 'East Branch',
    status: 'paused',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    lastContacted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    assignedAgent: 'John Doe',
    notes: 'Travel insurance. Waiting for customer response.',
    tags: ['Travel Insurance']
  }
];

export const customerService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Simulate occasional errors
    if (Math.random() < 0.05) {
      throw new Error('Failed to fetch customers');
    }
    
    return [...mockCustomers];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const customer = mockCustomers.find(c => c.Id === parseInt(id));
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    return { ...customer };
  },

  async create(customerData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simulate validation
    if (!customerData.name || !customerData.email || !customerData.whatsapp) {
      throw new Error('Name, email, and WhatsApp are required');
    }
    
    const newCustomer = {
      Id: Math.max(...mockCustomers.map(c => c.Id)) + 1,
      ...customerData,
      status: 'active',
      createdAt: new Date(),
      lastContacted: new Date(),
      tags: customerData.tags || []
    };
    
    mockCustomers.push(newCustomer);
    return { ...newCustomer };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockCustomers.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    mockCustomers[index] = { ...mockCustomers[index], ...updates };
    return { ...mockCustomers[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockCustomers.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    mockCustomers.splice(index, 1);
    return true;
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const searchTerm = query.toLowerCase();
    return mockCustomers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm) ||
      customer.whatsapp.includes(searchTerm) ||
      customer.branch.toLowerCase().includes(searchTerm)
    );
  },

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return mockCustomers.filter(c => c.status === status);
  },

  async getByBranch(branch) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return mockCustomers.filter(c => c.branch === branch);
  },

  async updateLastContacted(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockCustomers.findIndex(c => c.Id === id);
    if (index !== -1) {
      mockCustomers[index].lastContacted = new Date();
      return { ...mockCustomers[index] };
    }
    
    throw new Error('Customer not found');
  }
};