import client from './client';
import { Payment } from '../types';
export const getPayments = async () => {
  const response = await client.get<Payment[]>('/payments');
  return response.data;
};
export const getPayment = async (id: string) => {
  const response = await client.get<Payment>(`/payments/${id}`);
  return response.data;
};
export const createPayment = async (data: Omit<Payment, '_id'>) => {
  const response = await client.post<Payment>('/payments', data);
  return response.data;
};
export const updatePayment = async (id: string, data: Partial<Payment>) => {
  const response = await client.put<Payment>(`/payments/${id}`, data);
  return response.data;
};
export const deletePayment = async (id: string) => {
  const response = await client.delete(`/payments/${id}`);
  return response.data;
};