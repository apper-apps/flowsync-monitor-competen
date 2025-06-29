import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { reportService } from '@/services/api/reportService';

const Reports = () => {
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedBranch, setSelectedBranch] = useState('all');

  useEffect(() => {
    loadReports();
  }, [selectedPeriod, selectedBranch]);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await reportService.getReports(selectedPeriod, selectedBranch);
      setReportData(data);
    } catch (err) {
      setError('Failed to load reports. Please try again.');
      console.error('Reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  const periods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const branches = [
    { value: 'all', label: 'All Branches' },
    { value: 'main', label: 'Main Branch' },
    { value: 'downtown', label: 'Downtown Branch' },
    { value: 'north', label: 'North Branch' },
    { value: 'south', label: 'South Branch' }
  ];

  // Chart configurations
  const performanceChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#2563eb', '#7c3aed', '#f59e0b'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1
      }
    },
    grid: { strokeDashArray: 3, borderColor: '#e2e8f0' },
    xaxis: {
      categories: reportData.performanceChart?.dates || [],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: { labels: { style: { colors: '#64748b' } } },
    legend: { position: 'top', labels: { colors: '#64748b' } }
  };

  const performanceChartSeries = [
    {
      name: 'Tasks Completed',
      data: reportData.performanceChart?.tasksCompleted || []
    },
    {
      name: 'Customers Added',
      data: reportData.performanceChart?.customersAdded || []
    },
    {
      name: 'Workflows Triggered',
      data: reportData.performanceChart?.workflowsTriggered || []
    }
  ];

  const staffPerformanceOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#10b981'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true
      }
    },
    dataLabels: { enabled: false },
    grid: { borderColor: '#e2e8f0' },
    xaxis: {
      categories: reportData.staffPerformance?.names || [],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: { labels: { style: { colors: '#64748b' } } }
  };

  const staffPerformanceSeries = [{
    name: 'Tasks Completed',
    data: reportData.staffPerformance?.completedTasks || []
  }];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadReports} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-600">Monitor performance and track key metrics</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {branches.map(branch => (
              <option key={branch.value} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Customers</p>
              <p className="text-3xl font-bold text-slate-900">{reportData.totalCustomers || 0}</p>
              <p className="text-sm text-success-600 flex items-center mt-1">
                <ApperIcon name="TrendingUp" className="w-4 h-4 mr-1" />
                +{reportData.customerGrowth || 0}% vs last month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tasks Completed</p>
              <p className="text-3xl font-bold text-slate-900">{reportData.tasksCompleted || 0}</p>
              <p className="text-sm text-success-600 flex items-center mt-1">
                <ApperIcon name="TrendingUp" className="w-4 h-4 mr-1" />
                +{reportData.taskGrowth || 0}% completion rate
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Workflows</p>
              <p className="text-3xl font-bold text-slate-900">{reportData.activeWorkflows || 0}</p>
              <p className="text-sm text-warning-600 flex items-center mt-1">
                <ApperIcon name="GitBranch" className="w-4 h-4 mr-1" />
                {reportData.workflowEfficiency || 0}% efficiency
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="GitBranch" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Revenue Impact</p>
              <p className="text-3xl font-bold text-slate-900">${reportData.revenueImpact || 0}</p>
              <p className="text-sm text-success-600 flex items-center mt-1">
                <ApperIcon name="DollarSign" className="w-4 h-4 mr-1" />
                +{reportData.revenueGrowth || 0}% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Performance Trends</h3>
          <Chart
            options={performanceChartOptions}
            series={performanceChartSeries}
            type="area"
            height={350}
          />
        </motion.div>

        {/* Staff Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Staff Performance</h3>
          <Chart
            options={staffPerformanceOptions}
            series={staffPerformanceSeries}
            type="bar"
            height={350}
          />
        </motion.div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Staff */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {(reportData.topStaff || []).map((staff, index) => (
              <div key={staff.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{staff.name}</p>
                    <p className="text-sm text-slate-600">{staff.branch}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{staff.tasksCompleted}</p>
                  <p className="text-sm text-slate-600">tasks</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Package Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Popular Packages</h3>
          <div className="space-y-4">
            {(reportData.packageStats || []).map((pkg) => (
              <div key={pkg.name} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-900">{pkg.name}</span>
                  <span className="text-sm text-slate-600">{pkg.customers} customers</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                    style={{ width: `${pkg.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Milestones</h3>
          <div className="space-y-4">
            {(reportData.milestones || []).map((milestone) => (
              <div key={milestone.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  milestone.type === 'achievement' ? 'bg-success-100 text-success-600' :
                  milestone.type === 'warning' ? 'bg-warning-100 text-warning-600' :
                  'bg-primary-100 text-primary-600'
                }`}>
                  <ApperIcon 
                    name={milestone.type === 'achievement' ? 'Trophy' : 
                          milestone.type === 'warning' ? 'AlertTriangle' : 'Info'} 
                    className="w-4 h-4" 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{milestone.title}</p>
                  <p className="text-xs text-slate-600">{milestone.description}</p>
                  <p className="text-xs text-slate-400">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;