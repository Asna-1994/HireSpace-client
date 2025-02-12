import React, { useState, useEffect } from "react";
import AdminHeader from "../../Components/Header/AdminHeader";
import SideBar from "../../Components/SideBar/SideBar";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Footer from "../../../User/Components/Footer/Footer";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiBriefcase,
  FiAward,
  FiAlertTriangle,
  FiFileText,
} from "react-icons/fi";
import axiosInstance from "../../../Utils/Instance/axiosInstance";
import { toast } from "react-toastify";
import StatsCard from "./StateCard";

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
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0],
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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date cannot be before start date");
      setEndDate(new Date().toISOString().split("T")[0]);
    }

    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        // Convert the dates to the beginning and end of the day
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const response = await axiosInstance.get("/admin/dashboard-stats", {
          params: {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          },
        });
        if (response.data.success) {
          setStats(response.data.stats);
        }
        console.log(response.data.stats);
      } catch (error) {
        toast.error("Failed to fetch dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [startDate, endDate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 w-full z-50 ">
        <AdminHeader />
      </div>
      <div className="flex">
        <div className="lg:fixed top-16 left-0 lg:w-64 h-auto lg:h-[calc(100vh-4rem)]">
          <SideBar />
        </div>

        <main className="flex-1 ml-64 mt-16 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard Overview
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded p-2 text-sm"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded p-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
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

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Growth Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Platform Growth
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.monthlyGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#0088FE"
                        name="Users"
                      />
                      <Line
                        type="monotone"
                        dataKey="companies"
                        stroke="#00C49F"
                        name="Companies"
                      />
                      <Line
                        type="monotone"
                        dataKey="jobs"
                        stroke="#FFBB28"
                        name="Jobs"
                      />
                      <Line
                        type="monotone"
                        dataKey="applications"
                        stroke="#FF8042"
                        name="Applications"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User Distribution */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  User Distribution
                </h2>
                <div className="h-80">
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
                      >
                        {stats.userTypeDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminHome;
