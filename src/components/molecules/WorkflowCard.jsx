import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow } from 'date-fns';

const WorkflowCard = ({ workflow, onEdit, onDelete, onToggle }) => {
  const getStepIcon = (type) => {
    const icons = {
      delay: 'Clock',
      email: 'Mail',
      whatsapp: 'MessageCircle',
      call: 'Phone',
      task: 'CheckSquare'
    };
    return icons[type] || 'Circle';
  };

  const getStepColor = (type) => {
    const colors = {
      delay: 'text-slate-600',
      email: 'text-primary-600',
      whatsapp: 'text-secondary-600',
      call: 'text-success-600',
      task: 'text-warning-600'
    };
    return colors[type] || 'text-slate-600';
  };

  return (
    <motion.div
      whileHover={{ y: -2, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="GitBranch" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{workflow.name}</h3>
            <p className="text-sm text-slate-600">For {workflow.packageName} package</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${workflow.isActive ? 'bg-success-500' : 'bg-slate-400'}`}></div>
          <span className="text-sm font-medium text-slate-600">
            {workflow.isActive ? 'Active' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-600 mb-4">{workflow.description}</p>

      {/* Workflow Steps Preview */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-700 mb-2">Workflow Steps ({workflow.steps.length})</h4>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {workflow.steps.slice(0, 6).map((step, index) => (
            <div key={index} className="flex items-center space-x-2 flex-shrink-0">
              <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center ${getStepColor(step.type)}`}>
                <ApperIcon name={getStepIcon(step.type)} className="w-4 h-4" />
              </div>
              {index < Math.min(workflow.steps.length - 1, 5) && (
                <ApperIcon name="ArrowRight" className="w-3 h-3 text-slate-400" />
              )}
            </div>
          ))}
          {workflow.steps.length > 6 && (
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <span>+{workflow.steps.length - 6} more</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-slate-200">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900">{workflow.triggerCount || 0}</p>
          <p className="text-xs text-slate-500">Triggered</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900">{workflow.completionRate || 0}%</p>
          <p className="text-xs text-slate-500">Completion</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900">{workflow.averageTime || '0d'}</p>
          <p className="text-xs text-slate-500">Avg Time</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500">
          Updated {formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggle(workflow.Id, !workflow.isActive)}
            className={`p-2 rounded-lg transition-colors ${
              workflow.isActive 
                ? 'text-warning-600 hover:bg-warning-50' 
                : 'text-success-600 hover:bg-success-50'
            }`}
            title={workflow.isActive ? 'Pause Workflow' : 'Activate Workflow'}
          >
            <ApperIcon name={workflow.isActive ? 'Pause' : 'Play'} className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onEdit(workflow)}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit Workflow"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(workflow.Id)}
            className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
            title="Delete Workflow"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkflowCard;