import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  icon = "Database",
  actionLabel,
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
        {title}
      </h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          icon="Plus"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;