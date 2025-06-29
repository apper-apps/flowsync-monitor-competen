import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = 'Something went wrong', 
  onRetry, 
  retryLabel = 'Try Again',
  icon = 'AlertCircle',
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-center p-8 ${className}`}
    >
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="w-8 h-8 text-error-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-slate-600 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            {retryLabel}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Error;