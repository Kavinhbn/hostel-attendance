import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import FaceScan from './pages/FaceScan';
import Attendance from './pages/Attendance';
import Forecast from './pages/Forecast';
import Leave from './pages/Leave';
import Financials from './pages/Financials';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Sidebar />
        
        {/* Main Content */}
        <div className="lg:pl-72">
          <main className="py-10 pb-20 lg:pb-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/face-scan" element={<FaceScan />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/forecast" element={<Forecast />} />
                <Route path="/leave" element={<Leave />} />
                <Route path="/financials" element={<Financials />} />
              </Routes>
            </div>
          </main>
        </div>

        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="text-sm font-medium"
        />
      </div>
    </Router>
  );
}

export default App; 