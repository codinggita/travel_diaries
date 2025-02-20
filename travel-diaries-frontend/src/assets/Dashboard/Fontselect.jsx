import React, { useState, useRef } from 'react';
import { Button, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Navbar from '../LandingPage/Parts/Navbar';
import one from './Images/BLue.jpg';
import two from './Images/Graceful.jpg';
import three from './Images/Handwriting.jpg';
import four from './Images/Marcellus.jpg';
import five from './Images/Oregano.jpg';
import six from './Images/Parisienne.jpg';
import seven from './Images/Playful.jpg';
import eight from './Images/Sleek.jpg';
import nine from './Images/Standard.jpg';
import ten from './Images/Typewriter.jpg';

const CreateJournalPage = () => {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const scrollContainerRef = useRef(null);

  const styles = [
    { id: 1, name: 'Classic White', image: one },
    { id: 2, name: 'Modern Black', image: two },
    { id: 3, name: 'Elegant Blue', image: three },
    { id: 4, name: 'Vintage Paper', image: four },
    { id: 5, name: 'Rustic Red', image: five },
    { id: 6, name: 'Minimalist Gray', image: six },
    { id: 7, name: 'Nature Green', image: seven },
    { id: 8, name: 'Soft Pink', image: eight },
    { id: 9, name: 'Royal Purple', image: nine },
    { id: 10, name: 'Sunny Yellow', image: ten },
  ];

  const handleSelectStyle = (id) => {
    setSelectedStyle(id);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-20 relative">
      {/* Header */}
      <Navbar />

      {/* Body */}
      <div className="flex-1 flex flex-col items-center text-center px-6 py-12">
        <h1 className="text-5xl font-bold mb-4">Select a style for your journal</h1>
        <p className="text-gray-600 text-xl mb-12">
          Unsure what to pick? No worries, you can change your journal style anytime, ideally during your first 3
          chapters to avoid missplaced elements.
        </p>

        <div className="flex items-center mb-12 gap-12">
          <IconButton onClick={scrollLeft} sx={{ color: '#FAA41F' }}>
            <ArrowBackIos />
          </IconButton>
          <div
            ref={scrollContainerRef}
            className="flex gap-12 overflow-x-auto scrollbar-hide no-scrollbar py-4"
            style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none', maxWidth: '1024px' }}
          >
            {styles.map((style) => (
              <div
                key={style.id}
                className={`border-4 rounded-2xl cursor-pointer transition-transform duration-300 overflow-hidden relative flex-shrink-0 w-56 h-80 flex items-center justify-center ${
                  selectedStyle === style.id ? 'border-[#FAA41F] scale-110 shadow-xl' : 'border-gray-300'
                }`}
                onClick={() => handleSelectStyle(style.id)}
              >
                <img src={style.image} alt={style.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <IconButton onClick={scrollRight} sx={{ color: '#FAA41F' }}>
            <ArrowForwardIos />
          </IconButton>
        </div>

        <div className="w-full flex justify-between px-12 absolute bottom-8">
          <span className="text-[#FAA41F] text-2xl cursor-pointer">Style gallery</span>
          <div className="flex gap-8">
            <Button variant="text" sx={{ color: '#757575', fontSize: '1.5rem' }}>Skip</Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#FAA41F', '&:hover': { backgroundColor: '#e6951c' }, fontSize: '1.5rem' }}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJournalPage;
