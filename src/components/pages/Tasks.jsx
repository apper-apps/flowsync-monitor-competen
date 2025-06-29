import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import TaskCard from '@/components/molecules/TaskCard';
import TaskModal from '@/components/molecules/TaskModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { taskService } from '@/services/api/taskService';
import { toast } from 'react-toastify';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, statusFilter, typeFilter]);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(task => task.type === typeFilter);
    }

    // Sort by priority: overdue first, then pending, then completed
    filtered.sort((a, b) => {
      const statusOrder = { overdue: 0, pending: 1, completed: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    setFilteredTasks(filtered);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCompleteTask = async (taskId, notes = '') => {
    try {
      const completed = await taskService.complete(taskId, notes);
      setTasks(prev => prev.map(t => t.Id === taskId ? completed : t));
      toast.success('Task completed successfully');
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to complete task');
      console.error('Complete task error:', error);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'completed', label: 'Completed' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'call', label: 'Phone Calls' },
    { value: 'email', label: 'Emails' },
    { value: 'whatsapp', label: 'WhatsApp' }
  ];

  const getTaskCounts = () => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      overdue: tasks.filter(t => t.status === 'overdue').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };
  };

  const counts = getTaskCounts();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-600">Manage your customer follow-up activities</p>
        </div>
        
        {/* Task Summary Stats */}
        <div className="mt-4 sm:mt-0 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
            <span className="text-slate-600">{counts.pending} Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error-500 rounded-full"></div>
            <span className="text-slate-600">{counts.overdue} Overdue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-500 rounded-full"></div>
            <span className="text-slate-600">{counts.completed} Completed</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tasks by customer name or description..."
            className="lg:max-w-md"
          />
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-700">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-700">Type:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          description={searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
            ? "No tasks match your current filters"
            : "No tasks available at the moment"
          }
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setTypeFilter('all');
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TaskCard
                task={task}
                onClick={() => handleTaskClick(task)}
                onComplete={(notes) => handleCompleteTask(task.Id, notes)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      {showModal && selectedTask && (
        <TaskModal
          task={selectedTask}
          onComplete={(notes) => handleCompleteTask(selectedTask.Id, notes)}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Tasks;