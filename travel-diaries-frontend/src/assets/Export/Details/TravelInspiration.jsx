import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { locationsData } from "./location";
import { FaArrowRight } from "react-icons/fa";
import Navbar from "../../LandingPage/Parts/Navbar";
import Footer from "../../LandingPage/Parts/Footer";

const TravelInspiration = () => {
  const { location } = useParams();
  const data = locationsData[location] || locationsData.hawaii;

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div 
        className="relative h-[400px] bg-cover bg-center flex items-center justify-center text-white text-center px-6"
        style={{ backgroundImage: `url(${data.heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <Typography variant="h2" className="font-bold text-white">
            {data.title}
          </Typography>
          <Typography variant="body1" className="mt-2 max-w-2xl text-lg">
            {data.description}
          </Typography>
        </div>
      </div>

      {/* Travel Stories Section */}
      <div className="container mx-auto py-10 px-4">
        <Typography variant="h4" className="font-semibold text-gray-800 mb-6">
          Travel Stories
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.stories.map((story) => (
            <Card key={story.id} className="shadow-lg rounded-lg overflow-hidden">
              <CardMedia component="img" height="200" image={story.image} alt={story.title} />
              <CardContent>
                <Typography variant="h5" className="font-semibold">
                  {story.title}
                </Typography>
                <Typography variant="body2" className="text-gray-600 mt-2">
                  {story.description}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  className="mt-4 flex items-center gap-2"
                >
                  Read More <FaArrowRight />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TravelInspiration;
