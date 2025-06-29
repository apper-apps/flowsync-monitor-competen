import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import NotificationDropdown from '@/components/molecules/NotificationDropdown';
import RoleSwitcher from '@/components/molecules/RoleSwitcher';
import { useAuth } from '@/hooks/useAuth';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md hover:bg-slate-100 transition-colors"
            >
              <ApperIcon name="Menu" className="w-5 h-5 text-slate-600" />
            </button>
            
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-slate-900">
                Welcome back, {user?.name?.split(' ')[0]}
              </h2>
              <p className="text-sm text-slate-500">
                Here's what's happening with your team today
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <RoleSwitcher />
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ApperIcon name="Bell" className="w-5 h-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"></span>
              </button>
              
              <NotificationDropdown 
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            </div>

            {/* User avatar */}
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;