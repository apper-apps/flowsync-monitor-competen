import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';

const RoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { value: 'superadmin', label: 'Super Admin', icon: 'Shield', description: 'Full system access' },
    { value: 'staff', label: 'Staff Member', icon: 'User', description: 'Task management access' }
  ];

  const currentRole = roles.find(role => role.value === user?.role);

  const handleRoleSwitch = (newRole) => {
    if (newRole !== user?.role) {
      switchRole(newRole);
      setIsOpen(false);
      toast.success(`Switched to ${roles.find(r => r.value === newRole)?.label} view`);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
      >
        <ApperIcon name={currentRole?.icon} className="w-4 h-4 text-slate-600" />
        <span className="text-sm font-medium text-slate-700 hidden sm:block">
          {currentRole?.label}
        </span>
        <ApperIcon name="ChevronDown" className="w-4 h-4 text-slate-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-20"
            >
              <div className="p-2">
                <div className="px-3 py-2 mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Switch Role
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Demo different user perspectives
                  </p>
                </div>
                
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => handleRoleSwitch(role.value)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      role.value === user?.role
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <ApperIcon name={role.icon} className="w-4 h-4" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{role.label}</p>
                      <p className="text-xs text-slate-500">{role.description}</p>
                    </div>
                    {role.value === user?.role && (
                      <ApperIcon name="Check" className="w-4 h-4 text-primary-600" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleSwitcher;