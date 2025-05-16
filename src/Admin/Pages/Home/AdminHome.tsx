// import  { useState, useEffect } from 'react';
// import AdminHeader from '../../Components/Header/AdminHeader';
// import SideBar from '../../Components/SideBar/SideBar';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store';
// import Footer from '../../../User/Components/Footer/Footer';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from 'recharts';
// import {
//   FiUsers,
//   FiBriefcase,
//   FiAward,
//   FiAlertTriangle,
//   FiFileText,
// } from 'react-icons/fi';
// import { toast } from 'react-toastify';
// import StatsCard from './StateCard';
// import { getAllDashboardStats } from '../../../services/admin/dashBoardService';

// interface DashboardStats {
//   totalUsers: number;
//   totalCompanies: number;
//   premiumUsers: number;
//   spamUsers: number;
//   totalJobs: number;
//   totalApplications: number;
//   growthRate: {
//     users: number;
//     companies: number;
//     premium: number;
//     spam: number;
//     jobs: number;
//     applications: number;
//   };
//   monthlyGrowth: Array<{
//     name: string;
//     users: number;
//     companies: number;
//     jobs: number;
//     applications: number;
//   }>;
//   userTypeDistribution: Array<{
//     name: string;
//     value: number;
//   }>;
//   jobCategories: Array<{
//     name: string;
//     count: number;
//   }>;
// }

// const AdminHome = () => {
//   const { user } = useSelector((state: RootState) => state.auth);
//   const [isLoading, setIsLoading] = useState(true);
//   const [startDate, setStartDate] = useState(() => {
//     const date = new Date();
//     date.setMonth(date.getMonth() - 6);
//     return date.toISOString().split('T')[0];
//   });
//   const [endDate, setEndDate] = useState(
//     () => new Date().toISOString().split('T')[0]
//   );
//   const [stats, setStats] = useState<DashboardStats>({
//     totalUsers: 0,
//     totalCompanies: 0,
//     premiumUsers: 0,
//     spamUsers: 0,
//     totalJobs: 0,
//     totalApplications: 0,
//     growthRate: {
//       users: 0,
//       companies: 0,
//       premium: 0,
//       spam: 0,
//       jobs: 0,
//       applications: 0,
//     },
//     monthlyGrowth: [],
//     userTypeDistribution: [],
//     jobCategories: [],
//   });

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

//   useEffect(() => {
//     if (new Date(endDate) < new Date(startDate)) {
//       toast.error('End date cannot be before start date');
//       setEndDate(new Date().toISOString().split('T')[0]);
//     }

//     const fetchDashboardStats = async () => {
//       try {
//         setIsLoading(true);
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0);

//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         const data  = await getAllDashboardStats(start,end)
//         if (data.success) {
//           setStats(data.stats);
//         }
//         console.log(data.stats);
//       } catch (error : any) {
//         toast.error(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDashboardStats();
//   }, [startDate, endDate]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="fixed top-0 z-50 w-full ">
//         <AdminHeader />
//       </div>
//       <div className="flex">
//         <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
//           <SideBar />
//         </div>

