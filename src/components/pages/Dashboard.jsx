import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import PerformanceChart from "@/components/molecules/PerformanceChart";
import KPICard from "@/components/molecules/KPICard";
import QuickActions from "@/components/molecules/QuickActions";
import RecentActivities from "@/components/molecules/RecentActivities";
import TaskSummaryCard from "@/components/molecules/TaskSummaryCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService } from "@/services/api/dashboardService";
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();

  const loadDashboardData = async (attempt = 1) => {
    try {
      setLoading(true);
      if (attempt === 1) {
        setError(null);
      }
      
      const data = await dashboardService.getDashboardData(user?.role || 'staff');
      
      // Validate received data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid dashboard data received');
      }
      
      setData(data);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const errorMessage = err.message || 'Failed to load dashboard data';
      console.error(`Dashboard error (attempt ${attempt}):`, err);
      
      // Auto-retry up to 3 times with exponential backoff
      if (attempt < 3) {
        console.log(`Retrying dashboard load in ${attempt * 1000}ms...`);
        setTimeout(() => {
          loadDashboardData(attempt + 1);
        }, attempt * 1000);
setRetryCount(attempt);
      } else {
        setError(errorMessage);
        setRetryCount(0);
      }
    } catch (err) {
      console.error('Catch block error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      // Always clear loading state after final attempt or on success
      if (attempt >= 3 || data !== null) {
        setLoading(false);
      }
    }

  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    loadDashboardData();
  };

  useEffect(() => {
    loadDashboardData();
  }, [user?.role]);

  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

if (loading) {
    return (
      <Loading 
        message={retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'Loading dashboard...'}
      />
    );
  }
  
  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={handleRetry}
        showRetry={true}
      />
    );
  }
  
  if (!data) {
    return (
      <Error 
        message="No dashboard data available" 
        onRetry={handleRetry}
        showRetry={true}
      />
    );
}

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-primary-100 text-lg">
                {isAdmin 
                  ? "Monitor your team's performance and optimize workflows"
                  : "Stay on top of your tasks and customer interactions"
                }
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ApperIcon name="Zap" className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Customers"
          value={data.activeCustomers || 0}
          change={+12}
          icon="Users"
          color="primary"
        />
<KPICard
          title="Pending Tasks"
          value={data.pendingTasks || 0}
          change={-8}
          icon="CheckSquare"
          color="warning"
        />
<KPICard
          title="Completion Rate"
          value={`${data.completionRate || 0}%`}
          change={+5}
          icon="TrendingUp"
          color="success"
        />
<KPICard
          title="Active Workflows"
          value={data.activeWorkflows || 0}
          change={+2}
          icon="GitBranch"
          color="secondary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <TaskSummaryCard tasks={data.taskSummary || []} />
          {isAdmin && <PerformanceChart data={data.performanceData || []} />}
        </div>

{/* Right Column */}
        <div className="space-y-6">
          <QuickActions />
          <RecentActivities activities={data.recentActivities || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;