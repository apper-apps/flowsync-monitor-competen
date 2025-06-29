import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import KPICard from '@/components/molecules/KPICard';
import TaskSummaryCard from '@/components/molecules/TaskSummaryCard';
import RecentActivities from '@/components/molecules/RecentActivities';
import PerformanceChart from '@/components/molecules/PerformanceChart';
import QuickActions from '@/components/molecules/QuickActions';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { dashboardService } from '@/services/api/dashboardService';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [user?.role]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await dashboardService.getDashboardData(user?.role);
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-6">
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
          value={dashboardData.activeCustomers || 0}
          change={+12}
          icon="Users"
          color="primary"
        />
        <KPICard
          title="Pending Tasks"
          value={dashboardData.pendingTasks || 0}
          change={-8}
          icon="CheckSquare"
          color="warning"
        />
        <KPICard
          title="Completion Rate"
          value={`${dashboardData.completionRate || 0}%`}
          change={+5}
          icon="TrendingUp"
          color="success"
        />
        <KPICard
          title="Active Workflows"
          value={dashboardData.activeWorkflows || 0}
          change={+2}
          icon="GitBranch"
          color="secondary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <TaskSummaryCard tasks={dashboardData.taskSummary || []} />
          {isAdmin && <PerformanceChart data={dashboardData.performanceData || []} />}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions />
          <RecentActivities activities={dashboardData.recentActivities || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;