import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import TaskCard from '@/components/molecules/TaskCard';
import { customerService } from '@/services/api/customerService';
import { taskService } from '@/services/api/taskService';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      loadCustomerData();
    }
  }, [id]);

  const loadCustomerData = async () => {
    setLoading(true);
    setError('');
    try {
      const [customerData, customerTasks] = await Promise.all([
        customerService.getById(id),
        taskService.getByCustomerId(id)
      ]);
      setCustomer(customerData);
      setTasks(customerTasks);
    } catch (err) {
      setError('Failed to load customer data. Please try again.');
      console.error('Customer profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId, notes = '') => {
    try {
      const completed = await taskService.complete(taskId, notes);
      setTasks(prev => prev.map(t => t.Id === taskId ? completed : t));
      toast.success('Task completed successfully');
    } catch (error) {
      toast.error('Failed to complete task');
      console.error('Complete task error:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-success-100 text-success-800',
      completed: 'bg-slate-100 text-slate-800',
      paused: 'bg-warning-100 text-warning-800'
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'User' },
    { id: 'tasks', name: 'Tasks', icon: 'CheckSquare' },
    { id: 'history', name: 'History', icon: 'Clock' }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCustomerData} />;
  if (!customer) return <Error message="Customer not found" onRetry={() => navigate('/customers')} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/customers"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
            <p className="text-slate-600">Customer Profile</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.status)}`}>
            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
          </span>
          <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
            <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
            Edit Customer
          </button>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{customer.name}</h3>
              <p className="text-slate-600 text-sm">Customer since {new Date(customer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Mail" className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">{customer.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <ApperIcon name="MessageCircle" className="w-4 h-4 text-green-500" />
              <span className="text-slate-700">{customer.whatsapp}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <ApperIcon name="MapPin" className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">{customer.branch}</span>
            </div>
            <div className="flex items-center space-x-3">
              <ApperIcon name="Calendar" className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">Last contacted {formatDistanceToNow(new Date(customer.lastContacted), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.name}</span>
                {tab.id === 'tasks' && tasks.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {tasks.filter(t => t.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Customer Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Full Name</label>
                      <p className="text-slate-900">{customer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Email Address</label>
                      <p className="text-slate-900">{customer.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">WhatsApp Number</label>
                      <p className="text-slate-900">{customer.whatsapp}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Branch</label>
                      <p className="text-slate-900">{customer.branch}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Activity Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <ApperIcon name="CheckSquare" className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="font-medium text-slate-900">Total Tasks</span>
                      </div>
                      <span className="text-xl font-bold text-slate-900">{tasks.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Check" className="w-4 h-4 text-success-600" />
                        </div>
                        <span className="font-medium text-slate-900">Completed</span>
                      </div>
                      <span className="text-xl font-bold text-slate-900">
                        {tasks.filter(t => t.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Clock" className="w-4 h-4 text-warning-600" />
                        </div>
                        <span className="font-medium text-slate-900">Pending</span>
                      </div>
                      <span className="text-xl font-bold text-slate-900">
                        {tasks.filter(t => t.status === 'pending').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Customer Tasks</h3>
                <button className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Add Task
                </button>
              </div>
              
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="CheckSquare" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No tasks yet</h3>
                  <p className="text-slate-600">Create your first task for this customer</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.Id}
                      task={task}
                      onComplete={(notes) => handleCompleteTask(task.Id, notes)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Activity History</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Customer created</p>
                    <p className="text-sm text-slate-600">Customer profile was created in the system</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDistanceToNow(new Date(customer.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                
                {tasks.filter(t => t.status === 'completed').map((task) => (
                  <div key={task.Id} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="Check" className="w-4 h-4 text-success-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Task completed: {task.description}</p>
                      <p className="text-sm text-slate-600">{task.type} task was marked as completed</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;