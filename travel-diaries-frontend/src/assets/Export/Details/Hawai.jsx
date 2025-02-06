import React from 'react';
import Navbar from '../../LandingPage/Parts/Navbar';
import Footer from '../../LandingPage/Parts/Footer';
import { Link } from 'react-router-dom';

const HawaiiTravelPage = () => {
  return (
    <div className="font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="p-6">
        {/* Hero Section */}
        <section className="relative bg-cover bg-center h-[60vh]" style={{ backgroundImage: "url('/path-to-hawaii-hero-image.jpg')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl text-white font-bold">Explore Hawaii</h1>
          </div>
        </section>

        {/* Travel Inspiration Section */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Travel Inspiration</h2>
          <p className="mb-6 text-gray-700">
            From breathtaking beaches to lush green valleys and unique cultural experiences, Hawaii offers an unforgettable journey. Discover why this paradise is a dream destination for travelers from around the globe.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-100 rounded-lg p-4 shadow-md">
              <h3 className="text-xl font-semibold mb-2">The Beaches of Hawaii</h3>
              <p className="text-gray-700">
                Dive into crystal-clear waters and enjoy world-famous beaches like Waikiki, Lanikai, and Kaanapali.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Cultural Experiences</h3>
              <p className="text-gray-700">
                Immerse yourself in Hawaiian culture by attending traditional luaus, exploring local art, and learning hula dancing.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Volcano Adventures</h3>
              <p className="text-gray-700">
                Visit Hawaii Volcanoes National Park and witness the awe-inspiring beauty of active volcanoes.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Outdoor Activities</h3>
              <p className="text-gray-700">
                Enjoy hiking, surfing, snorkeling, and more in Hawaii's stunning natural landscapes.
              </p>
            </div>
          </div>
        </section>

        {/* Explore More Section */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Explore More</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/travel-inspiration/united-states" className="border px-3 py-2 rounded-full text-gray-700 hover:bg-yellow-500 hover:text-white">
              United States
            </Link>
            <Link to="/travel-inspiration/north-america" className="border px-3 py-2 rounded-full text-gray-700 hover:bg-yellow-500 hover:text-white">
              North America
            </Link>
            <Link to="/travel-inspiration/beaches" className="border px-3 py-2 rounded-full text-gray-700 hover:bg-yellow-500 hover:text-white">
              Beaches
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HawaiiTravelPage;
