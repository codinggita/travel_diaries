import React from 'react'
import Pic1 from "../Images/pic1.webp"
import CheckIcon from '@mui/icons-material/Check';

const Section1 = () => {
  return (
    <div className='flex flex-row justify-around p-4'>
        <div>
            <img src={Pic1} alt="" className='h-110 w-160'/>
        </div>
        <div className='flex flex-col gap-y-7 justify-center'>
            <h1 className='text-[#FAA41F] font-bold'>Easy to use</h1>
            <h1 className='font-bold text-7xl'>Create your travel<br />journal online</h1>
            <div className='flex flex-col gap-y-3'>
                <p className='font-medium'> <CheckIcon/> Easily add stories to your diary in our online editor or app. It looks like an actual book!</p>
                <p className='font-medium'><CheckIcon/> Add your images and choose your pages layouts.</p>
                <p className='font-medium'><CheckIcon/> Personalize your travel diary with fonts and styles to your own taste.</p>
                <p className='font-medium'><CheckIcon/> Enhance your diary with maps and empty boxes to paste your treasured mementos!</p>
            </div>
        </div>
    </div>
  )
};


export default Section1;