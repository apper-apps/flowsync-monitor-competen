import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { useAuth } from '@/hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Customers', href: '/customers', icon: 'Users' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Workflows', href: '/workflows', icon: 'GitBranch', adminOnly: true },
    { name: 'Reports', href: '/reports', icon: 'BarChart3', adminOnly: true },
    { name: 'Settings', href: '/settings', icon: 'Settings', adminOnly: true },
  ];

  const filteredNavigation = navigationItems.filter(item => 
    !item.adminOnly || isAdmin
  );

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
        }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 lg:translate-x-0 lg:static lg:inset-0"
      >
        <div className="flex h-full flex-col">
          {/* Logo and header */}
          <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  FlowSync
                </h1>
                <p className="text-xs text-slate-500">CRM System</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-slate-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.role === 'superadmin' ? 'Super Admin' : 'Staff Member'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.branch}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-4 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border-l-4 border-primary-500'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <ApperIcon
                    name={item.icon}
                    className={`mr-3 h-5 w-5 transition-colors ${
                      isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              © 2024 FlowSync CRM
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;