//         <main className="flex-1 p-8 mt-16 ml-64">
//           <div className="mx-auto max-w-7xl">
//             <div className="flex items-center justify-between mb-8">
//               <h1 className="text-2xl font-bold text-gray-800">
//                 Dashboard Overview
//               </h1>
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2">
//                   <label className="text-sm text-gray-600">From:</label>
//                   <input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="p-2 text-sm border rounded"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <label className="text-sm text-gray-600">To:</label>
//                   <input
//                     type="date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                     className="p-2 text-sm border rounded"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
//               <StatsCard
//                 title="Total Users"
//                 value={stats.totalUsers}
//                 icon={FiUsers}
//                 trend={stats.growthRate.users}
//                 color="bg-blue-500"
//                 isLoading={isLoading}
//               />
//               <StatsCard
//                 title="Total Companies"
//                 value={stats.totalCompanies}
//                 icon={FiBriefcase}
//                 trend={stats.growthRate.companies}
//                 color="bg-green-500"
//                 isLoading={isLoading}
//               />
//               <StatsCard
//                 title="Premium Users"
//                 value={stats.premiumUsers}
//                 icon={FiAward}
//                 trend={stats.growthRate.premium}
//                 color="bg-purple-500"
//                 isLoading={isLoading}
//               />
//               <StatsCard
//                 title="Spam Users"
//                 value={stats.spamUsers}
//                 icon={FiAlertTriangle}
//                 trend={stats.growthRate.spam}
//                 color="bg-red-500"
//                 isLoading={isLoading}
//               />
//               <StatsCard
//                 title="Total Jobs"
//                 value={stats.totalJobs}
//                 icon={FiBriefcase}
//                 trend={stats.growthRate.jobs}
//                 color="bg-indigo-500"
//                 isLoading={isLoading}
//               />
//               <StatsCard
//                 title="Applications"
//                 value={stats.totalApplications}
//                 icon={FiFileText}
//                 trend={stats.growthRate.applications}
//                 color="bg-yellow-500"
//                 isLoading={isLoading}
//               />
//             </div>

//             {/* Charts Grid */}
//             <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
//               {/* Growth Chart */}
//               <div className="p-6 bg-white shadow-sm rounded-xl">
//                 <h2 className="mb-4 text-lg font-semibold text-gray-800">
//                   Platform Growth
//                 </h2>
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={stats.monthlyGrowth}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Line
//                         type="monotone"
//                         dataKey="users"
//                         stroke="#0088FE"
//                         name="Users"
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="companies"
//                         stroke="#00C49F"
//                         name="Companies"
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="jobs"
//                         stroke="#FFBB28"
//                         name="Jobs"
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="applications"
//                         stroke="#FF8042"
//                         name="Applications"
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               {/* User Distribution */}
//               <div className="p-6 bg-white shadow-sm rounded-xl">
//                 <h2 className="mb-4 text-lg font-semibold text-gray-800">
//                   User Distribution
//                 </h2>
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={stats.userTypeDistribution}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={60}
//                         outerRadius={100}
//                         paddingAngle={5}
//                         dataKey="value"
//                       >
//                         {stats.userTypeDistribution.map((entry, index) => (
//                           <Cell
//                             key={`cell-${index}`}
//                             fill={COLORS[index % COLORS.length]}
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default AdminHome;

import { useState, useEffect } from 'react';
import AdminHeader from '../../Components/Header/AdminHeader';
import SideBar from '../../Components/SideBar/SideBar';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Footer from '../../../User/Components/Footer/Footer';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  FiUsers,
  FiBriefcase,
  FiAward,
  FiAlertTriangle,
  FiFileText,
  FiCalendar,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import StatsCard from './StateCard';
import { getAllDashboardStats } from '../../../services/admin/dashBoardService';

interface DashboardStats {
  totalUsers: number;
  totalCompanies: number;
  premiumUsers: number;
  spamUsers: number;
  totalJobs: number;
  totalApplications: number;
  growthRate: {
    users: number;
    companies: number;
    premium: number;
    spam: number;
    jobs: number;
    applications: number;
  };
  monthlyGrowth: Array<{
    name: string;
    users: number;
    companies: number;
    jobs: number;
    applications: number;
  }>;
  userTypeDistribution: Array<{
    name: string;
    value: number;
  }>;
  jobCategories: Array<{
    name: string;
    count: number;
  }>;
}

