import React, { useState } from 'react';
import MAIN from "../Images/herosection 1.png";
import MOBILE from "../Images/mobile.png";
import PublicIcon from '@mui/icons-material/Public';
import BookIcon from '@mui/icons-material/Book';
import { Button } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { motion } from "framer-motion";

const HeroSection = () => {
    const [clicked, setClicked] = useState(false);

    return (
        <div className='bg-[#FAA41F] flex flex-row justify-between'>
            <div className='flex flex-col gap-8 mt-24 ml-20'>
                <div className='flex flex-row justify-items-center'>
                    <h2 className='bg-[#FF593E] flex flex-col justify-center align-middle text-center text-xl h-10 w-28 rounded-3xl font-bold'>Explore</h2>
                    <h2 className='bg-[#FFBB48] flex flex-col justify-center align-middle text-center text-xl h-10 w-28 rounded-3xl font-bold'>Create</h2>
                    <h2 className='bg-[#933B1B] flex flex-col justify-center align-middle text-center text-xl h-10 w-28 rounded-3xl font-bold'>Inspire</h2>
                </div>
                <div>
                    <h1 className='font-black text-7xl'>#1 Travel<br />Journal App</h1>
                </div>
                <div>
                    <p className='font-medium'>Capture every moment of your travels in a personal<br />
                        journal, share your unique adventures with family and<br />
                        friends, and transform your cherished memories into <br />
                        beautifully printed books. Find companionship for your <br />
                        trips to ensure you never journey alone—making every <br />
                        adventure even better.</p>
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
                        height: ["50px"],
                        width: ["350px"],
                        borderRadius: "20px",
                        fontWeight: "bold",
                        transition: "0.3s",
                        "&:hover": { color: "#FAA41F" },
                        position: "relative",
                        overflow: "hidden"
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

            <div className='flex flex-col items-center justify-center relative'>
                <img src={MOBILE} alt="MOBILE" className='absolute top-40 left-0.5 transform -translate-x-1/2 h-[500px] hidden md:block' />
                <img src={MAIN} alt="Main" className='h-[790px] w-[790px]' />
            </div>
        </div>
    );
};

export default HeroSection;
