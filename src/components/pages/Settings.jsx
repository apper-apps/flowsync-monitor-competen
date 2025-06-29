import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SettingsSection from '@/components/molecules/SettingsSection';
import UserManagement from '@/components/organisms/UserManagement';
import BranchSettings from '@/components/organisms/BranchSettings';
import IntegrationSettings from '@/components/organisms/IntegrationSettings';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { settingsService } from '@/services/api/settingsService';
import { toast } from 'react-toastify';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      setError('Failed to load settings. Please try again.');
      console.error('Settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (section, newSettings) => {
    try {
      const updated = await settingsService.updateSettings(section, newSettings);
      setSettings(prev => ({ ...prev, [section]: updated }));
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Update settings error:', error);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: 'Settings' },
    { id: 'users', name: 'User Management', icon: 'Users' },
    { id: 'branches', name: 'Branches', icon: 'MapPin' },
    { id: 'integrations', name: 'Integrations', icon: 'Zap' },
    { id: 'notifications', name: 'Notifications', icon: 'Bell' },
    { id: 'security', name: 'Security', icon: 'Shield' }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSettings} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-600">Configure your CRM system preferences and integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'general' && (
              <div className="space-y-6">
                <SettingsSection
                  title="System Configuration"
                  description="Basic system settings and preferences"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        System Name
                      </label>
                      <input
                        type="text"
                        value={settings.general?.systemName || 'FlowSync CRM'}
                        onChange={(e) => handleUpdateSettings('general', { 
                          ...settings.general, 
                          systemName: e.target.value 
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Default Time Zone
                      </label>
                      <select
                        value={settings.general?.timezone || 'UTC'}
                        onChange={(e) => handleUpdateSettings('general', { 
                          ...settings.general, 
                          timezone: e.target.value 
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="GMT">Greenwich Mean Time</option>
                      </select>
                    </div>
                  </div>
                </SettingsSection>

                <SettingsSection
                  title="Task Settings"
                  description="Configure default task and reminder settings"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Auto-assign Tasks</p>
                        <p className="text-sm text-slate-600">Automatically assign tasks to staff members</p>
                      </div>
                      <button
                        onClick={() => handleUpdateSettings('general', { 
                          ...settings.general, 
                          autoAssignTasks: !settings.general?.autoAssignTasks 
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.general?.autoAssignTasks ? 'bg-primary-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.general?.autoAssignTasks ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Overdue Notifications</p>
                        <p className="text-sm text-slate-600">Send notifications for overdue tasks</p>
                      </div>
                      <button
                        onClick={() => handleUpdateSettings('general', { 
                          ...settings.general, 
                          overdueNotifications: !settings.general?.overdueNotifications 
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.general?.overdueNotifications ? 'bg-primary-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.general?.overdueNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </SettingsSection>
              </div>
            )}

            {activeTab === 'users' && (
              <UserManagement 
                users={settings.users || []}
                onUpdate={(users) => handleUpdateSettings('users', users)}
              />
            )}

            {activeTab === 'branches' && (
              <BranchSettings 
                branches={settings.branches || []}
                onUpdate={(branches) => handleUpdateSettings('branches', branches)}
              />
            )}

            {activeTab === 'integrations' && (
              <IntegrationSettings 
                integrations={settings.integrations || {}}
                onUpdate={(integrations) => handleUpdateSettings('integrations', integrations)}
              />
            )}

            {activeTab === 'notifications' && (
              <SettingsSection
                title="Notification Settings"
                description="Configure system notifications and alerts"
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900">Email Notifications</h4>
                      {[
                        { key: 'taskReminders', label: 'Task Reminders' },
                        { key: 'overdueAlerts', label: 'Overdue Alerts' },
                        { key: 'workflowUpdates', label: 'Workflow Updates' },
                        { key: 'systemAlerts', label: 'System Alerts' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">{item.label}</span>
                          <button
                            onClick={() => handleUpdateSettings('notifications', { 
                              ...settings.notifications, 
                              email: {
                                ...settings.notifications?.email,
                                [item.key]: !settings.notifications?.email?.[item.key]
                              }
                            })}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              settings.notifications?.email?.[item.key] ? 'bg-primary-600' : 'bg-slate-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                settings.notifications?.email?.[item.key] ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900">In-App Notifications</h4>
                      {[
                        { key: 'newCustomers', label: 'New Customers' },
                        { key: 'taskUpdates', label: 'Task Updates' },
                        { key: 'workflowTriggers', label: 'Workflow Triggers' },
                        { key: 'systemMaintenance', label: 'System Maintenance' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">{item.label}</span>
                          <button
                            onClick={() => handleUpdateSettings('notifications', { 
                              ...settings.notifications, 
                              inApp: {
                                ...settings.notifications?.inApp,
                                [item.key]: !settings.notifications?.inApp?.[item.key]
                              }
                            })}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              settings.notifications?.inApp?.[item.key] ? 'bg-primary-600' : 'bg-slate-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                settings.notifications?.inApp?.[item.key] ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SettingsSection>
            )}

            {activeTab === 'security' && (
              <SettingsSection
                title="Security Settings"
                description="Manage security and access control settings"
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.security?.sessionTimeout || 60}
                        onChange={(e) => handleUpdateSettings('security', { 
                          ...settings.security, 
                          sessionTimeout: parseInt(e.target.value) 
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        min="5"
                        max="480"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Failed Login Attempts
                      </label>
                      <input
                        type="number"
                        value={settings.security?.maxLoginAttempts || 5}
                        onChange={(e) => handleUpdateSettings('security', { 
                          ...settings.security, 
                          maxLoginAttempts: parseInt(e.target.value) 
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        min="3"
                        max="10"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-600">Require 2FA for admin accounts</p>
                      </div>
                      <button
                        onClick={() => handleUpdateSettings('security', { 
                          ...settings.security, 
                          requireTwoFactor: !settings.security?.requireTwoFactor 
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.security?.requireTwoFactor ? 'bg-primary-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.security?.requireTwoFactor ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Audit Logging</p>
                        <p className="text-sm text-slate-600">Log all user actions for security audits</p>
                      </div>
                      <button
                        onClick={() => handleUpdateSettings('security', { 
                          ...settings.security, 
                          auditLogging: !settings.security?.auditLogging 
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.security?.auditLogging ? 'bg-primary-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.security?.auditLogging ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </SettingsSection>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;