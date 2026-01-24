import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Car as CarIcon } from 'lucide-react';
import { getCars, createCar, updateCar, deleteCar } from '../api/cars';
import { Car } from '../types';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
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
  const [hoveredCar, setHoveredCar] = useState<Car | null>(null);

  const { showToast } = useToast();

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
    setCurrentCar(
      car || {
        plateNumber: '',
        type: '',
        model: '',
        year: new Date().getFullYear(),
        driverPhone: '',
        mechanicName: '',
        image: ''
      }
    );
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

  const filteredCars = cars.filter(
    car =>
      car.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.type && car.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (car.model && car.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (car.mechanicName && car.mechanicName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Cars Management
        </h1>
        <ErrorMessage message={error} onRetry={fetchCars} />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Cars
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your vehicle inventory
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Car
        </Button>
      </div>

      {/* Search */}
      {cars.length > 0 && (
        <div className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by plate number, type, model, or mechanic..."
            className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        {cars.length === 0 ? (
          <EmptyState
            icon={CarIcon}
            title="No cars yet"
            description="Get started by adding your first vehicle to the system. You can track service records and payments for each car."
            actionLabel="Add Your First Car"
            onAction={() => handleOpenModal()}
          />
        ) : filteredCars.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No results found"
            description={`No cars match "${searchTerm}". Try adjusting your search.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Plate Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Vehicle Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Driver Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Mechanic
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCars.map(car => (
                  <tr
                    key={car._id}
                    onMouseEnter={() => setHoveredCar(car)}
                    onMouseLeave={() => setHoveredCar(null)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                        {car.plateNumber}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {car.type} {car.model}
                      </div>
                      {car.year && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {car.year}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {car.driverPhone || '-'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {car.mechanicName || '-'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(car)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4 transition-colors p-2"
                        title="Edit car"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2"
                        title="Delete car"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Hover Card */}
      {hoveredCar && (
        <div className="absolute right-6 top-32 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 z-50 transition-all duration-200">
          {hoveredCar.image ? (
            <img
              src={hoveredCar.image}
              alt="Car preview"
              className="w-full h-40 object-cover rounded-lg mb-3"
              onError={e => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://via.placeholder.com/400x250?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 text-gray-400">
              No image
            </div>
          )}

          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {hoveredCar.type} {hoveredCar.model}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Plate: {hoveredCar.plateNumber}
            </div>
            {hoveredCar.year && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Year: {hoveredCar.year}
              </div>
            )}
            {hoveredCar.driverPhone && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Driver: {hoveredCar.driverPhone}
              </div>
            )}
            {hoveredCar.mechanicName && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Mechanic: {hoveredCar.mechanicName}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCar._id ? 'Edit Car' : 'Add New Car'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Plate Number"
            value={currentCar.plateNumber || ''}
            onChange={e =>
              setCurrentCar({
                ...currentCar,
                plateNumber: e.target.value.toUpperCase()
              })
            }
            placeholder="e.g., ABC-1234"
            required
          />

          <Input
            label="Type"
            value={currentCar.type || ''}
            onChange={e =>
              setCurrentCar({
                ...currentCar,
                type: e.target.value
              })
            }
            placeholder="e.g., Sedan, SUV, Truck"
          />

          <Input
            label="Model"
            value={currentCar.model || ''}
            onChange={e =>
              setCurrentCar({
                ...currentCar,
                model: e.target.value
              })
            }
            placeholder="e.g., Toyota Camry"
          />

          <Input
            label="Year"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            value={currentCar.year || ''}
            onChange={e =>
              setCurrentCar({
                ...currentCar,
                year: parseInt(e.target.value)
              })
            }
          />

          <Input
            label="Driver Phone"
            type="tel"
            value={currentCar.driverPhone || ''}
            onChange={e =>
              setCurrentCar({
                ...currentCar,
                driverPhone: e.target.value
              })
            }
            placeholder="e.g., +1234567890"
          />

          <Input
            label="Mechanic Name"
            value={currentCar.mechanicName || ''}
            onChange={e =>
              setCurrentCar({
                ...currentCar,
                mechanicName: e.target.value
              })
            }
            placeholder="e.g., John Doe"
          />

          <Input
            label="Image URL"
            value={currentCar.image || ''}
            onChange={e =>
              setCurrentCar({
                ...currentCar,
                image: e.target.value
              })
            }
            placeholder="https://example.com/car.jpg"
          />

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {currentCar._id ? 'Update Car' : 'Add Car'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
