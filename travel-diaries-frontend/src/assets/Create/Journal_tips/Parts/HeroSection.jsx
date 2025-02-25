import React from 'react';
import backgroundimg from "../Images/bg2.png";

const HeroSection = () => {
  return (
    <div className="relative w-full">
      <img 
        src={backgroundimg} 
        alt="Hero Background" 
        className="w-full h-[700px] object-cover md:h-[600px] lg:h-[700px] brightness-75" 
      />
      <h1 className="absolute top-1/2 left-4 md:left-8 lg:left-12 transform -translate-y-1/2 text-4xl md:text-5xl lg:text-7xl text-white font-black drop-shadow-lg">
        JOURNALING
      </h1>
    </div>
  );
};

export default HeroSection;