import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Car as CarIcon } from 'lucide-react';
import { getCars, createCar, updateCar, deleteCar } from '../api/cars';
import { Car } from '../types';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { useToast } from '../components/Toast';
export function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState<Partial<Car>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    showToast
  } = useToast();
  const fetchCars = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCars();
      setCars(data);
    } catch (error: any) {
      console.error('Failed to fetch cars', error);
      setError(error.response?.data?.message || 'Failed to load cars. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCars();
  }, []);
  const handleOpenModal = (car?: Car) => {
    setCurrentCar(car || {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      owner: ''
    });
    setIsModalOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentCar._id) {
        await updateCar(currentCar._id, currentCar);
        showToast('Car updated successfully', 'success');
      } else {
        await createCar(currentCar as Omit<Car, '_id'>);
        showToast('Car added successfully', 'success');
      }
      await fetchCars();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Failed to save car', error);
      showToast(error.response?.data?.message || 'Failed to save car. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      try {
        await deleteCar(id);
        showToast('Car deleted successfully', 'success');
        await fetchCars();
      } catch (error: any) {
        console.error('Failed to delete car', error);
        showToast(error.response?.data?.message || 'Failed to delete car. Please try again.', 'error');
      }
    }
  };
  const filteredCars = cars.filter(car => car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) || car.owner.toLowerCase().includes(searchTerm.toLowerCase()) || car.make.toLowerCase().includes(searchTerm.toLowerCase()) || car.model.toLowerCase().includes(searchTerm.toLowerCase()));
  if (isLoading) {
    return <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="bg-white rounded-lg shadow p-6 h-64 animate-pulse"></div>
      </div>;
  }
  if (error) {
    return <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Cars Management</h1>
        <ErrorMessage message={error} onRetry={fetchCars} />
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cars</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your vehicle inventory
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Car
        </Button>
      </div>

      {cars.length > 0 && <div className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input type="text" placeholder="Search by license plate, owner, make, or model..." className="flex-1 outline-none text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>}

      <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
        {cars.length === 0 ? <EmptyState icon={CarIcon} title="No cars yet" description="Get started by adding your first vehicle to the system. You can track service records and payments for each car." actionLabel="Add Your First Car" onAction={() => handleOpenModal()} /> : filteredCars.length === 0 ? <EmptyState icon={Search} title="No results found" description={`No cars match "${searchTerm}". Try adjusting your search.`} /> : <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License Plate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCars.map(car => <tr key={car._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {car.make} {car.model}
                      </div>
                      <div className="text-sm text-gray-500">{car.year}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-blue-100 text-blue-800">
                        {car.licensePlate}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {car.owner}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleOpenModal(car)} className="text-blue-600 hover:text-blue-900 mr-4 transition-colors" title="Edit car">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(car._id)} className="text-red-600 hover:text-red-900 transition-colors" title="Delete car">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentCar._id ? 'Edit Car' : 'Add New Car'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Make" value={currentCar.make || ''} onChange={e => setCurrentCar({
          ...currentCar,
          make: e.target.value
        })} placeholder="e.g., Toyota" required />
          <Input label="Model" value={currentCar.model || ''} onChange={e => setCurrentCar({
          ...currentCar,
          model: e.target.value
        })} placeholder="e.g., Camry" required />
          <Input label="Year" type="number" min="1900" max={new Date().getFullYear() + 1} value={currentCar.year || ''} onChange={e => setCurrentCar({
          ...currentCar,
          year: parseInt(e.target.value)
        })} required />
          <Input label="License Plate" value={currentCar.licensePlate || ''} onChange={e => setCurrentCar({
          ...currentCar,
          licensePlate: e.target.value.toUpperCase()
        })} placeholder="e.g., ABC-1234" required />
          <Input label="Owner Name" value={currentCar.owner || ''} onChange={e => setCurrentCar({
          ...currentCar,
          owner: e.target.value
        })} placeholder="e.g., John Doe" required />
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {currentCar._id ? 'Update Car' : 'Add Car'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
}