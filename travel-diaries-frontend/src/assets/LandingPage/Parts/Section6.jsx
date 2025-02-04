import React, { useState } from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import inspire from "../Images/inspire.png";

const Section6 = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <div className='pt-12'>
        <div className='flex flex-row bg-[#FFDF97] w-[1300px] h-[525px] justify-between rounded-3xl justify-self-center p-6'>
      <div className='flex flex-col gap-y-5 p-4 justify-center'>
        <h1 className='text-5xl font-bold'>
          Start your travel <br /> journal adventure!
        </h1>
        <p className='font-medium'>
          Travel Diaries is the application that allows you to capture your travels <br />
          in a digital diary. Add stories, photos, and maps in an online editor. It is <br />
          designed in a way that it looks like you're working in a real book. <br />
          Customize your diary to your own taste with different layouts and style <br />
          options!
        </p>
        <Button
          onClick={() => setClicked(true)}
          onAnimationEnd={() => setClicked(false)}
          sx={{
            color: "black",
            backgroundColor: "#933B1B",
            height: "50px",
            width: "250px",
            borderRadius: "30px",
            fontWeight: "bold",
            transition: "0.3s ease-in-out",
            "&:hover": { color: "white", transform: "scale(1.05)" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Get started for free
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
        <img src={inspire} alt="Inspire Travel" className='h-[500px]' />
      </div>
    </div>
    </div>
  );
};

export default Section6;
