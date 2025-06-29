import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const WorkflowBuilder = ({ workflow, onSave, onCancel }) => {
  const [workflowData, setWorkflowData] = useState({
    name: '',
    description: '',
    packageName: '',
    steps: [],
    isActive: true
  });

  const [selectedStep, setSelectedStep] = useState(null);
  const [showStepModal, setShowStepModal] = useState(false);

  useEffect(() => {
    if (workflow) {
      setWorkflowData({
        name: workflow.name || '',
        description: workflow.description || '',
        packageName: workflow.packageName || '',
        steps: workflow.steps || [],
        isActive: workflow.isActive ?? true
      });
    }
  }, [workflow]);

  const stepTypes = [
    {
      type: 'delay',
      name: 'Wait/Delay',
      icon: 'Clock',
      description: 'Wait for a specified time before next step',
      color: 'from-slate-500 to-slate-600'
    },
    {
      type: 'email',
      name: 'Send Email',
      icon: 'Mail',
      description: 'Send automated email to customer',
      color: 'from-primary-500 to-primary-600'
    },
    {
      type: 'whatsapp',
      name: 'WhatsApp Message',
      icon: 'MessageCircle',
      description: 'Send WhatsApp message to customer',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      type: 'task',
      name: 'Create Task',
      icon: 'CheckSquare',
      description: 'Create follow-up task for staff',
      color: 'from-warning-500 to-warning-600'
    }
  ];

  const packages = [
    'Basic Package',
    'Premium Package',
    'Enterprise Package',
    'Custom Package'
  ];

  const addStep = (stepType) => {
    const newStep = {
      id: Date.now(),
      type: stepType.type,
      name: stepType.name,
      config: getDefaultConfig(stepType.type)
    };
    
    setWorkflowData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const getDefaultConfig = (type) => {
    switch (type) {
      case 'delay':
        return { duration: 1, unit: 'days' };
      case 'email':
        return { subject: '', template: '', variables: [] };
      case 'whatsapp':
        return { template: '', variables: [] };
      case 'task':
        return { title: '', description: '', assignTo: 'auto' };
      default:
        return {};
    }
  };

  const editStep = (stepIndex) => {
    setSelectedStep(stepIndex);
    setShowStepModal(true);
  };

  const updateStep = (stepIndex, updatedConfig) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) => 
        index === stepIndex ? { ...step, config: updatedConfig } : step
      )
    }));
    setShowStepModal(false);
  };

  const removeStep = (stepIndex) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, index) => index !== stepIndex)
    }));
  };

  const moveStep = (fromIndex, toIndex) => {
    const steps = [...workflowData.steps];
    const [movedStep] = steps.splice(fromIndex, 1);
    steps.splice(toIndex, 0, movedStep);
    
    setWorkflowData(prev => ({
      ...prev,
      steps
    }));
  };

  const handleSave = () => {
    if (!workflowData.name.trim()) {
      toast.error('Workflow name is required');
      return;
    }
    
    if (!workflowData.packageName) {
      toast.error('Package selection is required');
      return;
    }
    
    if (workflowData.steps.length === 0) {
      toast.error('At least one step is required');
      return;
    }
    
    onSave(workflowData);
  };

  const getStepIcon = (type) => {
    const stepType = stepTypes.find(s => s.type === type);
    return stepType?.icon || 'Circle';
  };

  const getStepColor = (type) => {
    const stepType = stepTypes.find(s => s.type === type);
    return stepType?.color || 'from-slate-500 to-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {workflow ? 'Edit Workflow' : 'Create New Workflow'}
            </h1>
            <p className="text-slate-600">Design your customer journey automation</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition-all duration-200"
          >
            {workflow ? 'Update Workflow' : 'Create Workflow'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Workflow Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Settings */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Workflow Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={workflowData.name}
                  onChange={(e) => setWorkflowData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  placeholder="Enter workflow name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={workflowData.description}
                  onChange={(e) => setWorkflowData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  placeholder="Describe this workflow"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Package
                </label>
                <select
                  value={workflowData.packageName}
                  onChange={(e) => setWorkflowData(prev => ({ ...prev, packageName: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                >
                  <option value="">Select package</option>
                  {packages.map(pkg => (
                    <option key={pkg} value={pkg}>{pkg}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Active</span>
                <button
                  onClick={() => setWorkflowData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    workflowData.isActive ? 'bg-secondary-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      workflowData.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Add Steps */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Steps</h3>
            
            <div className="space-y-3">
              {stepTypes.map((stepType) => (
                <button
                  key={stepType.type}
                  onClick={() => addStep(stepType)}
                  className="w-full flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
                >
                  <div className={`w-8 h-8 bg-gradient-to-br ${stepType.color} rounded-lg flex items-center justify-center`}>
                    <ApperIcon name={stepType.icon} className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{stepType.name}</p>
                    <p className="text-xs text-slate-500">{stepType.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workflow Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Workflow Steps ({workflowData.steps.length})
            </h3>
            
            {workflowData.steps.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="GitBranch" className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-900 mb-2">No steps added yet</h4>
                <p className="text-slate-600 mb-4">Start building your workflow by adding steps from the left panel</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Start Node */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="Play" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Customer Trigger</p>
                    <p className="text-sm text-slate-600">When customer signs up for {workflowData.packageName}</p>
                  </div>
                </div>
                
                {/* Workflow Steps */}
                {workflowData.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    {/* Connection Line */}
                    <div className="flex flex-col items-center">
                      <div className="w-px h-6 bg-slate-300"></div>
                      <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                      <div className="w-px h-6 bg-slate-300"></div>
                    </div>
                    
                    {/* Step Card */}
                    <motion.div
                      layout
                      className="flex-1 bg-slate-50 rounded-lg border border-slate-200 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${getStepColor(step.type)} rounded-lg flex items-center justify-center`}>
                            <ApperIcon name={getStepIcon(step.type)} className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{step.name}</p>
                            <p className="text-sm text-slate-600">Step {index + 1}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {index > 0 && (
                            <button
                              onClick={() => moveStep(index, index - 1)}
                              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <ApperIcon name="ArrowUp" className="w-4 h-4" />
                            </button>
                          )}
                          {index < workflowData.steps.length - 1 && (
                            <button
                              onClick={() => moveStep(index, index + 1)}
                              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <ApperIcon name="ArrowDown" className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => editStep(index)}
                            className="p-1 text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            <ApperIcon name="Edit2" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeStep(index)}
                            className="p-1 text-error-600 hover:text-error-700 transition-colors"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Step Config Preview */}
                      <div className="mt-3 text-sm text-slate-600">
                        {step.type === 'delay' && (
                          <p>Wait for {step.config.duration} {step.config.unit}</p>
                        )}
                        {step.type === 'email' && (
                          <p>Subject: {step.config.subject || 'Not configured'}</p>
                        )}
                        {step.type === 'whatsapp' && (
                          <p>Message template configured</p>
                        )}
                        {step.type === 'task' && (
                          <p>Task: {step.config.title || 'Not configured'}</p>
                        )}
                      </div>
                    </motion.div>
                  </div>
                ))}
                
                {/* End Node */}
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-6 bg-slate-300"></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Workflow Complete</p>
                    <p className="text-sm text-slate-600">Customer journey finished</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;