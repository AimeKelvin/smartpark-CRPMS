export interface User {
  id: string;
  username: string;
  role?: string;
}
export interface AuthResponse {
  token: string;
  user?: User;
}

// Car model matches your backend schema
export interface Car {
  _id: string;
  plateNumber: string; // matches Mongoose field
  type?: string;
  model?: string;
  year?: number;
  driverPhone?: string;
  mechanicName?: string;
}
export interface Service {
  _id: string;
  code: string;
  name: string;
  price: number;
}
export interface ServiceRecord {
  _id: string;
  car: Car | string; // Populated object or ObjectId
  service: Service | string; // Populated object or ObjectId
  serviceDate: string; // matches backend
  status: 'pending' | 'in_progress' | 'completed';
}
export interface Payment {
  _id: string;
  record: ServiceRecord | string; // Populated or ID
  amountPaid: number; // matches backend
  paymentDate: string;
}
export interface DashboardStats {
  totalCars: number;
  monthlyPayments: number;
  pendingRecords: number;
}