import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({
  label,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name;
  return <div className="w-full">
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>}
      <input id={inputId} className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors min-h-[44px] sm:min-h-[38px]
        bg-white dark:bg-gray-800 
        border-gray-300 dark:border-gray-600 
        text-gray-900 dark:text-white 
        dark:placeholder-gray-500
        ${error ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500' : ''} 
        ${className}`} {...props} />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>;
}