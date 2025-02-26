import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import { FaWind } from 'react-icons/fa'; // Wind icon for storm effect

const NotFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 overflow-hidden relative">
      {/* Storm Background */}
      <div className="storm-overlay absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-500 opacity-50 pointer-events-none"></div>

      {/* Diary and Pages Container */}
      <div className="diary-container relative w-80 h-96 md:w-96 md:h-[28rem] z-10 flex items-center justify-center">
        {/* Diary Book */}
        <div className="diary absolute w-40 h-56 bg-[#FAA41F] rounded-lg shadow-xl transform rotate-[-10deg] z-20">
          <BookIcon sx={{ fontSize: 80, color: '#fff', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>

        {/* Fluttering Pages */}
        <div className="page page-1 absolute w-32 h-40 bg-white opacity-80 shadow-md z-10 flutter-1"></div>
        <div className="page page-2 absolute w-28 h-36 bg-white opacity-80 shadow-md z-10 flutter-2"></div>
        <div className="page page-3 absolute w-24 h-32 bg-white opacity-80 shadow-md z-10 flutter-3"></div>

        {/* Wind Effect */}
        <FaWind className="wind absolute bottom-0 left-0 text-gray-400 opacity-70" size={40} />
      </div>

      {/* Text and Button */}
      <Typography variant="h3" sx={{ color: '#FAA41F', mt: 6, fontWeight: 'bold', zIndex: 10 }}>
        404 - Lost in the Storm
      </Typography>
      <Typography variant="body1" sx={{ color: '#666', mt: 2, textAlign: 'center', maxWidth: '400px', zIndex: 10 }}>
        The winds of adventure have scattered our diary pages! Let’s retrace our steps and find our way home.
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/"
        sx={{ mt: 4, backgroundColor: '#FAA41F', '&:hover': { backgroundColor: '#e59400' }, zIndex: 10 }}
      >
        Back to Home
      </Button>

      {/* CSS Styles */}
      <style jsx>{`
        .diary-container {
          position: relative;
          perspective: 1000px;
        }
        .diary {
          transition: transform 0.3s ease;
        }
        .page {
          position: absolute;
          border-radius: 4px;
          transform-origin: center;
        }
        .page-1 {
          top: 10%;
          left: 20%;
          animation: flutter1 4s infinite ease-in-out;
        }
        .page-2 {
          top: 30%;
          left: 60%;
          animation: flutter2 4s infinite ease-in-out 1s;
        }
        .page-3 {
          top: 50%;
          left: 40%;
          animation: flutter3 4s infinite ease-in-out 2s;
        }
        .wind {
          animation: windBlow 2s infinite ease-in-out;
        }
        @keyframes flutter1 {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.8;
          }
          50% {
            transform: translate(50px, 100px) rotate(20deg);
            opacity: 0.5;
          }
          100% {
            transform: translate(100px, 200px) rotate(40deg);
            opacity: 0;
          }
        }
        @keyframes flutter2 {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.8;
          }
          50% {
            transform: translate(-60px, 80px) rotate(-15deg);
            opacity: 0.5;
          }
          100% {
            transform: translate(-120px, 160px) rotate(-30deg);
            opacity: 0;
          }
        }
        @keyframes flutter3 {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.8;
          }
          50% {
            transform: translate(40px, 120px) rotate(10deg);
            opacity: 0.5;
          }
          100% {
            transform: translate(80px, 240px) rotate(20deg);
            opacity: 0;
          }
        }
        @keyframes windBlow {
          0% {
            transform: translateX(0);
            opacity: 0.7;
          }
          50% {
            transform: translateX(20px);
            opacity: 1;
          }
          100% {
            transform: translateX(0);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;