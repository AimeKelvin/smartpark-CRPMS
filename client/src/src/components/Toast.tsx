import React, { useCallback, useState, createContext, useContext } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export function ToastProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, {
      id,
      message,
      type
    }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
    }
  };
  const getStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/90 dark:border-green-700 dark:text-green-100';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/90 dark:border-red-700 dark:text-red-100';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/90 dark:border-yellow-700 dark:text-yellow-100';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/90 dark:border-blue-700 dark:text-blue-100';
    }
  };
  return <ToastContext.Provider value={{
    showToast
  }}>
      {children}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 space-y-2 w-full sm:w-auto max-w-[calc(100%-16px)] sm:max-w-md">
        {toasts.map(toast => <div key={toast.id} className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg w-full sm:min-w-[320px] animate-slide-in ${getStyles(toast.type)}`}>
            {getIcon(toast.type)}
            <p className="flex-1 text-sm text-gray-800 dark:text-gray-100">
              {toast.message}
            </p>
            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>)}
      </div>
    </ToastContext.Provider>;
}
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}