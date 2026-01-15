export interface User {
  id: number;
  username: string;
  role: string;
}
export interface Car {
  PlateNumber: string;
  Type: string;
  Model: string;
  ManufacturingYear: number;
  DriverPhone: string;
  MechanicName: string;
}
export interface Service {
  ServiceCode: string;
  ServiceName: string;
  ServicePrice: number;
}
export interface ServiceRecord {
  RecordNumber: number;
  ServiceDate: string;
  PlateNumber: string;
  ServiceCode: string;
  // Joined fields
  Model?: string;
  DriverPhone?: string;
  ServiceName?: string;
  ServicePrice?: number;
}
export interface Payment {
  PaymentNumber: number;
  AmountPaid: number;
  PaymentDate: string;
  PlateNumber: string;
  // Joined fields
  Model?: string;
  DriverPhone?: string;
}
export interface BillData {
  car: Car;
  services: {
    ServiceDate: string;
    ServiceName: string;
    ServicePrice: number;
  }[];
  summary: {
    totalServiceCost: number;
    totalPaid: number;
    balance: number;
  };
}
export interface DailyReportData {
  date: string;
  services: {
    ServiceDate: string;
    PlateNumber: string;
    Model: string;
    ServiceName: string;
    ServicePrice: number;
  }[];
  payments: {
    PaymentDate: string;
    AmountPaid: number;
    PlateNumber: string;
    Model: string;
  }[];
  totals: {
    totalServiceValue: number;
    totalRevenue: number;
  };
}