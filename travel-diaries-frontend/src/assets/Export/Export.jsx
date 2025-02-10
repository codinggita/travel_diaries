import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from '../LandingPage/Parts/Navbar';
import Footer from '../LandingPage/Parts/Footer';

const Explore = () => {
  const [selectedLocation, setSelectedLocation] = useState("World");

  const continents = [
    { name: "North America", countries: ["Hawaii", "United States", "Canada", "Cuba"] },
    { name: "Central America", countries: ["Costa Rica", "Mexico", "Guatemala"] },
    { name: "Africa", countries: ["Tunisia", "Zanzibar", "Egypt", "Tanzania", "Mauritius", "South Africa", "Réunion Island", "Namibia", "Madagascar"] },
    { name: "Caribbean", countries: ["Curaçao", "Aruba", "Dominican Republic", "Bonaire"] },
    { name: "Europe", countries: ["Netherlands", "Scotland", "North Macedonia", "United Kingdom", "Greece", "Estonia", "England", "Spain", "Ireland", "Germany", "Morocco", "Luxembourg", "Romania", "Switzerland", "Czech Republic", "Malta", "Finland", "Denmark", "France", "Albania", "Iceland", "Slovenia", "Belgium", "Norway", "Portugal", "Italy", "Latvia", "Sweden", "Poland", "Austria"] },
    { name: "South America", countries: ["Peru", "Brazil", "Bolivia", "Colombia", "Chile", "Argentina"] },
    { name: "Oceania", countries: ["New Zealand", "Australia"] },
  ];

  // Google Maps Embed URL
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${selectedLocation}`;

  return (
    <div className="font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Google Maps Iframe */}
      <div className="w-full h-96">
        <iframe
          title="Google Maps"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={mapSrc}
        ></iframe>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Explore</h2>
        {continents.map((continent) => (
          <div key={continent.name} className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{continent.name}</h3>
            <div className="flex flex-wrap gap-2">
              {continent.countries.map((country) => (
                <Link
                to={`/explore/${country.toLowerCase().replace(/\s+/g, "-")}`}
                key={country}
                onClick={() => setSelectedLocation(country)}
                className="border px-3 py-1 rounded-full text-gray-700 hover:bg-yellow-500 hover:text-white"
              >
                {country}
              </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Explore;
