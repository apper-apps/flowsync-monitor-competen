import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('flowsync_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('flowsync_user');
      }
    } else {
      // For demo purposes, set a default user
      const defaultUser = {
        Id: 1,
        name: "John Smith",
        email: "john.smith@company.com",
        role: "superadmin",
        branch: "Main Branch",
        whatsappNumber: "+1234567890"
      };
      setUser(defaultUser);
      localStorage.setItem('flowsync_user', JSON.stringify(defaultUser));
    }
    setLoading(false);
  }, []);

  const switchRole = (role) => {
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    localStorage.setItem('flowsync_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    switchRole,
    isAdmin: user?.role === 'superadmin',
    isStaff: user?.role === 'staff'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};