import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, ClipboardList, Calendar, Car, Wrench } from 'lucide-react';
import { getRecords, createRecord, updateRecord, deleteRecord } from '../api/records';
import { getCars } from '../api/cars';
import { getServices } from '../api/services';
import { ServiceRecord, Car as CarType, Service } from '../types';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { useToast } from '../components/Toast';
export function ServiceRecords() {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [cars, setCars] = useState<CarType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Partial<ServiceRecord>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    showToast
  } = useToast();
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [recordsData, carsData, servicesData] = await Promise.all([getRecords(), getCars(), getServices()]);
      setRecords(recordsData);
      setCars(carsData);
      setServices(servicesData);
    } catch (err) {
      console.error('Failed to fetch data', err);
      setError('Failed to load records. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleOpenModal = (record?: ServiceRecord) => {
    if (cars.length === 0 || services.length === 0) {
      showToast('You need to add cars and services before creating a record.', 'warning');
      return;
    }
    if (record) {
      const carId = typeof record.car === 'object' ? record.car._id : record.car;
      const serviceId = typeof record.service === 'object' ? record.service._id : record.service;
      setCurrentRecord({
        ...record,
        car: carId,
        service: serviceId,
        date: record.date.split('T')[0]
      });
    } else {
      setCurrentRecord({
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        cost: 0
      });
    }
    setIsModalOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentRecord._id) {
        await updateRecord(currentRecord._id, currentRecord);
        showToast('Record updated successfully', 'success');
      } else {
        await createRecord(currentRecord as Omit<ServiceRecord, '_id'>);
        showToast('Record created successfully', 'success');
      }
      const recordsData = await getRecords();
      setRecords(recordsData);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save record', err);
      showToast('Failed to save record. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord(id);
        showToast('Record deleted successfully', 'success');
        const recordsData = await getRecords();
        setRecords(recordsData);
      } catch (err) {
        console.error('Failed to delete record', err);
        showToast('Failed to delete record. Please try again.', 'error');
      }
    }
  };
  const getCarLabel = (car: CarType | string) => {
    if (typeof car === 'string') {
      const found = cars.find(c => c._id === car);
      return found ? `${found.make} ${found.model} (${found.licensePlate})` : 'Unknown Car';
    }
    return `${car.make} ${car.model} (${car.licensePlate})`;
  };
  const getServiceLabel = (service: Service | string) => {
    if (typeof service === 'string') {
      const found = services.find(s => s._id === service);
      return found ? found.name : 'Unknown Service';
    }
    return service.name;
  };
  const filteredRecords = records.filter(record => {
    const carLabel = getCarLabel(record.car).toLowerCase();
    const serviceLabel = getServiceLabel(record.service).toLowerCase();
    const search = searchTerm.toLowerCase();
    return carLabel.includes(search) || serviceLabel.includes(search);
  });
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
            Service Records
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track maintenance history and status.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </Button>
      </div>

      <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input type="text" placeholder="Search by car or service..." className="flex-1 outline-none text-sm bg-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
        </div> : filteredRecords.length === 0 ? <EmptyState icon={ClipboardList} title={searchTerm ? 'No records found' : 'No service records yet'} description={searchTerm ? `No records match "${searchTerm}"` : 'Create a record to track a service for a car.'} action={!searchTerm ? {
      label: 'Add Record',
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
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map(record => <tr key={record._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Car className="w-4 h-4 mr-2 text-gray-400" />
                        <div className="text-sm font-medium text-gray-900">
                          {getCarLabel(record.car)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Wrench className="w-4 h-4 mr-2 text-gray-400" />
                        <div className="text-sm text-gray-500">
                          {getServiceLabel(record.service)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full border ${getStatusColor(record.status)}`}>
                        {record.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${record.cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(record)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Record">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(record._id)} className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Record">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentRecord._id ? 'Edit Record' : 'Add New Record'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Car
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white" value={currentRecord.car as string || ''} onChange={e => setCurrentRecord({
            ...currentRecord,
            car: e.target.value
          })} required>
              <option value="">Select a car</option>
              {cars.map(car => <option key={car._id} value={car._id}>
                  {car.make} {car.model} ({car.licensePlate})
                </option>)}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white" value={currentRecord.service as string || ''} onChange={e => {
            const serviceId = e.target.value;
            const service = services.find(s => s._id === serviceId);
            setCurrentRecord({
              ...currentRecord,
              service: serviceId,
              cost: service ? service.basePrice : currentRecord.cost
            });
          }} required>
              <option value="">Select a service</option>
              {services.map(service => <option key={service._id} value={service._id}>
                  {service.name} (${service.basePrice})
                </option>)}
            </select>
          </div>

          <Input label="Date" type="date" value={currentRecord.date || ''} onChange={e => setCurrentRecord({
          ...currentRecord,
          date: e.target.value
        })} required />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white" value={currentRecord.status || 'pending'} onChange={e => setCurrentRecord({
            ...currentRecord,
            status: e.target.value as any
          })}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <Input label="Cost ($)" type="number" step="0.01" min="0" value={currentRecord.cost || ''} onChange={e => setCurrentRecord({
          ...currentRecord,
          cost: parseFloat(e.target.value)
        })} required />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" rows={3} value={currentRecord.notes || ''} onChange={e => setCurrentRecord({
            ...currentRecord,
            notes: e.target.value
          })} placeholder="Any additional notes..." />
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {currentRecord._id ? 'Update Record' : 'Create Record'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
}