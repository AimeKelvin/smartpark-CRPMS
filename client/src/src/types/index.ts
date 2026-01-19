export interface User {
  id: string;
  username: string;
  role?: string;
}
export interface AuthResponse {
  token: string;
  user?: User;
}
export interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  owner: string;
}
export interface Service {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
}
export interface ServiceRecord {
  _id: string;
  car: Car | string; // Populated or ID
  service: Service | string; // Populated or ID
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
  notes?: string;
  cost: number;
}
export interface Payment {
  _id: string;
  record: ServiceRecord | string;
  amount: number;
  date: string;
  method: 'cash' | 'credit_card' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed';
}
export interface DashboardStats {
  totalCars: number;
  monthlyPayments: number;
  pendingRecords: number;
}