// Mock settings service for development
const mockSettings = {
  general: {
    systemName: 'FlowSync CRM',
    timezone: 'UTC',
    autoAssignTasks: true,
    overdueNotifications: true,
    defaultLanguage: 'en',
    dateFormat: 'MM/dd/yyyy'
  },
  notifications: {
    email: {
      taskReminders: true,
      overdueAlerts: true,
      workflowUpdates: false,
      systemAlerts: true
    },
    inApp: {
      newCustomers: true,
      taskUpdates: true,
      workflowTriggers: true,
      systemMaintenance: false
    },
    sms: {
      criticalAlerts: false,
      taskReminders: false
    }
  },
  security: {
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    requireTwoFactor: false,
    auditLogging: true,
    passwordMinLength: 8,
    passwordRequireSpecialChars: true
  },
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'admin',
      branch: 'Downtown',
      status: 'active',
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'staff',
      branch: 'North Branch',
      status: 'active',
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      role: 'staff',
      branch: 'South Branch',
      status: 'inactive',
      lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    }
  ],
  branches: [
    {
      id: 1,
      name: 'Downtown',
      address: '123 Main St, Downtown',
      phone: '+1234567890',
      manager: 'John Doe',
      status: 'active',
      staffCount: 8
    },
    {
      id: 2,
      name: 'North Branch',
      address: '456 North Ave, North District',
      phone: '+1234567891',
      manager: 'Jane Smith',
      status: 'active',
      staffCount: 6
    },
    {
      id: 3,
      name: 'South Branch',
      address: '789 South Blvd, South District',
      phone: '+1234567892',
      manager: 'Mike Wilson',
      status: 'active',
      staffCount: 4
    }
  ],
  integrations: {
    email: {
      provider: 'gmail',
      enabled: true,
      settings: {
        smtpServer: 'smtp.gmail.com',
        port: 587,
        username: 'system@company.com',
        authenticated: true
      }
    },
    whatsapp: {
      provider: 'whatsapp-business',
      enabled: false,
      settings: {
        apiKey: '',
        webhookUrl: '',
        phoneNumber: ''
      }
    },
    calendar: {
      provider: 'google-calendar',
      enabled: true,
      settings: {
        calendarId: 'primary',
        syncTasks: true,
        createReminders: true
      }
    },
    crm: {
      provider: 'salesforce',
      enabled: false,
      settings: {
        apiUrl: '',
        apiKey: '',
        syncInterval: 'hourly'
      }
    }
  }
};

export const settingsService = {
  async getSettings() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simulate occasional errors
    if (Math.random() < 0.05) {
      throw new Error('Failed to fetch settings');
    }
    
    return { ...mockSettings };
  },

  async getSettingsSection(section) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!mockSettings[section]) {
      throw new Error('Settings section not found');
    }
    
    return { ...mockSettings[section] };
  },

  async updateSettings(section, newSettings) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (!mockSettings[section]) {
      throw new Error('Settings section not found');
    }
    
    mockSettings[section] = { ...mockSettings[section], ...newSettings };
    return { ...mockSettings[section] };
  },

  async resetSettings(section) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Reset to default values (simplified)
    const defaults = {
      general: {
        systemName: 'FlowSync CRM',
        timezone: 'UTC',
        autoAssignTasks: false,
        overdueNotifications: true
      },
      notifications: {
        email: { taskReminders: true, overdueAlerts: true, workflowUpdates: false, systemAlerts: true },
        inApp: { newCustomers: true, taskUpdates: true, workflowTriggers: false, systemMaintenance: false }
      },
      security: {
        sessionTimeout: 30,
        maxLoginAttempts: 3,
        requireTwoFactor: true,
        auditLogging: true
      }
    };
    
    if (defaults[section]) {
      mockSettings[section] = { ...defaults[section] };
      return { ...mockSettings[section] };
    }
    
    throw new Error('Cannot reset this section');
  },

  async testIntegration(provider, settings) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate integration test
    const testResults = {
      email: { success: true, message: 'Email server connection successful' },
      whatsapp: { success: false, message: 'Invalid API key' },
      calendar: { success: true, message: 'Calendar sync enabled' },
      crm: { success: false, message: 'Connection timeout' }
    };
    
    return testResults[provider] || { success: false, message: 'Unknown provider' };
  },

  async exportSettings() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      timestamp: new Date().toISOString(),
      version: '1.0',
      settings: { ...mockSettings }
    };
  },

  async importSettings(settingsData) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Validate settings structure (simplified)
    if (!settingsData.settings) {
      throw new Error('Invalid settings format');
    }
    
    // Merge with existing settings
    Object.keys(settingsData.settings).forEach(section => {
      if (mockSettings[section]) {
        mockSettings[section] = { ...mockSettings[section], ...settingsData.settings[section] };
      }
    });
    
    return { success: true, message: 'Settings imported successfully' };
  }
};