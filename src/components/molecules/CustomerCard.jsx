import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow } from 'date-fns';

const CustomerCard = ({ customer, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    const colors = {
      active: 'text-success-700 bg-success-100 border-success-200',
      completed: 'text-primary-700 bg-primary-100 border-primary-200',
      paused: 'text-slate-700 bg-slate-100 border-slate-200'
    };
    return colors[status] || colors.active;
  };

  return (
    <motion.div
      whileHover={{ y: -2, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{customer.name}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(customer.status)}`}>
              {customer.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <ApperIcon name="Mail" className="w-4 h-4" />
          <span className="truncate">{customer.email}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <ApperIcon name="MessageCircle" className="w-4 h-4" />
          <span>{customer.whatsapp}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <ApperIcon name="MapPin" className="w-4 h-4" />
          <span>{customer.branch}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <ApperIcon name="Package" className="w-4 h-4" />
          <span>{customer.package}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500">
          Added {formatDistanceToNow(new Date(customer.createdAt), { addSuffix: true })}
        </div>
        
        <div className="flex items-center space-x-2">
          <Link
            to={`/customers/${customer.Id}`}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="View Details"
          >
            <ApperIcon name="Eye" className="w-4 h-4" />
          </Link>
          
          <button
            onClick={() => onEdit(customer)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            title="Edit Customer"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(customer.Id)}
            className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
            title="Delete Customer"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerCard;