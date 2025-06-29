import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';

const PerformanceChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState('7d');

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#2563eb', '#7c3aed', '#f59e0b'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    grid: {
      strokeDashArray: 3,
      borderColor: '#e2e8f0'
    },
    xaxis: {
      categories: data.map(d => d.date) || [],
      labels: {
        style: { colors: '#64748b', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b', fontSize: '12px' }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#64748b' }
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'light'
    }
  };

  const chartSeries = [
    {
      name: 'Tasks Completed',
      data: data.map(d => d.tasksCompleted) || []
    },
    {
      name: 'Customers Added',
      data: data.map(d => d.customersAdded) || []
    },
    {
      name: 'Workflows Triggered',
      data: data.map(d => d.workflowsTriggered) || []
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200"
    >
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Performance Overview</h3>
            <p className="text-sm text-slate-600">Track your team's key metrics</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  timeRange === range.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {data.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="BarChart3" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">No performance data</h4>
            <p className="text-slate-600">Performance metrics will appear as your team uses the system</p>
          </div>
        ) : (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={350}
          />
        )}
      </div>
    </motion.div>
  );
};

export default PerformanceChart;