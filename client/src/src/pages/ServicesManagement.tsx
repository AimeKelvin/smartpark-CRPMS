import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Service } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { formatCurrency } from '../utils/formatters';
export const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    serviceCode: '',
    serviceName: '',
    servicePrice: ''
  });
  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (err) {
      console.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await api.post('/services', formData);
      setSuccess('Service added successfully!');
      setFormData({
        serviceCode: '',
        serviceName: '',
        servicePrice: ''
      });
      fetchServices();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add service');
    } finally {
      setSubmitting(false);
    }
  };
  return <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-semibold mb-4">Add New Service</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>}
            {success && <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
                {success}
              </div>}

            <Input label="Service Code" name="serviceCode" value={formData.serviceCode} onChange={handleChange} placeholder="e.g. SVC007" required />

            <Input label="Service Name" name="serviceName" value={formData.serviceName} onChange={handleChange} placeholder="e.g. Brake Check" required />

            <Input label="Price (Rwf)" name="servicePrice" type="number" value={formData.servicePrice} onChange={handleChange} required />

            <Button type="submit" className="w-full" isLoading={submitting}>
              Add Service
            </Button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Available Services</h2>
            </div>
            <Table headers={['Code', 'Service Name', 'Price']}>
              {services.map(service => <TableRow key={service.ServiceCode}>
                  <TableCell className="font-mono text-xs">
                    {service.ServiceCode}
                  </TableCell>
                  <TableCell className="font-medium">
                    {service.ServiceName}
                  </TableCell>
                  <TableCell>{formatCurrency(service.ServicePrice)}</TableCell>
                </TableRow>)}
            </Table>
          </div>
        </div>
      </div>
    </div>;
};