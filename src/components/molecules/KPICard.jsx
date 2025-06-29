import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const KPICard = ({ title, value, change, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600 text-primary-600',
    secondary: 'from-secondary-500 to-secondary-600 text-secondary-600',
    success: 'from-success-500 to-success-600 text-success-600',
    warning: 'from-warning-500 to-warning-600 text-warning-600',
    error: 'from-error-500 to-error-600 text-error-600',
  };

  const isPositive = change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
          
          <div className="flex items-center space-x-1">
            <ApperIcon 
              name={isPositive ? 'TrendingUp' : 'TrendingDown'} 
              className={`w-4 h-4 ${isPositive ? 'text-success-600' : 'text-error-600'}`} 
            />
            <span className={`text-sm font-medium ${isPositive ? 'text-success-600' : 'text-error-600'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-slate-500">vs last week</span>
          </div>
        </div>

        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;