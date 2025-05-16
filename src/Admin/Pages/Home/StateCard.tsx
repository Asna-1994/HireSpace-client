// import React from 'react';
// import { IconType } from 'react-icons';
// import { FiTrendingDown, FiTrendingUp } from 'react-icons/fi';

// interface StatsCardProps {
//   title: string;
//   value: number | string;
//   icon: IconType; 
//   trend?: number; 
//   color: string; 
//   isLoading?: boolean; 
// }

// const StatsCard: React.FC<StatsCardProps> = ({
//   title,
//   value,
//   icon: Icon,
//   trend,
//   color,
//   isLoading,
// }) => (
//   <div className="p-6 transition-all bg-white shadow-sm rounded-xl hover:shadow-md">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="mb-1 text-sm text-gray-500">{title}</p>
//         <h3 className="text-2xl font-bold text-gray-800">
//           {isLoading
//             ? '-'
//             : typeof value === 'number'
//               ? value.toLocaleString()
//               : value}
//         </h3>
//         {trend !== undefined && (
//           <div
//             className={`flex items-center mt-2 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}
//           >
//             {trend >= 0 ? (
//               <FiTrendingUp size={16} />
//             ) : (
//               <FiTrendingDown size={16} />
//             )}
//             <span className="ml-1">{Math.abs(trend)}%</span>
//           </div>
//         )}
//       </div>
//       <div className={`p-3 rounded-full ${color}`}>
//         <Icon size={24} className="text-white" />
//       </div>
//     </div>
//   </div>
// );

// export default StatsCard;

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
}) => {
  // Determine if the trend is positive, negative, or neutral
  const trendColor = trend === 0 
    ? 'text-gray-500'
    : trend && trend > 0 
      ? 'text-green-500' 
      : 'text-red-500';
  
  const trendIcon = trend === 0 
    ? null
    : trend && trend > 0 
      ? <FiTrendingUp size={16} /> 
      : <FiTrendingDown size={16} />;

  return (
    <div className="p-4 transition-all duration-300 bg-white border border-gray-100 shadow-sm md:p-5 rounded-xl hover:shadow-md">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="w-1/2 h-4 mb-2 bg-gray-200 rounded"></div>
              <div className="w-1/3 h-6 mb-2 bg-gray-300 rounded"></div>
              <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className={`p-3 rounded-full bg-gray-300`}></div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
            {trend !== undefined && (
              <div className={`flex items-center mt-2 text-xs sm:text-sm ${trendColor}`}>
                {trendIcon}
                <span className="ml-1">
                  {Math.abs(trend)}% {trend >= 0 ? 'increase' : 'decrease'}
                </span>
              </div>
            )}
          </div>
          <div className={`p-2 sm:p-3 rounded-full ${color} shadow-sm`}>
            <Icon size={20} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
