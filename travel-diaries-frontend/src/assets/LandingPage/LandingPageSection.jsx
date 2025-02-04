import React from 'react';
import Navbar from './Parts/Navbar';
import HeroSection from './Parts/HeroSection';
import Section1 from './Parts/Section1';
import Section2 from './Parts/Section2';
import Section3 from './Parts/Section3';
import Section4 from './Parts/Section4';
import Section5 from './Parts/Section5';


const LandingPageSection = () => {
  return (
    <div className="pt-20"> 
      <Navbar />
      <HeroSection />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />



    </div>
  );
};

export default LandingPageSection;
