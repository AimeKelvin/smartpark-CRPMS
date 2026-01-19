import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Wrench, AlertCircle } from 'lucide-react';
import { getServices, createService, updateService, deleteService } from '../api/services';
import { Service } from '../types';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { useToast } from '../components/Toast';
export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    showToast
  } = useToast();
  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services', err);
      setError('Failed to load services. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);
  const handleOpenModal = (service?: Service) => {
    setCurrentService(service || {
      name: '',
      description: '',
      basePrice: 0
    });
    setIsModalOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentService._id) {
        await updateService(currentService._id, currentService);
        showToast('Service updated successfully', 'success');
      } else {
        await createService(currentService as Omit<Service, '_id'>);
        showToast('Service created successfully', 'success');
      }
      await fetchServices();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save service', err);
      showToast('Failed to save service. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        showToast('Service deleted successfully', 'success');
        await fetchServices();
      } catch (err) {
        console.error('Failed to delete service', err);
        showToast('Failed to delete service. Please try again.', 'error');
      }
    }
  };
  const filteredServices = services.filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()) || service.description.toLowerCase().includes(searchTerm.toLowerCase()));
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchServices} />;
  }
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Services
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your service catalog and pricing.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input type="text" placeholder="Search services by name or description..." className="flex-1 outline-none text-sm bg-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
        </div> : filteredServices.length === 0 ? <EmptyState icon={Wrench} title={searchTerm ? 'No services found' : 'No services yet'} description={searchTerm ? `No services match "${searchTerm}"` : 'Create your first service to get started.'} action={!searchTerm ? {
      label: 'Add Service',
      onClick: () => handleOpenModal()
    } : undefined} /> : <div className="bg-white shadow-sm overflow-hidden rounded-xl border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map(service => <tr key={service._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          <Wrench className="h-4 w-4" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {service.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {service.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${service.basePrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(service)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Service">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(service._id)} className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Service">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentService._id ? 'Edit Service' : 'Add New Service'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Service Name" value={currentService.name || ''} onChange={e => setCurrentService({
          ...currentService,
          name: e.target.value
        })} required placeholder="e.g. Oil Change" />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow" rows={3} value={currentService.description || ''} onChange={e => setCurrentService({
            ...currentService,
            description: e.target.value
          })} placeholder="Describe what this service includes..." />
          </div>
          <Input label="Base Price ($)" type="number" step="0.01" min="0" value={currentService.basePrice || ''} onChange={e => setCurrentService({
          ...currentService,
          basePrice: parseFloat(e.target.value)
        })} required placeholder="0.00" />
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {currentService._id ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
}