import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const TaskSummaryCard = ({ tasks }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-warning-100 text-warning-700 border-warning-200',
      completed: 'bg-success-100 text-success-700 border-success-200',
      overdue: 'bg-error-100 text-error-700 border-error-200'
    };
    return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getTaskIcon = (type) => {
    const icons = {
      call: 'Phone',
      email: 'Mail',
      whatsapp: 'MessageCircle'
    };
    return icons[type] || 'CheckSquare';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200"
    >
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Today's Tasks</h3>
            <p className="text-sm text-slate-600">Stay on top of your customer interactions</p>
          </div>
          <Link
            to="/tasks"
            className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <span className="text-sm font-medium">View All</span>
            <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>

      <div className="p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="CheckCircle" className="w-12 h-12 text-success-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">All caught up!</h4>
            <p className="text-slate-600">No pending tasks for today. Great work!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name={getTaskIcon(task.type)} className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {task.customerName}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{task.description}</p>
                  <p className="text-xs text-slate-400">Due: {task.dueTime}</p>
                </div>

                <div className="flex items-center space-x-2">
                  {task.status === 'pending' && (
                    <>
                      <button className="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors">
                        <ApperIcon name="Phone" className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <ApperIcon name="CheckSquare" className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskSummaryCard;