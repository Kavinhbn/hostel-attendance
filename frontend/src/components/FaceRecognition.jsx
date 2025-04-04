import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function FaceRecognition() {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedStudent, setDetectedStudent] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop all video streams
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      toast.error('Error accessing camera: ' + error.message);
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setDetectedStudent(null);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Here you would typically send the frame to your backend for face recognition
    // For now, we'll simulate a successful detection
    simulateFaceDetection();
  };

  const simulateFaceDetection = () => {
    // Simulate face detection with a delay
    setTimeout(() => {
      setDetectedStudent({
        name: 'John Doe',
        rollNumber: '2023001',
        roomNumber: 'A101'
      });
      toast.success('Student recognized successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Face Recognition</h2>
        <div className="flex space-x-4">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Scanning
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Stop Scanning
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg shadow-lg"
          style={{ display: isScanning ? 'block' : 'none' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
          style={{ display: 'none' }}
        />
        {!isScanning && (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Camera feed will appear here</p>
          </div>
        )}
      </div>

      {detectedStudent && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detected Student</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="mt-1 text-sm text-gray-900">{detectedStudent.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Roll Number</p>
              <p className="mt-1 text-sm text-gray-900">{detectedStudent.rollNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Room Number</p>
              <p className="mt-1 text-sm text-gray-900">{detectedStudent.roomNumber}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 