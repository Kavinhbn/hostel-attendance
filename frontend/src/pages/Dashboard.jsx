import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { name: 'Total Students', value: '0', icon: UserGroupIcon },
  { name: 'Today\'s Attendance', value: '0', icon: ClipboardDocumentCheckIcon },
  { name: 'Meal Forecast', value: '0', icon: ChartBarIcon },
  { name: 'Monthly Savings', value: '₹0', icon: CurrencyDollarIcon },
];

export default function Dashboard() {
  const [data, setData] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    mealForecast: 0,
    monthlySavings: 0,
  });

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const value = index === 0
            ? data.totalStudents
            : index === 1
            ? data.todayAttendance
            : index === 2
            ? data.mealForecast
            : `₹${data.monthlySavings}`;

          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
              </dd>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <ul role="list" className="divide-y divide-gray-200">
            {/* Add recent activity items here */}
            <li className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    No recent activity
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    Activity will appear here
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 