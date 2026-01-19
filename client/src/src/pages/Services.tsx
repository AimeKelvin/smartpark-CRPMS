import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Wrench } from 'lucide-react';
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
      code: '',
      name: '',
      price: 0
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
  const filteredServices = services.filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()) || service.code.toLowerCase().includes(searchTerm.toLowerCase()));
  if (isLoading) {
    return <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-64 animate-pulse"></div>
      </div>;
  }
  if (error) {
    return <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Services
        </h1>
        <ErrorMessage message={error} onRetry={fetchServices} />
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Services
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your service catalog and pricing.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {services.length > 0 && <div className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
          <input type="text" placeholder="Search services by name or code..." className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>}

      {services.length === 0 ? <EmptyState icon={Wrench} title="No services yet" description="Create your first service offering to start tracking repairs and maintenance." actionLabel="Add Service" onAction={() => handleOpenModal()} /> : filteredServices.length === 0 ? <EmptyState icon={Search} title="No services found" description={`No services match "${searchTerm}"`} /> : <div className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredServices.map(service => <tr key={service._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                        {service.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                          <Wrench className="h-4 w-4" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ${service.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleOpenModal(service)} className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors" title="Edit Service">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(service._id)} className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md transition-colors" title="Delete Service">
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
          <Input label="Service Code" value={currentService.code || ''} onChange={e => setCurrentService({
          ...currentService,
          code: e.target.value.toUpperCase()
        })} required placeholder="e.g. OC001" />
          <Input label="Service Name" value={currentService.name || ''} onChange={e => setCurrentService({
          ...currentService,
          name: e.target.value
        })} required placeholder="e.g. Oil Change" />
          <Input label="Price ($)" type="number" step="0.01" min="0" value={currentService.price || ''} onChange={e => setCurrentService({
          ...currentService,
          price: parseFloat(e.target.value)
        })} required placeholder="0.00" />
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
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