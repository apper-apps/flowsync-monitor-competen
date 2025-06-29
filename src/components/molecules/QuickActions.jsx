import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { useAuth } from '@/hooks/useAuth';

const QuickActions = () => {
  const { isAdmin } = useAuth();

  const adminActions = [
    {
      title: 'Add Customer',
      description: 'Register new customer',
      icon: 'UserPlus',
      href: '/customers',
      color: 'from-primary-500 to-primary-600'
    },
    {
      title: 'Create Workflow',
      description: 'Build automation',
      icon: 'GitBranch',
      href: '/workflows',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      title: 'View Reports',
      description: 'Check performance',
      icon: 'BarChart3',
      href: '/reports',
      color: 'from-accent-500 to-accent-600'
    },
    {
      title: 'Manage Settings',
      description: 'System configuration',
      icon: 'Settings',
      href: '/settings',
      color: 'from-slate-500 to-slate-600'
    }
  ];

  const staffActions = [
    {
      title: 'View Tasks',
      description: 'Check pending tasks',
      icon: 'CheckSquare',
      href: '/tasks',
      color: 'from-primary-500 to-primary-600'
    },
    {
      title: 'Customer List',
      description: 'Browse customers',
      icon: 'Users',
      href: '/customers',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      title: 'Make Call',
      description: 'Quick phone call',
      icon: 'Phone',
      href: '#',
      color: 'from-success-500 to-success-600'
    },
    {
      title: 'Send Message',
      description: 'WhatsApp or Email',
      icon: 'MessageCircle',
      href: '#',
      color: 'from-accent-500 to-accent-600'
    }
  ];

  const actions = isAdmin ? adminActions : staffActions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200"
    >
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
        <p className="text-sm text-slate-600">Frequently used features</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={action.href}
                className="block p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <ApperIcon name={action.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 group-hover:text-primary-700 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-slate-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActions;