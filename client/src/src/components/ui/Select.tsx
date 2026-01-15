import React from 'react';
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: {
    value: string | number;
    label: string;
  }[];
}
export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || props.name;
  return <div className="w-full">
      {label && <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>}
      <select id={selectId} className={`w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 bg-white ${className}`} {...props}>
        <option value="">Select an option</option>
        {options.map(option => <option key={option.value} value={option.value}>
            {option.label}
          </option>)}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>;
};