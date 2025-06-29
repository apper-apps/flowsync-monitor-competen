import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const TaskModal = ({ task, onComplete, onClose }) => {
  const [notes, setNotes] = useState('');
  const [completing, setCompleting] = useState(false);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await onComplete(notes);
    } finally {
      setCompleting(false);
    }
  };

  const getTaskIcon = (type) => {
    const icons = {
      call: 'Phone',
      email: 'Mail',
      whatsapp: 'MessageCircle'
    };
    return icons[type] || 'CheckSquare';
  };

  const getTaskTypeColor = (type) => {
    const colors = {
      call: 'from-success-500 to-success-600',
      email: 'from-primary-500 to-primary-600',
      whatsapp: 'from-secondary-500 to-secondary-600'
    };
    return colors[type] || 'from-slate-500 to-slate-600';
  };

  const handleCall = () => {
    window.open(`tel:${task.customerPhone}`, '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi ${task.customerName}, this is a follow-up from our team.`);
    window.open(`https://wa.me/${task.customerPhone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Follow-up: ${task.description}`);
    const body = encodeURIComponent(`Dear ${task.customerName},\n\nThis is a follow-up regarding your inquiry.\n\nBest regards,\n${task.assignedTo}`);
    window.open(`mailto:${task.customerEmail}?subject=${subject}&body=${body}`, '_self');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${getTaskTypeColor(task.type)} rounded-lg flex items-center justify-center`}>
                  <ApperIcon name={getTaskIcon(task.type)} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{task.customerName}</h3>
                  <p className="text-sm text-slate-600">{task.type.charAt(0).toUpperCase() + task.type.slice(1)} Task</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Task Details */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Task Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Description:</span>
                    <span className="text-slate-900 font-medium">{task.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Due Date:</span>
                    <span className="text-slate-900 font-medium">
                      {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Assigned To:</span>
                    <span className="text-slate-900 font-medium">{task.assignedTo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' ? 'bg-success-100 text-success-700' :
                      task.status === 'overdue' ? 'bg-error-100 text-error-700' :
                      'bg-warning-100 text-warning-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {task.status !== 'completed' && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={handleCall}
                      className="flex items-center justify-center space-x-2 p-3 bg-success-50 text-success-700 rounded-lg hover:bg-success-100 transition-colors"
                    >
                      <ApperIcon name="Phone" className="w-5 h-5" />
                      <span>Call Now</span>
                    </button>
                    
                    <button
                      onClick={handleWhatsApp}
                      className="flex items-center justify-center space-x-2 p-3 bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors"
                    >
                      <ApperIcon name="MessageCircle" className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </button>
                    
                    <button
                      onClick={handleEmail}
                      className="flex items-center justify-center space-x-2 p-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <ApperIcon name="Mail" className="w-5 h-5" />
                      <span>Send Email</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Completion Notes */}
              {task.status !== 'completed' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Completion Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Add any notes about this task completion..."
                  />
                </div>
              )}

              {/* Previous Notes */}
              {task.notes && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">Previous Notes</h4>
                  <p className="text-sm text-slate-600">{task.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-slate-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              
              {task.status !== 'completed' && (
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="px-4 py-2 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-lg hover:from-success-600 hover:to-success-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {completing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Completing...</span>
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Check" className="w-4 h-4" />
                      <span>Mark Complete</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;