import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  color = 'primary',
  className = '' 
}) => {
  const colorVariants = {
    primary: {
      bg: 'bg-gradient-to-br from-primary-500 to-primary-600',
      icon: 'bg-primary-100 text-primary-600',
      text: 'text-white'
    },
    secondary: {
      bg: 'bg-gradient-to-br from-secondary-500 to-secondary-600',
      icon: 'bg-secondary-100 text-secondary-600',
      text: 'text-white'
    },
    accent: {
      bg: 'bg-gradient-to-br from-accent-500 to-accent-600',
      icon: 'bg-accent-100 text-accent-600',
      text: 'text-white'
    },
    success: {
      bg: 'bg-gradient-to-br from-green-500 to-green-600',
      icon: 'bg-green-100 text-green-600',
      text: 'text-white'
    }
  };

  const { bg, icon: iconColor, text } = colorVariants[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      className={`${bg} rounded-xl p-6 shadow-lg transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${text} opacity-90`}>
            {title}
          </h3>
          <p className={`text-3xl font-bold ${text} mt-2`}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                className={`h-4 w-4 ${text} opacity-75 mr-1`} 
              />
              <span className={`text-sm ${text} opacity-75`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`${iconColor} p-3 rounded-lg`}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;