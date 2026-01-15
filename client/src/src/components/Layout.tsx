import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Car, Wrench, ClipboardList, CreditCard, FileText, LogOut, Menu, X, User } from 'lucide-react';
export const Layout: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const {
    user,
    logout
  } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [{
    name: 'Dashboard',
    path: '/',
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
    name: 'Service Records',
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
  return <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center">
        <div className="font-bold text-lg">SmartPark CRPMS</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-blue-900 text-white transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold">SmartPark CRPMS</h1>
          <p className="text-blue-300 text-xs mt-1">Rubavu District</p>
        </div>

        <div className="p-4 border-b border-blue-800 flex items-center space-x-3">
          <div className="bg-blue-800 p-2 rounded-full">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">{user?.username || 'Admin'}</p>
            <p className="text-xs text-blue-300">{user?.role || 'Staff'}</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(item => <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${isActive(item.path) ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-800'}`}>
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>)}

          <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-red-300 hover:bg-blue-800 hover:text-red-200 transition-colors mt-8">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
    </div>;
};