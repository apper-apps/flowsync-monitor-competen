import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SettingsSection from '@/components/molecules/SettingsSection';
import { toast } from 'react-toastify';

const UserManagement = ({ users, onUpdate }) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff',
    branch: '',
    whatsappNumber: '',
    isActive: true
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'staff',
      branch: '',
      whatsappNumber: '',
      isActive: true
    });
    setShowAddUser(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
      whatsappNumber: user.whatsappNumber,
      isActive: user.isActive
    });
    setShowAddUser(true);
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.email || !formData.branch) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newUser = {
      ...formData,
      Id: editingUser ? editingUser.Id : Math.max(0, ...users.map(u => u.Id)) + 1,
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString()
    };

    const updatedUsers = editingUser
      ? users.map(u => u.Id === editingUser.Id ? newUser : u)
      : [...users, newUser];

    onUpdate(updatedUsers);
    setShowAddUser(false);
    toast.success(editingUser ? 'User updated successfully' : 'User added successfully');
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.Id !== userId);
      onUpdate(updatedUsers);
      toast.success('User deleted successfully');
    }
  };

  const handleToggleUser = (userId, isActive) => {
    const updatedUsers = users.map(u => 
      u.Id === userId ? { ...u, isActive } : u
    );
    onUpdate(updatedUsers);
    toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
  };

  return (
    <div className="space-y-6">
      <SettingsSection
        title="User Management"
        description="Manage system users and their permissions"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-slate-600">
              {users.length} total users • {users.filter(u => u.isActive).length} active
            </p>
          </div>
          
          <button
            onClick={handleAddUser}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
          >
            <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>

        {/* User List */}
        <div className="space-y-4">
          {users.map((user) => (
            <motion.div
              key={user.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-slate-900">{user.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'superadmin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'superadmin' ? 'Super Admin' : 'Staff'}
                    </span>
                    {!user.isActive && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{user.email}</p>
                  <p className="text-xs text-slate-500">{user.branch} • {user.whatsappNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleUser(user.Id, !user.isActive)}
                  className={`p-2 rounded-lg transition-colors ${
                    user.isActive 
                      ? 'text-warning-600 hover:bg-warning-50' 
                      : 'text-success-600 hover:bg-success-50'
                  }`}
                  title={user.isActive ? 'Deactivate User' : 'Activate User'}
                >
                  <ApperIcon name={user.isActive ? 'UserX' : 'UserCheck'} className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleEditUser(user)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit User"
                >
                  <ApperIcon name="Edit2" className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDeleteUser(user.Id)}
                  className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                  title="Delete User"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </SettingsSection>

      {/* Add/Edit User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setShowAddUser(false)}
            />
            
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="staff">Staff Member</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Branch *
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select branch</option>
                    <option value="Main Branch">Main Branch</option>
                    <option value="Downtown Branch">Downtown Branch</option>
                    <option value="North Branch">North Branch</option>
                    <option value="South Branch">South Branch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+1234567890"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Active User</span>
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
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;