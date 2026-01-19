import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, CreditCard, DollarSign, Calendar } from 'lucide-react';
import { getPayments, createPayment, updatePayment, deletePayment } from '../api/payments';
import { getRecords } from '../api/records';
import { Payment, ServiceRecord, Car as CarType } from '../types';
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
  const { showToast } = useToast();

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
        paymentDate: payment.paymentDate.split('T')[0],
      });
    } else {
      setCurrentPayment({
        paymentDate: new Date().toISOString().split('T')[0],
        amountPaid: 0,
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
    if (!window.confirm('Are you sure you want to delete this payment?')) return;

    try {
      await deletePayment(id);
      showToast('Payment deleted successfully', 'success');
      const paymentsData = await getPayments();
      setPayments(paymentsData);
    } catch (err) {
      console.error('Failed to delete payment', err);
      showToast('Failed to delete payment. Please try again.', 'error');
    }
  };

  // Safely get a label for the record
  const getRecordLabel = (record: ServiceRecord | string) => {
    if (typeof record === 'string') {
      return `Record #${record.substring(0, 8)}`;
    }

    const date = record.serviceDate ? new Date(record.serviceDate).toLocaleDateString() : 'Unknown Date';
    const carPlate = typeof record.car === 'object' ? record.car.plateNumber : 'Unknown Car';
    return `${date} - ${carPlate}`;
  };

  const filteredPayments = payments.filter(payment => {
    const search = searchTerm.toLowerCase();
    const recordLabel = getRecordLabel(payment.record).toLowerCase();
    return recordLabel.includes(search) || payment.amountPaid.toString().includes(search);
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-64 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Payments</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage transactions and payment records.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Payment
        </Button>
      </div>

      {payments.length > 0 && (
        <div className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by record or amount..."
            className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="Record your first payment for a service to start tracking revenue."
          actionLabel="Add Payment"
          onAction={() => handleOpenModal()}
        />
      ) : filteredPayments.length === 0 ? (
        <EmptyState icon={Search} title="No payments found" description={`No payments match "${searchTerm}"`} />
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Record
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount Paid
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayments.map(payment => (
                  <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                        {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'Unknown Date'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {getRecordLabel(payment.record)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${payment.amountPaid?.toFixed(2) ?? '0.00'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleOpenModal(payment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                          title="Edit Payment"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(payment._id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md transition-colors"
                          title="Delete Payment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPayment._id ? 'Edit Payment' : 'Add New Payment'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service Record
            </label>
            <select
              className="block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm min-h-[44px] sm:min-h-[38px]
              bg-white dark:bg-gray-800 
              border-gray-300 dark:border-gray-600 
              text-gray-900 dark:text-white"
              value={currentPayment.record as string || ''}
              onChange={e =>
                setCurrentPayment({ ...currentPayment, record: e.target.value })
              }
              required
            >
              <option value="">Select a record</option>
              {records.map(record => (
                <option key={record._id} value={record._id}>
                  {record.serviceDate ? new Date(record.serviceDate).toLocaleDateString() : 'Unknown Date'} -{' '}
                  {typeof record.car === 'object' ? record.car.plateNumber : 'Unknown Car'}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Payment Date"
            type="date"
            value={currentPayment.paymentDate || ''}
            onChange={e => setCurrentPayment({ ...currentPayment, paymentDate: e.target.value })}
            required
          />

          <Input
            label="Amount Paid ($)"
            type="number"
            step="0.01"
            min="0"
            value={currentPayment.amountPaid ?? ''}
            onChange={e => setCurrentPayment({ ...currentPayment, amountPaid: parseFloat(e.target.value) })}
            required
          />

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {currentPayment._id ? 'Update Payment' : 'Create Payment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
