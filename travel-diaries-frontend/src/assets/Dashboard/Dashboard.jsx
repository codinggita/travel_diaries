
import { FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../compo/newNav';
const DashboardPage = () => {
  const navigate = useNavigate();

  const handleStartDiary = () => {
    navigate('/dashboard/start-diary');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Navbar */}
      <Navbar/>

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center h-full">
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
