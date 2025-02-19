import React from 'react';
import demo from "../../LandingPage/Images/welcome.png";
import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const WelcomePage = () => {
  const [clicked, setClicked] = React.useState(false);
  const [iframeBlocked, setIframeBlocked] = React.useState(false);

  const handleNavigate = () => {
    window.location.href = 'https://my.traveldiariesapp.com/en/dashboard';
  };

  // Optional: Check iframe loading error
  const handleIframeError = () => {
    setIframeBlocked(true);
  };

  return (
    <div className='flex flex-col justify-center items-center p-12 gap-y-6'>
      <div>
        <img src={demo} alt="Welcome" className='w-80 h-auto' />
      </div>
      <h1 className='text-5xl font-bold text-center'>WELCOME!</h1>
      <p className='text-center font-medium leading-7'>
        Great news! Your account has now been activated, so you can start <br />
        immortalising your (travel) adventures in your first diary right away. Download <br />
        our mobile app or continue on the web application. Switch easily between <br />
        devices at any time by using the login option ‘Google’. Happy writing!
      </p>

      {/* Button for Navigation */}
      <div className='flex justify-center'>
        <Button
          onClick={handleNavigate}
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

      {/* Iframe Section */}
      <div className='w-full max-w-4xl h-[600px] border border-gray-300 rounded-lg mt-6'>
        {iframeBlocked ? (
          <div className='h-full flex flex-col items-center justify-center bg-gray-100 text-center p-4'>
            <p className='text-red-600 font-semibold'>
              Embedding is not allowed for this page. Click the button above to visit the dashboard.
            </p>
          </div>
        ) : (
          <iframe
            src="https://my.traveldiariesapp.com/en/dashboard"
            width="100%"
            height="600px"
            frameBorder="0"
            allowFullScreen
            onError={handleIframeError}
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
