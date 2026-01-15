import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ServiceRecord, Car, Service } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { formatDate, formatDateForInput, formatCurrency } from '../utils/formatters';
import { Pencil, Trash2 } from 'lucide-react';
export const ServiceRecordManagement = () => {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
  const [formData, setFormData] = useState({
    serviceDate: formatDateForInput(new Date().toISOString()),
    plateNumber: '',
    serviceCode: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fetchData = async () => {
    try {
      const [recordsRes, carsRes, servicesRes] = await Promise.all([api.get('/service-records'), api.get('/cars'), api.get('/services')]);
      setRecords(recordsRes.data);
      setCars(carsRes.data);
      setServices(servicesRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
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
      await api.post('/service-records', formData);
      setSuccess('Record added successfully');
      setFormData({
        serviceDate: formatDateForInput(new Date().toISOString()),
        plateNumber: '',
        serviceCode: ''
      });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add record');
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/service-records/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete record');
    }
  };
  const openEditModal = (record: ServiceRecord) => {
    setEditingRecord(record);
    setFormData({
      serviceDate: formatDateForInput(record.ServiceDate),
      plateNumber: record.PlateNumber,
      serviceCode: record.ServiceCode
    });
    setIsEditModalOpen(true);
  };
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    try {
      await api.put(`/service-records/${editingRecord.RecordNumber}`, formData);
      setIsEditModalOpen(false);
      setEditingRecord(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update record');
    }
  };
  const carOptions = cars.map(c => ({
    value: c.PlateNumber,
    label: `${c.PlateNumber} - ${c.Model}`
  }));
  const serviceOptions = services.map(s => ({
    value: s.ServiceCode,
    label: `${s.ServiceName} (${formatCurrency(s.ServicePrice)})`
  }));
  return <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Service Records (CRUD)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-semibold mb-4">New Service Record</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>}
            {success && <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
                {success}
              </div>}

            <Input label="Date" name="serviceDate" type="date" value={formData.serviceDate} onChange={handleChange} required />

            <Select label="Car" name="plateNumber" value={formData.plateNumber} onChange={handleChange} options={carOptions} required />

            <Select label="Service" name="serviceCode" value={formData.serviceCode} onChange={handleChange} options={serviceOptions} required />

            <Button type="submit" className="w-full" isLoading={submitting}>
              Add Record
            </Button>
          </form>
        </div>

        {/* Records Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Service History</h2>
            </div>
            <Table headers={['Date', 'Car', 'Service', 'Price', 'Actions']}>
              {records.map(record => <TableRow key={record.RecordNumber}>
                  <TableCell>{formatDate(record.ServiceDate)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{record.PlateNumber}</div>
                    <div className="text-xs text-gray-500">{record.Model}</div>
                  </TableCell>
                  <TableCell>{record.ServiceName}</TableCell>
                  <TableCell>
                    {formatCurrency(record.ServicePrice || 0)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button onClick={() => openEditModal(record)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(record.RecordNumber)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </Table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Service Record">
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input label="Date" name="serviceDate" type="date" value={formData.serviceDate} onChange={handleChange} required />
          <Select label="Car" name="plateNumber" value={formData.plateNumber} onChange={handleChange} options={carOptions} required />
          <Select label="Service" name="serviceCode" value={formData.serviceCode} onChange={handleChange} options={serviceOptions} required />
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
};