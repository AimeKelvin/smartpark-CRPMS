import React, { useEffect, useState } from 'react';
import { Car, CreditCard, ClipboardList, TrendingUp } from 'lucide-react';
import { getCars } from '../api/cars';
import { getPayments } from '../api/payments';
import { getRecords } from '../api/records';
import { ErrorMessage } from '../components/ErrorMessage';
import { DashboardStats } from '../types';
export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    monthlyPayments: 0,
    pendingRecords: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cars, payments, records] = await Promise.all([getCars(), getPayments(), getRecords()]);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyTotal = payments.filter(p => {
        const d = new Date(p.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).reduce((sum, p) => sum + p.amount, 0);
      const pendingCount = records.filter(r => r.status === 'pending').length;
      setStats({
        totalCars: cars.length,
        monthlyPayments: monthlyTotal,
        pendingRecords: pendingCount
      });
    } catch (error: any) {
      console.error('Failed to fetch dashboard data', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (isLoading) {
    return <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-32 animate-pulse border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>)}
        </div>
      </div>;
  }
  if (error) {
    return <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>;
  }
  const cards = [{
    name: 'Total Cars',
    value: stats.totalCars,
    icon: Car,
    color: 'bg-blue-600',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    description: 'Registered vehicles'
  }, {
    name: 'Monthly Revenue',
    value: `$${stats.monthlyPayments.toLocaleString()}`,
    icon: TrendingUp,
    color: 'bg-green-600',
    bgLight: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-600 dark:text-green-400',
    description: 'Payments this month'
  }, {
    name: 'Pending Records',
    value: stats.pendingRecords,
    icon: ClipboardList,
    color: 'bg-amber-600',
    bgLight: 'bg-amber-50 dark:bg-amber-900/20',
    textColor: 'text-amber-600 dark:text-amber-400',
    description: 'Services waiting'
  }];
  const isEmpty = stats.totalCars === 0 && stats.monthlyPayments === 0 && stats.pendingRecords === 0;
  return <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of your car repair business
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(card => <div key={card.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
                    {card.name}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {card.description}
                  </p>
                </div>
                <div className={`${card.bgLight} p-3 rounded-lg flex-shrink-0 ml-4`}>
                  <card.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          </div>)}
      </div>

      {isEmpty ? <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-6 sm:p-8">
          <div className="max-w-2xl">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to CRPMS! 🚗
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
              Your Car Repair Payment Management System is ready to go. Get
              started by adding your first car, service, or creating a service
              record.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/cars" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                Add Your First Car
              </a>
              <a href="/services" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Create Services
              </a>
            </div>
          </div>
        </div> : <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[{
          href: '/cars',
          icon: Car,
          label: 'Manage Cars'
        }, {
          href: '/records',
          icon: ClipboardList,
          label: 'Service Records'
        }, {
          href: '/payments',
          icon: CreditCard,
          label: 'View Payments'
        }, {
          href: '/reports',
          icon: TrendingUp,
          label: 'Generate Reports'
        }].map(action => <a key={action.href} href={action.href} className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
                <action.icon className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 truncate">
                  {action.label}
                </span>
              </a>)}
          </div>
        </div>}
    </div>;
}