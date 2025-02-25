import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import one from "../Images/one.png";
import two from "../Images/two.png";
import three from "../Images/three.png";
import four from "../Images/four.png";
import five from "../Images/five.png";
import six from "../Images/six.png";

const Section1 = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  const handleButtonClick = () => {
    setClicked(true);
    setTimeout(() => navigate("/learn-more"), 600); // Delayed navigation
  };

  const items = [
    { img: one, text: "Recipe book: Create your \n own cookbook", link: "/create/recipe-book" },
    { img: two, text: "Create your pregnancy \n diary or baby journal", link: "/create/pregnancy-diary" },
    { img: three, text: "Best travel journal \n prompts you can use", link: "/create/travel-prompts" },
    { img: four, text: "The many benefits of \n journaling", link: "/create/journaling-benefits" },
    { img: five, text: "How to start a travel blog: \n A step-by-step guide", link: "/create/travel-blog-guide" },
    { img: six, text: "Best travel \n apps", link: "/create/best-travel-apps" },
  ];

  return (
    <div className="flex flex-col items-center gap-y-8 pt-20 px-4 md:px-8 lg:px-12">
      {/* Grid for items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:text-[#FAA41F] cursor-pointer"
            onClick={() => navigate(item.link)}
          >
            <img src={item.img} alt={item.text} className="w-full max-w-[300px] rounded-lg object-cover" />
            <p className="font-medium text-lg md:text-xl mt-3 whitespace-pre-line text-gray-800">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Start Travel Diary Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-8">
        <Button
          onClick={handleButtonClick}
          onAnimationEnd={() => setClicked(false)}
          sx={{
            color: "#FAA41F",
            height: "50px",
            width: "150px",
            borderRadius: "30px",
            fontWeight: "bold",
            transition: "0.3s ease-in-out",
            "&:hover": { color: "#FAA41F", transform: "scale(1.05)" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Learn More
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
  );
};

export default Section1;