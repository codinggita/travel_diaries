import React from 'react';
import Navbar from './Parts/Navbar';
import HeroSection from './Parts/HeroSection';
import Section1 from './Parts/Section1';
import Section2 from './Parts/Section2';
import Section3 from './Parts/Section3';
import Section4 from './Parts/Section4';
import Section5 from './Parts/Section5';
import Section6 from './Parts/Section6';
import Footer from './Parts/Footer';



const LandingPageSection = () => {
  return (
    <div className="pt-18"> 
      <Navbar />
      <HeroSection />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6/>
      <Footer/>




    </div>
  );
};

export default LandingPageSection;
