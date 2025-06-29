import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SettingsSection from '@/components/molecules/SettingsSection';
import { toast } from 'react-toastify';

const BranchSettings = ({ branches, onUpdate }) => {
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    isActive: true
  });

  const handleAddBranch = () => {
    setEditingBranch(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      manager: '',
      isActive: true
    });
    setShowAddBranch(true);
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      manager: branch.manager,
      isActive: branch.isActive
    });
    setShowAddBranch(true);
  };

  const handleSaveBranch = () => {
    if (!formData.name || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newBranch = {
      ...formData,
      Id: editingBranch ? editingBranch.Id : Math.max(0, ...branches.map(b => b.Id)) + 1,
      createdAt: editingBranch ? editingBranch.createdAt : new Date().toISOString()
    };

    const updatedBranches = editingBranch
      ? branches.map(b => b.Id === editingBranch.Id ? newBranch : b)
      : [...branches, newBranch];

    onUpdate(updatedBranches);
    setShowAddBranch(false);
    toast.success(editingBranch ? 'Branch updated successfully' : 'Branch added successfully');
  };

  const handleDeleteBranch = (branchId) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      const updatedBranches = branches.filter(b => b.Id !== branchId);
      onUpdate(updatedBranches);
      toast.success('Branch deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Branch Management"
        description="Manage your business locations and branch settings"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-slate-600">
              {branches.length} total branches • {branches.filter(b => b.isActive).length} active
            </p>
          </div>
          
          <button
            onClick={handleAddBranch}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Branch
          </button>
        </div>

        {/* Branch List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <motion.div
              key={branch.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-slate-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="MapPin" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{branch.name}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      branch.isActive 
                        ? 'bg-success-100 text-success-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditBranch(branch)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit Branch"
                  >
                    <ApperIcon name="Edit2" className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteBranch(branch.Id)}
                    className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                    title="Delete Branch"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="MapPin" className="w-4 h-4" />
                  <span>{branch.address}</span>
                </div>
                
                {branch.phone && (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Phone" className="w-4 h-4" />
                    <span>{branch.phone}</span>
                  </div>
                )}
                
                {branch.email && (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Mail" className="w-4 h-4" />
                    <span>{branch.email}</span>
                  </div>
                )}
                
                {branch.manager && (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="User" className="w-4 h-4" />
                    <span>Manager: {branch.manager}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </SettingsSection>

      {/* Add/Edit Branch Modal */}
      {showAddBranch && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setShowAddBranch(false)}
            />
            
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingBranch ? 'Edit Branch' : 'Add New Branch'}
                </h3>
                <button
                  onClick={() => setShowAddBranch(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter branch name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="branch@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Branch Manager
                  </label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Manager name"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Active Branch</span>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isActive ? 'bg-primary-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t border-slate-200">
                <button
                  onClick={() => setShowAddBranch(false)}
                  className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBranch}
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                >
                  {editingBranch ? 'Update Branch' : 'Add Branch'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchSettings;