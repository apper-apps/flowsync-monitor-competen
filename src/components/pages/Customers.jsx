import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import CustomerCard from '@/components/molecules/CustomerCard';
import CustomerModal from '@/components/molecules/CustomerModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { customerService } from '@/services/api/customerService';
import { toast } from 'react-toastify';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchQuery, statusFilter]);

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customers. Please try again.');
      console.error('Customers error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (searchQuery) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.whatsapp.includes(searchQuery)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        const updated = await customerService.update(editingCustomer.Id, customerData);
        setCustomers(prev => prev.map(c => c.Id === editingCustomer.Id ? updated : c));
        toast.success('Customer updated successfully');
      } else {
        const created = await customerService.create(customerData);
        setCustomers(prev => [...prev, created]);
        toast.success('Customer added successfully');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to save customer');
      console.error('Save customer error:', error);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.delete(customerId);
        setCustomers(prev => prev.filter(c => c.Id !== customerId));
        toast.success('Customer deleted successfully');
      } catch (error) {
        toast.error('Failed to delete customer');
        console.error('Delete customer error:', error);
      }
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Customers' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCustomers} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-600">Manage your customer database and interactions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddCustomer}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-sm"
        >
          <ApperIcon name="UserPlus" className="w-5 h-5 mr-2" />
          Add Customer
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search customers by name, email, or phone..."
            className="sm:max-w-md"
          />
          
          <div className="flex items-center space-x-4">
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
        </div>
      </div>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <Empty
          icon="Users"
          title="No customers found"
          description={searchQuery || statusFilter !== 'all' 
            ? "No customers match your current filters" 
            : "Start building your customer base by adding your first customer"
          }
          actionLabel="Add Customer"
          onAction={handleAddCustomer}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CustomerCard
                customer={customer}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Customer Modal */}
      {showModal && (
        <CustomerModal
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Customers;