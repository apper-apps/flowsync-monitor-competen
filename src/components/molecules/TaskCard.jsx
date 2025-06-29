import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow, format } from 'date-fns';

const TaskCard = ({ task, onClick, onComplete }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-warning-700 bg-warning-100 border-warning-200',
      completed: 'text-success-700 bg-success-100 border-success-200',
      overdue: 'text-error-700 bg-error-100 border-error-200'
    };
    return colors[status] || colors.pending;
  };

  const getTaskIcon = (type) => {
    const icons = {
      call: 'Phone',
      email: 'Mail',
      whatsapp: 'MessageCircle'
    };
    return icons[type] || 'CheckSquare';
  };

  const getTaskTypeColor = (type) => {
    const colors = {
      call: 'text-success-600 bg-success-100',
      email: 'text-primary-600 bg-primary-100',
      whatsapp: 'text-secondary-600 bg-secondary-100'
    };
    return colors[type] || 'text-slate-600 bg-slate-100';
  };

  const getPriorityIndicator = (status, dueDate) => {
    if (status === 'overdue') {
      return { color: 'border-l-error-500', urgency: 'High Priority' };
    }
    
    const due = new Date(dueDate);
    const now = new Date();
    const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDue <= 2) {
      return { color: 'border-l-warning-500', urgency: 'Due Soon' };
    }
    
    return { color: 'border-l-slate-300', urgency: '' };
  };

  const priority = getPriorityIndicator(task.status, task.dueDate);

  const handleQuickComplete = (e) => {
    e.stopPropagation();
    onComplete('');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={`bg-white rounded-xl border-l-4 ${priority.color} border-r border-t border-b border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTaskTypeColor(task.type)}`}>
            <ApperIcon name={getTaskIcon(task.type)} className="w-6 h-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-slate-900">{task.customerName}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              {priority.urgency && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-700">
                  {priority.urgency}
                </span>
              )}
            </div>
            
            <p className="text-slate-600 mb-3">{task.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <ApperIcon name="User" className="w-4 h-4" />
                <span>{task.assignedTo}</span>
              </div>
            </div>
            
            {task.completedAt && (
              <div className="flex items-center space-x-1 text-sm text-success-600 mt-2">
                <ApperIcon name="CheckCircle" className="w-4 h-4" />
                <span>Completed {formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })}</span>
              </div>
            )}
          </div>
        </div>
        
        {task.status === 'pending' && (
          <div className="flex items-center space-x-2 ml-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                // Trigger call functionality
                window.open(`tel:${task.customerPhone}`, '_self');
              }}
              className="p-3 bg-success-100 text-success-700 rounded-lg hover:bg-success-200 transition-colors"
              title="Call Customer"
            >
              <ApperIcon name="Phone" className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickComplete}
              className="p-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
              title="Mark Complete"
            >
              <ApperIcon name="Check" className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;