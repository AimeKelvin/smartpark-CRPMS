import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { Car, Wrench, CreditCard, ArrowRight } from 'lucide-react';
export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalServices: 0,
    todayRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, we'd have a dedicated stats endpoint
        // Here we fetch lists and count them for the exam demo
        const [carsRes, servicesRes, reportRes] = await Promise.all([api.get('/cars'), api.get('/services'), api.get('/reports/daily')]);
        setStats({
          totalCars: carsRes.data.length,
          totalServices: servicesRes.data.length,
          todayRevenue: reportRes.data.totals.totalRevenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  const cards = [{
    title: 'Total Cars',
    value: stats.totalCars,
    icon: Car,
    color: 'bg-blue-500',
    link: '/cars',
    linkText: 'Manage Cars'
  }, {
    title: 'Available Services',
    value: stats.totalServices,
    icon: Wrench,
    color: 'bg-green-500',
    link: '/services',
    linkText: 'View Services'
  }, {
    title: "Today's Revenue",
    value: formatCurrency(stats.todayRevenue),
    icon: CreditCard,
    color: 'bg-purple-500',
    link: '/reports',
    linkText: 'View Reports'
  }];
  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }
  return <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome to SmartPark Management System
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg text-white`}>
                  <card.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
              <Link to={card.link} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                {card.linkText} <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>)}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/cars" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
            <span className="block font-medium text-gray-900">
              Register Car
            </span>
            <span className="text-xs text-gray-500">Add new vehicle</span>
          </Link>
          <Link to="/records" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
            <span className="block font-medium text-gray-900">
              New Service Record
            </span>
            <span className="text-xs text-gray-500">Log a repair</span>
          </Link>
          <Link to="/payments" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
            <span className="block font-medium text-gray-900">
              Record Payment
            </span>
            <span className="text-xs text-gray-500">Process transaction</span>
          </Link>
          <Link to="/reports" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
            <span className="block font-medium text-gray-900">
              Generate Bill
            </span>
            <span className="text-xs text-gray-500">Print invoice</span>
          </Link>
        </div>
      </div>
    </div>;
};