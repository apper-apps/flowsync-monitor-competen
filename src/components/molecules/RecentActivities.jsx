import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow } from 'date-fns';

const RecentActivities = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      customer_added: 'UserPlus',
      task_completed: 'CheckCircle',
      workflow_triggered: 'GitBranch',
      call_made: 'Phone',
      email_sent: 'Mail',
      whatsapp_sent: 'MessageCircle'
    };
    return icons[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      customer_added: 'text-primary-600 bg-primary-100',
      task_completed: 'text-success-600 bg-success-100',
      workflow_triggered: 'text-secondary-600 bg-secondary-100',
      call_made: 'text-accent-600 bg-accent-100',
      email_sent: 'text-info-600 bg-info-100',
      whatsapp_sent: 'text-success-600 bg-success-100'
    };
    return colors[type] || 'text-slate-600 bg-slate-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200"
    >
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Recent Activities</h3>
        <p className="text-sm text-slate-600">Latest updates from your team</p>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Activity" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">No recent activities</h4>
            <p className="text-slate-600">Activities will appear here as your team works</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  <ApperIcon name={getActivityIcon(activity.type)} className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {activity.user} • {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentActivities;