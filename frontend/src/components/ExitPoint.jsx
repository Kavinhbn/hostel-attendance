import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ExitPoint = () => {
  const [studentId, setStudentId] = useState('');
  const [mealType, setMealType] = useState('');
  const [timeSpent, setTimeSpent] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/verification/exit', {
        studentId,
        mealType
      });
      
      setTimeSpent(response.data.timeSpent);
      
      if (response.data.timeSpent >= 15) {
        toast.success('Exit recorded successfully. Attendance marked.');
      } else {
        toast.warning('Exit recorded but time spent was insufficient for attendance.');
      }
      
      setStudentId('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record exit');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Mess Exit Point</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Student ID
          </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Meal Type
          </label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select Meal</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Record Exit
        </button>
      </form>

      {timeSpent !== null && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Time spent in mess: {timeSpent} minutes
          </p>
          <p className="text-sm text-gray-600">
            {timeSpent >= 15 
              ? 'Attendance has been marked'
              : 'Minimum 15 minutes required for attendance'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExitPoint; 