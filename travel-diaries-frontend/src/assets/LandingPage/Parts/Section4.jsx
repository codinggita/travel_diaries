import React, { useState } from "react";
import pic2 from "../Images/Section4.webp";
import { Button } from "@mui/material"; 
import { motion } from "framer-motion";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const Section4 = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="flex flex-row justify-center">
      <div className="flex flex-col gap-y-8 p-12">
        <h1 className="text-[#FAA41F] font-semibold">Your memories forever safe</h1>
        <h1 className="font-bold text-7xl">
          Transform your
          <br />
          adventure into a
          <br /> travel book
        </h1>
        <p>
          Back home? Transform your unforgettable travel memories into tangible
          <br />
          keepsakes! Print a beautifully crafted book of your travel adventures with Travel
          <br />
          Diaries. Relive every moment, from picturesque landscapes to thrilling
          <br />
          escapades, in stunning detail. Just as you imagined!
        </p>
        <div>
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
            Print your travel book
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
      <div>
        <img src={pic2} alt="Travel Book" className="h-140 w-160 p-4 " />
      </div>
    </div>
  );
};

export default Section4;
