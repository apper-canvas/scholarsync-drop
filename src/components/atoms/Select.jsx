import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = ({ 
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  disabled = false,
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            block w-full rounded-lg border-2 bg-white px-4 py-3 pr-10 text-gray-900
            transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1
            appearance-none cursor-pointer
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-200 focus:border-primary-500 focus:ring-primary-500 hover:border-gray-300'
            }
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;