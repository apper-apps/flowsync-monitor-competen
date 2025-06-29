import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import Customers from '@/components/pages/Customers';
import CustomerProfile from '@/components/pages/CustomerProfile';
import Tasks from '@/components/pages/Tasks';
import Workflows from '@/components/pages/Workflows';
import Reports from '@/components/pages/Reports';
import Settings from '@/components/pages/Settings';
import { AuthProvider } from '@/hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerProfile />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="workflows" element={<Workflows />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ zIndex: 9999 }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;