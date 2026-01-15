import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name;
  return <div className="w-full">
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>}
      <input id={inputId} className={`w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>;
};