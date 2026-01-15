import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Car } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { validatePlateNumber, validatePhone, validateYear } from '../utils/validation';
export const CarManagement = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Form State
  const [formData, setFormData] = useState({
    plateNumber: '',
    type: '',
    model: '',
    manufacturingYear: new Date().getFullYear(),
    driverPhone: '',
    mechanicName: ''
  });
  const fetchCars = async () => {
    try {
      const response = await api.get('/cars');
      setCars(response.data);
    } catch (err) {
      console.error('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCars();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    // Validation
    if (!validatePlateNumber(formData.plateNumber)) {
      setError('Invalid Plate Number format');
      setSubmitting(false);
      return;
    }
    if (!validatePhone(formData.driverPhone)) {
      setError('Invalid Phone Number (must be 10 digits starting with 07)');
      setSubmitting(false);
      return;
    }
    if (!validateYear(Number(formData.manufacturingYear))) {
      setError('Invalid Manufacturing Year');
      setSubmitting(false);
      return;
    }
    try {
      await api.post('/cars', formData);
      setSuccess('Car registered successfully!');
      setFormData({
        plateNumber: '',
        type: '',
        model: '',
        manufacturingYear: new Date().getFullYear(),
        driverPhone: '',
        mechanicName: ''
      });
      fetchCars();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register car');
    } finally {
      setSubmitting(false);
    }
  };
  return <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Car Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-semibold mb-4">Register New Car</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>}
            {success && <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
                {success}
              </div>}

            <Input label="Plate Number" name="plateNumber" value={formData.plateNumber} onChange={handleChange} placeholder="e.g. RAD 123 A" required />

            <Select label="Car Type" name="type" value={formData.type} onChange={handleChange} options={[{
            value: 'SUV',
            label: 'SUV'
          }, {
            value: 'Sedan',
            label: 'Sedan'
          }, {
            value: 'Truck',
            label: 'Truck'
          }, {
            value: 'Van',
            label: 'Van'
          }, {
            value: 'Bus',
            label: 'Bus'
          }]} required />

            <Input label="Model" name="model" value={formData.model} onChange={handleChange} placeholder="e.g. Toyota RAV4" required />

            <Input label="Manufacturing Year" name="manufacturingYear" type="number" value={formData.manufacturingYear} onChange={handleChange} required />

            <Input label="Driver Phone" name="driverPhone" value={formData.driverPhone} onChange={handleChange} placeholder="07..." required />

            <Input label="Mechanic Name" name="mechanicName" value={formData.mechanicName} onChange={handleChange} placeholder="Assigned mechanic" required />

            <Button type="submit" className="w-full" isLoading={submitting}>
              Register Car
            </Button>
          </form>
        </div>

        {/* Car List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Registered Cars</h2>
            </div>
            <Table headers={['Plate No.', 'Model', 'Type', 'Year', 'Driver Phone', 'Mechanic']}>
              {cars.map(car => <TableRow key={car.PlateNumber}>
                  <TableCell className="font-medium">
                    {car.PlateNumber}
                  </TableCell>
                  <TableCell>{car.Model}</TableCell>
                  <TableCell>{car.Type}</TableCell>
                  <TableCell>{car.ManufacturingYear}</TableCell>
                  <TableCell>{car.DriverPhone}</TableCell>
                  <TableCell>{car.MechanicName}</TableCell>
                </TableRow>)}
            </Table>
          </div>
        </div>
      </div>
    </div>;
};