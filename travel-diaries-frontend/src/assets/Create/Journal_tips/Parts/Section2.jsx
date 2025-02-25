import React, { useState } from 'react';
import { Button } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import BookIcon from '@mui/icons-material/Book';
import Laptop from "../Images/laptop.jpeg";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';  
import seven from "../Images/seven.png";

const Section2 = () => {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();  

  const handleButtonClick = () => {
    setClicked(true);
    setTimeout(() => {
      navigate("/auth/register");  
    }, 500);  
  };

  return ( 
    <div className="container mx-auto px-4 py-12 md:px-8 lg:px-12">
      <div className="bg-[#FAA41F] rounded-lg flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col gap-y-8 p-4 md:p-12 w-full">
          <h1 className="text-white font-semibold text-lg md:text-xl"> #1 Travel Journal App</h1>
          <h1 className="font-bold text-3xl md:text-5xl lg:text-7xl text-white">Your travel <br /> companion</h1>
          <p className="text-white text-base md:text-lg leading-relaxed">Do you enjoy travelling, writing, and capturing your journeys? Then Travel Diaries is your best travel companion. Be part of our community and take advantage of all our perks. Read other travel stories to get inspired and, if you like, share yours with the world.</p>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col justify-center"><PublicIcon className="text-white" /></div>
              <div><p className="text-white text-sm md:text-base">000 000<br />Users Worldwide</p></div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col justify-center"><BookIcon className="text-white" /></div>
              <div><p className="text-white text-sm md:text-base">000 000<br />Printed Books</p></div>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full flex justify-center md:justify-start">
            <Button
              onClick={handleButtonClick}  
              onAnimationEnd={() => setClicked(false)}
              sx={{
                color: "black",
                backgroundColor: "white",
                height: "50px",
                width: "250px",
                borderRadius: "30px",
                fontWeight: "bold",
                transition: "0.3s ease-in-out",
                "&:hover": { color: "#FAA41F", transform: "scale(1.05)" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Get Started For Free
              <motion.div
                initial={{ x: 0, opacity: 1 }}
                animate={clicked ? { x: 50, opacity: 0 } : { x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="ml-2"
              >
                <KeyboardArrowRightIcon />
              </motion.div>
            </Button>
          </motion.div>
        </div>
        {/* Hide image on screens smaller than custom breakpoint (1200px) */}
        <div className="w-full md:w-1/2 p-4 md:p-0 hidden lg:flex">
          <img 
            src={Laptop} 
            alt="Laptop" 
            className="w-full h-auto max-w-[700px] rounded-br-lg rounded-tr-lg object-cover md:h-[680px]" 
          />
        </div>
      </div>
    </div>
  );
};

export default Section2;