import React, { useState } from "react";
import Navbar from '../../../LandingPage/Parts/Navbar';
import BookIcon from '@mui/icons-material/Book';
import EditIcon from '@mui/icons-material/Edit';

const ProxyIframe = () => {
  const [url, setUrl] = useState("https://www.traveldiariesapp.com/en/travel-inspiration/journaling/create-recipe-book"); // Default URL to embed
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false); // Hide loading state and allow Navbar to render once iframe content is loaded
  };

  // BookWritingLoader Component (copied from your app's loader)
  const BookWritingLoader = () => {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <div className="book-writer">
          <BookIcon sx={{ fontSize: 100, color: '#FAA41F' }} className="book" />
          <div className="book-shadow"></div>
          <EditIcon sx={{ fontSize: 40, color: '#000000' }} className="pen" />
          <div className="writing-line"></div>
        </div>
        <p className="mt-6 text-[#FAA41F] font-semibold text-xl tracking-wide loading-text">TRAVEL DIARIES</p>
        <style jsx>{`
          .book-writer {
            position: relative;
            width: 120px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            perspective: 500px; /* Adds 3D depth */
          }
          .book {
            position: absolute;
            animation: pulseBook 4s infinite ease-in-out;
          }
          .book-shadow {
            position: absolute;
            top: 90px;
            left: 10px;
            width: 100px;
            height: 10px;
            background: rgba(0, 0, 0, 0.2);
            borderRadius: 50%;
            filter: blur(4px);
            animation: shadowPulse 4s infinite ease-in-out;
          }
          .pen {
            position: absolute;
            top: 40px;
            left: 20px;
            animation: scribble 1.2s infinite ease-in-out;
            z-index: 1;
          }
          .writing-line {
            position: absolute;
            top: 70px;
            left: 40px;
            height: 2px;
            background: linear-gradient(to right, #000000, transparent); /* Fading ink effect */
            width: 0;
            animation: growLine 1.2s infinite ease-in-out;
          }
          .loading-text {
            animation: fadeText 4s infinite ease-in-out;
          }
          @keyframes pulseBook {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          @keyframes shadowPulse {
            0%, 100% {
              transform: scaleX(1);
              opacity: 0.2;
            }
            50% {
              transform: scaleX(1.1);
              opacity: 0.3;
            }
          }
          @keyframes scribble {
            0% {
              transform: translateX(0) translateY(0) rotate(0deg);
            }
            25% {
              transform: translateX(20px) translateY(-5px) rotate(-15deg);
            }
            50% {
              transform: translateX(40px) translateY(0) rotate(0deg);
            }
            75% {
              transform: translateX(20px) translateY(5px) rotate(10deg);
            }
            100% {
              transform: translateX(0) translateY(0) rotate(0deg);
            }
          }
          @keyframes growLine {
            0% {
              width: 0;
            }
            50% {
              width: 40px;
            }
            100% {
              width: 0;
            }
          }
          @keyframes fadeText {
            0%, 100% {
              opacity: 0.7;
            }
            50% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Navbar loads only after iframe content is loaded */}
      {!loading && <Navbar />}

      {/* Loading effect while iframe is loading */}
      {loading && <BookWritingLoader />}

      {/* Iframe Section */}
      <div className="flex-1 mt-16 relative overflow-hidden">
        <div className="absolute top-[-100px] left-0 w-full h-full">
          <iframe
            src={`https://travel-diaries-m1e7.onrender.com/proxy?url=${encodeURIComponent(url)}`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
            width="100%"
            height="1000px"
            className="border-0 shadow-none rounded-none"
            title="Proxied Page"
            onLoad={handleLoad}
            style={{ border: "none", position: "relative", top: "-20px" }}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ProxyIframe;