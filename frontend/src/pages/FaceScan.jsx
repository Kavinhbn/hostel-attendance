import { useState } from 'react';
import FaceRecognition from '../components/FaceRecognition';
import { toast } from 'react-toastify';

export default function FaceScan() {
  const [mealType, setMealType] = useState('breakfast');

  const handleAttendanceSubmit = async (studentData) => {
    try {
      // Here you would typically send the attendance data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Attendance marked for ${studentData.name}`);
    } catch (error) {
      toast.error('Error marking attendance: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Face Scan Attendance</h1>
        <div className="flex items-center space-x-4">
          <label htmlFor="meal-type" className="text-sm font-medium text-gray-700">
            Meal Type:
          </label>
          <select
            id="meal-type"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <FaceRecognition onStudentDetected={handleAttendanceSubmit} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Instructions</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Ensure good lighting conditions for better face recognition</li>
          <li>• Position your face within the camera frame</li>
          <li>• Keep your face still while scanning</li>
          <li>• Make sure your face is clearly visible without any obstructions</li>
          <li>• The system will automatically mark your attendance once recognized</li>
        </ul>
      </div>
    </div>
  );
} 