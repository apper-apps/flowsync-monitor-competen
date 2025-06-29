import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const CustomerModal = ({ customer, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    branch: '',
    assignedStaff: '',
    package: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        whatsapp: customer.whatsapp || '',
        branch: customer.branch || '',
        assignedStaff: customer.assignedStaff || '',
        package: customer.package || '',
        status: customer.status || 'active'
      });
    }
  }, [customer]);

  const branches = [
    'Main Branch',
    'Downtown Branch',
    'North Branch',
    'South Branch'
  ];

  const packages = [
    'Basic Package',
    'Premium Package',
    'Enterprise Package',
    'Custom Package'
  ];

  const staffMembers = [
    'John Smith',
    'Sarah Johnson',
    'Mike Wilson',
    'Emily Davis'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    }

    if (!formData.branch) {
      newErrors.branch = 'Branch is required';
    }

    if (!formData.package) {
      newErrors.package = 'Package is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {customer ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.name ? 'border-error-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter customer name"
                />
                {errors.name && (
                  <p className="text-sm text-error-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.email ? 'border-error-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-sm text-error-600 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.whatsapp ? 'border-error-500' : 'border-slate-300'
                  }`}
                  placeholder="+1234567890"
                />
                {errors.whatsapp && (
                  <p className="text-sm text-error-600 mt-1">{errors.whatsapp}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Branch
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) => handleChange('branch', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.branch ? 'border-error-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="text-sm text-error-600 mt-1">{errors.branch}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assigned Staff
                </label>
                <select
                  value={formData.assignedStaff}
                  onChange={(e) => handleChange('assignedStaff', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select staff member</option>
                  {staffMembers.map(staff => (
                    <option key={staff} value={staff}>{staff}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Package
                </label>
                <select
                  value={formData.package}
                  onChange={(e) => handleChange('package', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.package ? 'border-error-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select package</option>
                  {packages.map(pkg => (
                    <option key={pkg} value={pkg}>{pkg}</option>
                  ))}
                </select>
                {errors.package && (
                  <p className="text-sm text-error-600 mt-1">{errors.package}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                >
                  {customer ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default CustomerModal;