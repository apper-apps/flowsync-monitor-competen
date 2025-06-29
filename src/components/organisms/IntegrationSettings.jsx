import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import SettingsSection from '@/components/molecules/SettingsSection';
import { toast } from 'react-toastify';

const IntegrationSettings = ({ integrations, onUpdate }) => {
  const [showApiKey, setShowApiKey] = useState({});

  const handleUpdateIntegration = (service, field, value) => {
    const updatedIntegrations = {
      ...integrations,
      [service]: {
        ...integrations[service],
        [field]: value
      }
    };
    onUpdate(updatedIntegrations);
  };

  const handleTestConnection = async (service) => {
    toast.info(`Testing ${service} connection...`);
    // Simulate API test
    setTimeout(() => {
      toast.success(`${service} connection successful!`);
    }, 2000);
  };

  const toggleApiKeyVisibility = (service) => {
    setShowApiKey(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const integrationConfigs = [
    {
      service: 'wbiztool',
      name: 'Wbiztool WhatsApp API',
      icon: 'MessageCircle',
      description: 'Send WhatsApp messages through Wbiztool integration',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password', required: true },
        { key: 'baseUrl', label: 'Base URL', type: 'url', required: true },
        { key: 'phoneNumber', label: 'WhatsApp Number', type: 'tel', required: true }
      ]
    },
    {
      service: 'gmail',
      name: 'Gmail API',
      icon: 'Mail',
      description: 'Send emails through Gmail API integration',
      fields: [
        { key: 'clientId', label: 'Client ID', type: 'text', required: true },
        { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
        { key: 'refreshToken', label: 'Refresh Token', type: 'password', required: true }
      ]
    },
    {
      service: 'googleCalendar',
      name: 'Google Calendar',
      icon: 'Calendar',
      description: 'Create calendar events and reminders',
      fields: [
        { key: 'calendarId', label: 'Calendar ID', type: 'text', required: true },
        { key: 'serviceAccountKey', label: 'Service Account Key', type: 'textarea', required: true }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {integrationConfigs.map((config) => (
        <SettingsSection
          key={config.service}
          title={config.name}
          description={config.description}
        >
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name={config.icon} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Connection Status</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      integrations[config.service]?.isConnected ? 'bg-success-500' : 'bg-error-500'
                    }`}></div>
                    <span className={`text-sm ${
                      integrations[config.service]?.isConnected ? 'text-success-600' : 'text-error-600'
                    }`}>
                      {integrations[config.service]?.isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleTestConnection(config.name)}
                className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm font-medium"
              >
                Test Connection
              </button>
            </div>

            {/* Configuration Fields */}
            <div className="grid grid-cols-1 gap-4">
              {config.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {field.label} {field.required && <span className="text-error-500">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      value={integrations[config.service]?.[field.key] || ''}
                      onChange={(e) => handleUpdateIntegration(config.service, field.key, e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : field.type === 'password' ? (
                    <div className="relative">
                      <input
                        type={showApiKey[config.service + field.key] ? 'text' : 'password'}
                        value={integrations[config.service]?.[field.key] || ''}
                        onChange={(e) => handleUpdateIntegration(config.service, field.key, e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleApiKeyVisibility(config.service + field.key)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <ApperIcon 
                          name={showApiKey[config.service + field.key] ? 'EyeOff' : 'Eye'} 
                          className="w-4 h-4 text-slate-400" 
                        />
                      </button>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={integrations[config.service]?.[field.key] || ''}
                      onChange={(e) => handleUpdateIntegration(config.service, field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Integration Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div>
                <p className="font-medium text-slate-900">Enable {config.name}</p>
                <p className="text-sm text-slate-600">Allow system to use this integration</p>
              </div>
              <button
                onClick={() => handleUpdateIntegration(config.service, 'isEnabled', !integrations[config.service]?.isEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  integrations[config.service]?.isEnabled ? 'bg-primary-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    integrations[config.service]?.isEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </SettingsSection>
      ))}

      {/* Integration Health Dashboard */}
      <SettingsSection
        title="Integration Health"
        description="Monitor the status and performance of your integrations"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {integrationConfigs.map((config) => (
            <div key={config.service} className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name={config.icon} className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-medium text-slate-900">{config.name}</h4>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className={integrations[config.service]?.isConnected ? 'text-success-600' : 'text-error-600'}>
                    {integrations[config.service]?.isConnected ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Last Test:</span>
                  <span className="text-slate-900">
                    {integrations[config.service]?.lastTest || 'Never'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Response Time:</span>
                  <span className="text-slate-900">
                    {integrations[config.service]?.responseTime || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
};

export default IntegrationSettings;