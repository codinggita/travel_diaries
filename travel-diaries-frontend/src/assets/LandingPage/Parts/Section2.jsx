import React, { useState } from 'react';
import { Button } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import BookIcon from '@mui/icons-material/Book';
import Laptop from "../Images/laptop.jpeg";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { motion } from "framer-motion";

const Section2 = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <div className='bg-[#FAA41F] rounded-lg flex flex-row w-[1400px] justify-self-center justify-between '>
      <div className='flex flex-col gap-y-8 p-12'>
        <h1 className='text-white font-semibold'>#1 Travel Journal App</h1>
        <h1 className='font-bold text-7xl'>Your travel <br /> companion</h1>
        <p>Do you enjoy travelling, writing and capturing your journeys? Then <br /> Travel Diaries is your best travel companion. Be part of our community <br /> and take advantage of all our perks. Read other travel stories to get <br /> inspired and, if you like, share yours with the world.</p>
        <div className='flex flex-row gap-10'>
          <div className='flex flex-row'>
            <div className='flex flex-col justify-center'><PublicIcon /></div>
            <div><p>000 000<br />Users Worldwide</p></div>
          </div>
          <div className='flex flex-row'>
            <div className='flex flex-col justify-center'><BookIcon /></div>
            <div><p>000 000<br />Printed Books</p></div>
          </div>
        </div>
        <div className='flex flex-row gap-10'>
          <div className='flex flex-row'>
            <div className='flex flex-col justify-center'><PublicIcon /></div>
            <div><p>000 000<br />Users Worldwide</p></div>
          </div>
          <div className='flex flex-row'>
            <div className='flex flex-col justify-center'><BookIcon /></div>
            <div><p>000 000<br />Printed Books</p></div>
          </div>
        </div>
        <Button
          onClick={() => setClicked(true)}
          onAnimationEnd={() => setClicked(false)}
          sx={{
            color: "black",
            backgroundColor: "white",
            height: "50px",
            width: "350px",
            borderRadius: "30px",
            fontWeight: "bold",
            transition: "0.3s ease-in-out",
            "&:hover": { color: "#FAA41F", transform: "scale(1.05)" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Start your first travel diary
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
      <div>
        <img src={Laptop} alt="laptop" className='w-[700px] h-[680px] object-cover rounded-br-lg rounded-tr-lg' />
      </div>
    </div>
  );
};

export default Section2;
