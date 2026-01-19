import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Car, Wrench, ClipboardList, CreditCard, FileText, LogOut, Menu, X } from 'lucide-react';
export function Navbar() {
  const {
    logout
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const navItems = [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard
  }, {
    name: 'Cars',
    path: '/cars',
    icon: Car
  }, {
    name: 'Services',
    path: '/services',
    icon: Wrench
  }, {
    name: 'Records',
    path: '/records',
    icon: ClipboardList
  }, {
    name: 'Payments',
    path: '/payments',
    icon: CreditCard
  }, {
    name: 'Reports',
    path: '/reports',
    icon: FileText
  }];
  const isActive = (path: string) => location.pathname === path;
  return <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">CRPMS</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navItems.map(item => <Link key={item.path} to={item.path} className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(item.path) ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>)}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button onClick={handleLogout} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && <div className="sm:hidden bg-white border-b border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map(item => <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive(item.path) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}`}>
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </Link>)}
            <button onClick={() => {
          handleLogout();
          setIsMobileMenuOpen(false);
        }} className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700">
              <div className="flex items-center">
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </div>
            </button>
          </div>
        </div>}
    </nav>;
}