import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Button } from '@mui/material';
import logo from "../Images/travel-diaries-logo-footer.png"

const Footer = () => {
  return (
    <footer className="bg-white py-10 px-8 shadow-md">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-start">
            <img src={logo} alt="" />
          </div>
          <p className="text-gray-700 font-medium">Contact:</p>
          <div className="flex items-center gap-4 text-[#FAA41F] text-xl">
            <FaFacebookF className="hover:text-gray-600 cursor-pointer" />
            <FaInstagram className="hover:text-gray-600 cursor-pointer" />
            <FaTwitter className="hover:text-gray-600 cursor-pointer" />
            <FaLinkedinIn className="hover:text-gray-600 cursor-pointer" />
          </div>
          
        </div>

        
        <div>
          <h3 className="font-bold text-gray-800 mb-4">Travel guides</h3>
          <ul className="space-y-2 text-gray-600 cursor-pointer">
            <li>Delhi</li>
            <li>Kerala</li>
            <li>West Bengal</li>
            <li>Gujarat</li>
            <li>Goa</li>
            <li>Maharashtra</li>
          </ul>
        </div>

        
        <div>
          <h3 className="font-bold text-gray-800 mb-4">About Travel Diaries</h3>
          <ul className="space-y-2 text-gray-600 cursor-pointer">
            <li>Pricing</li>
            <li>FAQs</li>
            <li>About</li>
            <li>Partners</li>
            <li>Contact</li>
          </ul>
        </div>

       
        <div>
          <h3 className="font-bold text-gray-800 mb-4">Inspiration</h3>
          <ul className="space-y-2 text-gray-600 cursor-pointer">
            <li>Destinations</li>
            <li>Community</li>
            <li>Journaling tips</li>
            <li>Travel tips</li>
          </ul>
        </div>

        
        <div>
          <h3 className="font-bold text-gray-800 mb-4">Help with your diary</h3>
          <ul className="space-y-2 text-gray-600 cursor-pointer">
            <li>Create a printed travel book</li>
            <li>Create travel journal</li>
            <li>Create an online travel blog</li>
            <li>Create baby book</li>
            <li>Create recipe book</li>
          </ul>
        </div>
      </div>

      
      <div className="mt-10 border-t pt-6 flex justify-between items-center text-sm text-gray-600">
        <p>© 2025 Travel Diaries. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-800">Privacy Policy</a>
          <a href="#" className="hover:text-gray-800">Terms and Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
