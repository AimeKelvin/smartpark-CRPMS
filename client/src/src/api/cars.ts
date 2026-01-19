import client from './client';
import { Car } from '../types';
export const getCars = async () => {
  const response = await client.get<Car[]>('/cars');
  return response.data;
};
export const getCar = async (id: string) => {
  const response = await client.get<Car>(`/cars/${id}`);
  return response.data;
};
export const createCar = async (data: Omit<Car, '_id'>) => {
  const response = await client.post<Car>('/cars', data);
  return response.data;
};
export const updateCar = async (id: string, data: Partial<Car>) => {
  const response = await client.put<Car>(`/cars/${id}`, data);
  return response.data;
};
export const deleteCar = async (id: string) => {
  const response = await client.delete(`/cars/${id}`);
  return response.data;
};