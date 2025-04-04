import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

export default function Forecast() {
  const [forecast, setForecast] = useState({
    today: {
      breakfast: { expected: 0, actual: 0 },
      lunch: { expected: 0, actual: 0 },
      dinner: { expected: 0, actual: 0 }
    },
    tomorrow: {
      breakfast: { expected: 0, actual: 0 },
      lunch: { expected: 0, actual: 0 },
      dinner: { expected: 0, actual: 0 }
    },
    weeklyTrend: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/meals/forecast');
      setForecast(response.data);
    } catch (error) {
      toast.error('Error fetching forecast data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const MealCard = ({ title, data }) => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {Object.entries(data).map(([meal, stats]) => (
          <div key={meal} className="flex justify-between items-center">
            <div className="flex items-center">
              <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-900 capitalize">
                {meal}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Expected</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.expected}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Actual</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.actual}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Meal Forecast</h1>
        <button
          onClick={fetchForecast}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading forecast data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MealCard title="Today's Forecast" data={forecast.today} />
          <MealCard title="Tomorrow's Forecast" data={forecast.tomorrow} />
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Weekly Trend</h2>
        <div className="space-y-4">
          {forecast.weeklyTrend.map((day, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {new Date(day.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {day.attendance} students
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 