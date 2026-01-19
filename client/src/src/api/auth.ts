import client from './client';
import { AuthResponse } from '../types';
export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await client.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};
export const register = async (data: any) => {
  const response = await client.post<AuthResponse>('/auth/register', data);
  return response.data;
};