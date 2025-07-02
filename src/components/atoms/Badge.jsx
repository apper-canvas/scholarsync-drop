import React from 'react';

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'sm',
  className = '',
  ...props 
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 border border-secondary-300",
    accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800 border border-accent-300",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300",
    gray: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300"
  };
  
  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;