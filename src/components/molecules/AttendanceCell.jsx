import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const AttendanceCell = ({ status, date, onClick }) => {
  const statusConfig = {
    present: {
      icon: 'CheckCircle',
      color: 'text-green-600',
      bg: 'bg-green-100 hover:bg-green-200',
      label: 'Present'
    },
    absent: {
      icon: 'XCircle',
      color: 'text-red-600',
      bg: 'bg-red-100 hover:bg-red-200',
      label: 'Absent'
    },
    tardy: {
      icon: 'Clock',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100 hover:bg-yellow-200',
      label: 'Tardy'
    },
    excused: {
      icon: 'Shield',
      color: 'text-blue-600',
      bg: 'bg-blue-100 hover:bg-blue-200',
      label: 'Excused'
    }
  };

  const config = statusConfig[status] || {
    icon: 'Circle',
    color: 'text-gray-400',
    bg: 'bg-gray-100 hover:bg-gray-200',
    label: 'Not Recorded'
  };

  return (
    <button
      onClick={() => onClick && onClick(date)}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150 ${config.bg}`}
      title={`${config.label} - ${date}`}
    >
      <ApperIcon 
        name={config.icon} 
        size={16} 
        className={config.color} 
      />
    </button>
  );
};

export default AttendanceCell;