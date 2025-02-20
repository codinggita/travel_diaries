import { Button } from '@mui/material';
import { FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleStartDiary = () => {
    navigate('/dashboard/start-diary');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-orange-500">Travel DIARIES</div>
        <div className="flex items-center gap-4">
          <Link to="/how-it-works" className="text-gray-700">How Travel Diaries works?</Link>
          <Link to="/pricing" className="text-gray-700">Pricing</Link>
          <Link to="/upgrade" className="text-gray-700">Upgrade to premium</Link>
          <Button variant="outlined">Logout</Button>
          <Button variant="contained" color="warning">Create diary</Button>
          <span className="cursor-pointer">🛒</span>
          <span className="cursor-pointer">⚙️</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center">
        <div
          className="bg-white p-6 rounded-2xl shadow-lg text-center w-64 cursor-pointer hover:shadow-xl transition"
          onClick={handleStartDiary}
        >
          <div className="flex justify-center items-center bg-orange-400 text-white rounded-full w-16 h-16 mx-auto">
            <FaPlus size={24} />
          </div>
          <p className="mt-4 font-medium">Start a new diary</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 p-4 bg-white border-t">
        <p>
          © 2025 Travel Diaries. All rights reserved. · <a href="/privacy">Privacy policy</a> · <a href="/terms">Terms and conditions</a> ·{' '}
          <a href="/user-terms">User terms</a> · <a href="/faq">Frequently Asked Questions</a> · <a href="/contact">Contact us</a>
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <span>📘</span>
          <span>📸</span>
          <span>🐦</span>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
