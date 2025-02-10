import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import locations from "./location";
import { Card, CardContent, CardHeader } from "@mui/material";
import { IconContext } from "react-icons";
import { FaCalendarAlt, FaBus, FaLeaf, FaLanguage } from "react-icons/fa";
import { Button } from "@mui/material";
import Navbar from "../../LandingPage/Parts/Navbar";
import Footer from "../../LandingPage/Parts/Footer";

const iconMapping = {
  calendar: <FaCalendarAlt />,
  bus: <FaBus />,
  leaf: <FaLeaf />,
  language: <FaLanguage />,
};

export default function TravelInspiration() {
  const { location: locationId } = useParams();
  const location = locations.find((loc) => loc.id === locationId);

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

      {/* Hero Section - Animated */}
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
            <Button
              variant="contained"
              className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-lg rounded-lg"
            >
              {location.hero.buttonText}
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Discover Section */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center">
          {location.discover.title}
        </h2>
        <p className="text-lg mt-6 text-gray-700 text-center max-w-4xl mx-auto">
          {location.discover.description}
        </p>
      </section>

      {/* Info Cards - Animated */}
      <section className="py-16 px-6 md:px-20 bg-gray-100">
        <h3 className="text-2xl font-bold mb-10 text-center">
          Essential Information
        </h3>
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

      {/* Activities Section - Grid Layout with Hover Animation */}
      <section className="py-16 px-6 md:px-20">
        <h3 className="text-2xl font-bold mb-10 text-center">
          Activities to Try
        </h3>
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
