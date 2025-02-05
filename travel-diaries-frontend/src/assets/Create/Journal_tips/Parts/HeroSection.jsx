import React from 'react';
import backgroundimg from "../Images/bg2.png"

const HeroSection = () => {
  return (
    <div>
        <div>
            <img src={backgroundimg} alt="" className='w-full h-[700px]' />
            <h1 className='flex flex-row mt-[-100px] pl-4 text-7xl text-white font-black'>JOURNALING</h1>
        </div>
    </div>
  )
}

export default HeroSection;