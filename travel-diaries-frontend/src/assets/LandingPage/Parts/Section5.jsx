import React, { useState } from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import pic5 from "../Images/Section5.png";

const Section5 = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <div className='flex flex-col items-center text-center gap-y-4'>
        <h1 className='text-5xl font-bold'>
          Made by travelers, for travelers
        </h1>
        <p className='font-medium max-w-3xl'>
          Join a network of fellow adventurers sharing their epic stories, inspiring journeys, 
          and unique tips, all in one place—where every traveler is both a storyteller and a listener.
        </p>
        <div>
            <img src={pic5} alt="" />
        </div>
        <Button
          onClick={() => setClicked(true)}
          onAnimationEnd={() => setClicked(false)}
          sx={{
            color: "black",
            backgroundColor: "#FAA41F",
            height: "50px",
            width: "250px",
            borderRadius: "30px",
            fontWeight: "bold",
            transition: "0.3s ease-in-out",
            "&:hover": { color: "white", transform: "scale(1.05)" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "10px"
          }}
        >
          Join our community
          <motion.div
            initial={{ x: 0, opacity: 1 }}
            animate={clicked ? { x: 50, opacity: 0 } : { x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="ml-2"
          >
            <KeyboardArrowRightIcon />
          </motion.div>
        </Button>
    </div>
  );
};

export default Section5;
