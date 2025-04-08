import React from 'react';
import { motion } from 'framer-motion';

const SensorCard = ({ title, value, unit, icon: Icon, color, change }) => {
  return (
    <motion.div 
      className={`p-4 rounded-lg shadow-md bg-gray-800 border-l-4 ${color}`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <div className="flex items-end mt-1">
            <span className="text-2xl font-bold text-white">{value}</span>
            <span className="ml-1 text-gray-400">{unit}</span>
          </div>
          
          {change && (
            <div className={`flex items-center mt-1 text-xs ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span>{change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last hour</span>
            </div>
          )}
        </div>
        
        <div className={`p-2 rounded-full bg-opacity-20 ${color.replace('border-', 'bg-')}`}>
          <Icon className={`w-5 h-5 ${color.replace('border-', 'text-')}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default SensorCard;