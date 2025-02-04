import React from 'react';
import demo from "../../LandingPage/Images/welcome.png";
import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const WelcomePage = () => {
  const [clicked, setClicked] = React.useState(false);

  return (
    <div className='flex flex-col justify-self-center p-12 gap-y-4'>
      <div>
        <img src={demo} alt="" />
      </div>
      <h1 className='flex flex-row justify-center text-5xl font-bold'>WELCOME!</h1>
      <p className='flex flex-row justify-center font-medium text-center'>
        Great news! Your account has now been activated, So you can start <br />
        immortalising your (travel) adventures in your first diary right away. Download <br />
        our mobile app or continue on the web application. Switch easily between<br />
        devices at any time by using the login option ’Google’. Happy writing!
      </p>
      <div className='flex justify-center'>
        <Button
          onClick={() => setClicked(true)}
          onAnimationEnd={() => setClicked(false)}
          sx={{
            color: "black",
            backgroundColor: "#FAA41F",
            height: "50px",
            width: "350px",
            borderRadius: "30px",
            fontWeight: "bold",
            transition: "0.3s ease-in-out",
            "&:hover": { color: "white", transform: "scale(1.05)" },
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
    </div>
  );
};

export default WelcomePage;
