import client from './client';
import { Service } from '../types';
export const getServices = async () => {
  const response = await client.get<Service[]>('/services');
  return response.data;
};
export const getService = async (id: string) => {
  const response = await client.get<Service>(`/services/${id}`);
  return response.data;
};
export const createService = async (data: Omit<Service, '_id'>) => {
  const response = await client.post<Service>('/services', data);
  return response.data;
};
export const updateService = async (id: string, data: Partial<Service>) => {
  const response = await client.put<Service>(`/services/${id}`, data);
  return response.data;
};
export const deleteService = async (id: string) => {
  const response = await client.delete(`/services/${id}`);
  return response.data;
};