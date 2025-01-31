import React from 'react';
import LOGO from "../Images/travel-diaries-logo.png";

const Navbar = () => {
  return (
    <div className='flex flex-row'>
        <img src={LOGO} alt="Travel Diaries" height={12} className="p-4 h-20" />
    </div>
  );
};

export default Navbar;
