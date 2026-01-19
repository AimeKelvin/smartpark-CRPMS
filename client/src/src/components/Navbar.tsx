import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Car, Wrench, ClipboardList, CreditCard, FileText, LogOut, Menu, X, Moon, Sun } from 'lucide-react';
export function Navbar() {
  const {
    logout
  } = useAuth();
  const {
    theme,
    toggleTheme
  } = useTheme();
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
  return <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 fixed w-full top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                  CRPMS
                </span>
              </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-1">
              {navItems.map(item => <Link key={item.path} to={item.path} className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(item.path) ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}>
                  <item.icon className="w-4 h-4 mr-2" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>)}
            </div>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={handleLogout} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(item => <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive(item.path) ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>)}
            <button onClick={() => {
          handleLogout();
          setIsMobileMenuOpen(false);
        }} className="w-full flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>}
    </nav>;
}