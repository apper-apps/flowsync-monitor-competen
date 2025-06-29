import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import WorkflowCard from '@/components/molecules/WorkflowCard';
import WorkflowBuilder from '@/components/organisms/WorkflowBuilder';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { workflowService } from '@/services/api/workflowService';
import { toast } from 'react-toastify';

const Workflows = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await workflowService.getAll();
      setWorkflows(data);
    } catch (err) {
      setError('Failed to load workflows. Please try again.');
      console.error('Workflows error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkflow = () => {
    setEditingWorkflow(null);
    setShowBuilder(true);
  };

  const handleEditWorkflow = (workflow) => {
    setEditingWorkflow(workflow);
    setShowBuilder(true);
  };

  const handleSaveWorkflow = async (workflowData) => {
    try {
      if (editingWorkflow) {
        const updated = await workflowService.update(editingWorkflow.Id, workflowData);
        setWorkflows(prev => prev.map(w => w.Id === editingWorkflow.Id ? updated : w));
        toast.success('Workflow updated successfully');
      } else {
        const created = await workflowService.create(workflowData);
        setWorkflows(prev => [...prev, created]);
        toast.success('Workflow created successfully');
      }
      setShowBuilder(false);
    } catch (error) {
      toast.error('Failed to save workflow');
      console.error('Save workflow error:', error);
    }
  };

  const handleDeleteWorkflow = async (workflowId) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await workflowService.delete(workflowId);
        setWorkflows(prev => prev.filter(w => w.Id !== workflowId));
        toast.success('Workflow deleted successfully');
      } catch (error) {
        toast.error('Failed to delete workflow');
        console.error('Delete workflow error:', error);
      }
    }
  };

  const handleToggleWorkflow = async (workflowId, isActive) => {
    try {
      const updated = await workflowService.toggle(workflowId, isActive);
      setWorkflows(prev => prev.map(w => w.Id === workflowId ? updated : w));
      toast.success(`Workflow ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update workflow status');
      console.error('Toggle workflow error:', error);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadWorkflows} />;

  if (showBuilder) {
    return (
      <WorkflowBuilder
        workflow={editingWorkflow}
        onSave={handleSaveWorkflow}
        onCancel={() => setShowBuilder(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Automation Workflows</h1>
          <p className="text-slate-600">Create and manage customer journey automation</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateWorkflow}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-lg font-medium hover:from-secondary-600 hover:to-secondary-700 transition-all duration-200 shadow-sm"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Create Workflow
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Workflows</p>
              <p className="text-2xl font-bold text-slate-900">{workflows.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="GitBranch" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active</p>
              <p className="text-2xl font-bold text-success-600">
                {workflows.filter(w => w.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Play" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Paused</p>
              <p className="text-2xl font-bold text-warning-600">
                {workflows.filter(w => !w.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Pause" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">This Month</p>
              <p className="text-2xl font-bold text-secondary-600">1,247</p>
              <p className="text-xs text-slate-500">Triggers</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Workflow List */}
      {workflows.length === 0 ? (
        <Empty
          icon="GitBranch"
          title="No workflows created yet"
          description="Start automating your customer journeys by creating your first workflow"
          actionLabel="Create Workflow"
          onAction={handleCreateWorkflow}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflows.map((workflow, index) => (
            <motion.div
              key={workflow.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <WorkflowCard
                workflow={workflow}
                onEdit={handleEditWorkflow}
                onDelete={handleDeleteWorkflow}
                onToggle={handleToggleWorkflow}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workflows;