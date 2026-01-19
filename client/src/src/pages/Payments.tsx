import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, CreditCard, DollarSign, Calendar } from 'lucide-react';
import { getPayments, createPayment, updatePayment, deletePayment } from '../api/payments';
import { getRecords } from '../api/records';
import { Payment, ServiceRecord } from '../types';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { useToast } from '../components/Toast';
export function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Partial<Payment>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    showToast
  } = useToast();
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [paymentsData, recordsData] = await Promise.all([getPayments(), getRecords()]);
      setPayments(paymentsData);
      setRecords(recordsData);
    } catch (err) {
      console.error('Failed to fetch data', err);
      setError('Failed to load payments. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleOpenModal = (payment?: Payment) => {
    if (records.length === 0) {
      showToast('You need to create service records before adding payments.', 'warning');
      return;
    }
    if (payment) {
      const recordId = typeof payment.record === 'object' ? payment.record._id : payment.record;
      setCurrentPayment({
        ...payment,
        record: recordId,
        date: payment.date.split('T')[0]
      });
    } else {
      setCurrentPayment({
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        method: 'cash'
      });
    }
    setIsModalOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentPayment._id) {
        await updatePayment(currentPayment._id, currentPayment);
        showToast('Payment updated successfully', 'success');
      } else {
        await createPayment(currentPayment as Omit<Payment, '_id'>);
        showToast('Payment recorded successfully', 'success');
      }
      const paymentsData = await getPayments();
      setPayments(paymentsData);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save payment', err);
      showToast('Failed to save payment. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await deletePayment(id);
        showToast('Payment deleted successfully', 'success');
        const paymentsData = await getPayments();
        setPayments(paymentsData);
      } catch (err) {
        console.error('Failed to delete payment', err);
        showToast('Failed to delete payment. Please try again.', 'error');
      }
    }
  };
  const getRecordLabel = (record: ServiceRecord | string) => {
    if (typeof record === 'string') {
      const found = records.find(r => r._id === record);
      if (found) {
        return `Record #${record.substring(0, 6)}...`;
      }
      return `Record #${record.substring(0, 6)}...`;
    }
    return `${new Date(record.date).toLocaleDateString()} - $${record.cost}`;
  };
  const filteredPayments = payments.filter(payment => payment.method.toLowerCase().includes(searchTerm.toLowerCase()) || payment.status.toLowerCase().includes(searchTerm.toLowerCase()));
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Payments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage transactions and payment status.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Payment
        </Button>
      </div>

      <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input type="text" placeholder="Search by method or status..." className="flex-1 outline-none text-sm bg-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {isLoading ? <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>)}
          </div>
        </div> : filteredPayments.length === 0 ? <EmptyState icon={CreditCard} title={searchTerm ? 'No payments found' : 'No payments recorded'} description={searchTerm ? `No payments match "${searchTerm}"` : 'Record your first payment for a service.'} action={!searchTerm ? {
      label: 'Add Payment',
      onClick: () => handleOpenModal()
    } : undefined} /> : <div className="bg-white shadow-sm overflow-hidden rounded-xl border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map(payment => <tr key={payment._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRecordLabel(payment.record)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      <div className="flex items-center">
                        {payment.method === 'cash' ? <DollarSign className="w-4 h-4 mr-2 text-green-500" /> : <CreditCard className="w-4 h-4 mr-2 text-blue-500" />}
                        {payment.method.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full border ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(payment)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Payment">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(payment._id)} className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Payment">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentPayment._id ? 'Edit Payment' : 'Add New Payment'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Record
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white" value={currentPayment.record as string || ''} onChange={e => {
            const recordId = e.target.value;
            const record = records.find(r => r._id === recordId);
            setCurrentPayment({
              ...currentPayment,
              record: recordId,
              amount: record ? record.cost : currentPayment.amount
            });
          }} required>
              <option value="">Select a record</option>
              {records.map(record => <option key={record._id} value={record._id}>
                  {new Date(record.date).toLocaleDateString()} - ${record.cost}{' '}
                  ({record.status})
                </option>)}
            </select>
          </div>

          <Input label="Date" type="date" value={currentPayment.date || ''} onChange={e => setCurrentPayment({
          ...currentPayment,
          date: e.target.value
        })} required />

          <Input label="Amount ($)" type="number" step="0.01" min="0" value={currentPayment.amount || ''} onChange={e => setCurrentPayment({
          ...currentPayment,
          amount: parseFloat(e.target.value)
        })} required />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white" value={currentPayment.method || 'cash'} onChange={e => setCurrentPayment({
            ...currentPayment,
            method: e.target.value as any
          })}>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white" value={currentPayment.status || 'pending'} onChange={e => setCurrentPayment({
            ...currentPayment,
            status: e.target.value as any
          })}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {currentPayment._id ? 'Update Payment' : 'Create Payment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
}