const AdminHome = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCompanies: 0,
    premiumUsers: 0,
    spamUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    growthRate: {
      users: 0,
      companies: 0,
      premium: 0,
      spam: 0,
      jobs: 0,
      applications: 0,
    },
    monthlyGrowth: [],
    userTypeDistribution: [],
    jobCategories: [],
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    if (new Date(endDate) < new Date(startDate)) {
      toast.error('End date cannot be before start date');
      setEndDate(new Date().toISOString().split('T')[0]);
    }

    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const data = await getAllDashboardStats(start, end);
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [startDate, endDate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 z-50 w-full">
        <AdminHeader />
      </div>

      <div className="flex flex-col pt-16 lg:flex-row">
        {/* Sidebar - Now working with the responsive sidebar component */}
        <SideBar />

        {/* Main Content Area - Adjusted for better responsiveness */}
        <main className="w-full p-4 transition-all duration-300 lg:ml-64 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Dashboard Header with Date Range Filters */}
            <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
              <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
                Dashboard Overview
              </h1>              
              <div className="flex flex-col items-start w-full gap-4 sm:flex-row sm:items-center sm:w-auto">
                <div className="flex items-center w-full gap-2 sm:w-auto">
                  <FiCalendar className="text-gray-500" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 text-sm border rounded"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center w-full gap-2 sm:w-auto">
                  <span className="hidden text-gray-500 sm:inline">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 text-sm border rounded"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Stats Cards Grid - Improved layout for all screen sizes */}
            <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 md:gap-6">
              <StatsCard
                title="Total Users"
                value={stats.totalUsers}
                icon={FiUsers}
                trend={stats.growthRate.users}
                color="bg-blue-500"
                isLoading={isLoading}
              />
              <StatsCard
                title="Total Companies"
                value={stats.totalCompanies}
                icon={FiBriefcase}
                trend={stats.growthRate.companies}
                color="bg-green-500"
                isLoading={isLoading}
              />
              <StatsCard
                title="Premium Users"
                value={stats.premiumUsers}
                icon={FiAward}
                trend={stats.growthRate.premium}
                color="bg-purple-500"
                isLoading={isLoading}
              />
              <StatsCard
                title="Spam Users"
                value={stats.spamUsers}
                icon={FiAlertTriangle}
                trend={stats.growthRate.spam}
                color="bg-red-500"
                isLoading={isLoading}
              />
              <StatsCard
                title="Total Jobs"
                value={stats.totalJobs}
                icon={FiBriefcase}
                trend={stats.growthRate.jobs}
                color="bg-indigo-500"
                isLoading={isLoading}
              />
              <StatsCard
                title="Applications"
                value={stats.totalApplications}
                icon={FiFileText}
                trend={stats.growthRate.applications}
                color="bg-yellow-500"
                isLoading={isLoading}
              />
            </div>

            {/* Charts Section - Responsive layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 md:gap-8">
              {/* Growth Chart */}
              <div className="p-4 bg-white shadow-sm md:p-6 rounded-xl">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  Platform Growth
                </h2>
                
                {isLoading ? (
                  <div className="flex items-center justify-center h-80">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : stats.monthlyGrowth.length === 0 ? (
                  <div className="flex items-center justify-center text-gray-500 h-80">
                    No growth data available for selected period
                  </div>
                ) : (
                  <div className="h-60 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.monthlyGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                        <Line
                          type="monotone"
                          dataKey="users"
                          stroke="#0088FE"
                          name="Users"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="companies"
                          stroke="#00C49F"
                          name="Companies"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="jobs"
                          stroke="#FFBB28"
                          name="Jobs"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="applications"
                          stroke="#FF8042"
                          name="Applications"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* User Distribution */}
              <div className="p-4 bg-white shadow-sm md:p-6 rounded-xl">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  User Distribution
                </h2>
                
                {isLoading ? (
                  <div className="flex items-center justify-center h-80">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : stats.userTypeDistribution.length === 0 ? (
                  <div className="flex items-center justify-center text-gray-500 h-80">
                    No distribution data available
                  </div>
                ) : (
                  <div className="h-60 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.userTypeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {stats.userTypeDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
    </div>
  );
};

export default AdminHome;
