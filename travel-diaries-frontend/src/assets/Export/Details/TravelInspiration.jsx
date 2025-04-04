import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, Button } from "@mui/material";
import { IconContext } from "react-icons";
import { FaCalendarAlt, FaBus, FaLeaf, FaLanguage } from "react-icons/fa";
import Navbar from "../../LandingPage/Parts/Navbar";
import Footer from "../../LandingPage/Parts/Footer";
import BookIcon from '@mui/icons-material/Book';
import EditIcon from '@mui/icons-material/Edit';

const iconMapping = {
  calendar: <FaCalendarAlt />,
  bus: <FaBus />,
  leaf: <FaLeaf />,
  language: <FaLanguage />,
};

// Custom Loader Component: Enhanced "Book is Being Written"
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

export default function TravelInspiration() {
  const { location: locationId } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locationId) return;

    const fetchLocation = async () => {
      try {
        const response = await fetch(`https://travel-diaries-m1e7.onrender.com/api/countries/${locationId}`);
        const data = await response.json();
        setLocation(data);
      } catch (error) {
        console.error("Failed to fetch location data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [locationId]);

  if (loading) {
    return <BookWritingLoader />;
  }

  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">Location Not Found</h1>
        <p className="text-lg text-gray-600">The page is under construction</p>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-cover bg-center h-[700px] text-white"
        style={{ backgroundImage: `url('${location.hero.image}')` }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-6xl font-bold"
          >
            {location.hero.title}
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-2xl mt-4 px-6 text-center max-w-4xl"
          >
            {location.hero.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            {/* Add content here if needed */}
          </motion.div>
        </div>
      </motion.section>

      {/* Discover Section */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center">{location.discover.title}</h2>
        <p className="text-lg mt-6 text-gray-700 text-center max-w-4xl mx-auto">{location.discover.description}</p>
      </section>

      {/* Info Cards */}
      <section className="py-16 px-6 md:px-20 bg-gray-100">
        <h3 className="text-2xl font-bold mb-10 text-center">Essential Information</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {location.infoCards.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="shadow-md">
                <CardHeader
                  avatar={
                    <IconContext.Provider value={{ className: "text-4xl text-yellow-500" }}>
                      {iconMapping[info.icon]}
                    </IconContext.Provider>
                  }
                  title={info.title}
                  className="pb-0 font-semibold"
                />
                <CardContent className="text-gray-700">{info.description}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 px-6 md:px-20">
        <h3 className="text-2xl font-bold mb-10 text-center">Activities to Try</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {location.activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group overflow-hidden rounded-lg shadow-md"
            >
              <motion.img
                src={activity.image}
                alt={activity.title}
                className="w-full h-64 object-cover transition-transform group-hover:scale-105"
              />
              <motion.div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-center p-4"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <h4 className="text-xl font-bold">{activity.title}</h4>
                <p className="text-sm mt-2">{activity.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}