import client from './client';
import { ServiceRecord } from '../types';
export const getRecords = async () => {
  const response = await client.get<ServiceRecord[]>('/records');
  return response.data;
};
export const getRecord = async (id: string) => {
  const response = await client.get<ServiceRecord>(`/records/${id}`);
  return response.data;
};
export const createRecord = async (data: Omit<ServiceRecord, '_id'>) => {
  const response = await client.post<ServiceRecord>('/records', data);
  return response.data;
};
export const updateRecord = async (id: string, data: Partial<ServiceRecord>) => {
  const response = await client.put<ServiceRecord>(`/records/${id}`, data);
  return response.data;
};
export const deleteRecord = async (id: string) => {
  const response = await client.delete(`/records/${id}`);
  return response.data;
};