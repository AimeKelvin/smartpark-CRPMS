import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Payment, Car } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { formatCurrency, formatDate, formatDateForInput } from '../utils/formatters';
export const PaymentManagement = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    amountPaid: '',
    paymentDate: formatDateForInput(new Date().toISOString()),
    plateNumber: ''
  });
  const fetchData = async () => {
    try {
      const [paymentsRes, carsRes] = await Promise.all([api.get('/payments'), api.get('/cars')]);
      setPayments(paymentsRes.data);
      setCars(carsRes.data);
    } catch (err) {
      console.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api.post('/payments', formData);
      setSuccess('Payment recorded successfully!');
      setFormData({
        amountPaid: '',
        paymentDate: formatDateForInput(new Date().toISOString()),
        plateNumber: ''
      });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };
  const carOptions = cars.map(c => ({
    value: c.PlateNumber,
    label: `${c.PlateNumber} - ${c.Model}`
  }));
  return <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-semibold mb-4">Record Payment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>}
            {success && <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
                {success}
              </div>}

            <Select label="Car" name="plateNumber" value={formData.plateNumber} onChange={handleChange} options={carOptions} required />

            <Input label="Amount Paid (Rwf)" name="amountPaid" type="number" value={formData.amountPaid} onChange={handleChange} required />

            <Input label="Payment Date" name="paymentDate" type="date" value={formData.paymentDate} onChange={handleChange} required />

            <Button type="submit" className="w-full" isLoading={submitting}>
              Record Payment
            </Button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Payment History</h2>
            </div>
            <Table headers={['Date', 'Car', 'Amount Paid', 'Driver Phone']}>
              {payments.map(payment => <TableRow key={payment.PaymentNumber}>
                  <TableCell>{formatDate(payment.PaymentDate)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{payment.PlateNumber}</div>
                    <div className="text-xs text-gray-500">{payment.Model}</div>
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    {formatCurrency(payment.AmountPaid)}
                  </TableCell>
                  <TableCell>{payment.DriverPhone}</TableCell>
                </TableRow>)}
            </Table>
          </div>
        </div>
      </div>
    </div>;
};