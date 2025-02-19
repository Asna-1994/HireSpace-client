import React from 'react';
import { IconType } from 'react-icons';
import { FiTrendingDown, FiTrendingUp } from 'react-icons/fi';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: IconType; 
  trend?: number; 
  color: string; 
  isLoading?: boolean; 
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color,
  isLoading,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">
          {isLoading
            ? '-'
            : typeof value === 'number'
              ? value.toLocaleString()
              : value}
        </h3>
        {trend !== undefined && (
          <div
            className={`flex items-center mt-2 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {trend >= 0 ? (
              <FiTrendingUp size={16} />
            ) : (
              <FiTrendingDown size={16} />
            )}
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

export default StatsCard;
