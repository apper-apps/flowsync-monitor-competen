import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ 
  size = 'default', 
  message = 'Loading...', 
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} border-2 border-slate-200 border-t-primary-500 rounded-full mx-auto mb-4`}
        />
        
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <p className="text-slate-600 font-medium">{message}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;