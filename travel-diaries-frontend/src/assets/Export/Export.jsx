import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../LandingPage/Parts/Navbar";
import Footer from "../LandingPage/Parts/Footer";

const Explore = () => {
  const [selectedLocation, setSelectedLocation] = useState("World");

  const indiaStates = [
    { name: "Uttar Pradesh", cities: ["Agra", "Varanasi", "Lucknow", "Kanpur", "Prayagraj"] },
    { name: "Tamil Nadu", cities: ["Chennai", "Madurai", "Coimbatore", "Tiruchirappalli", "Salem"] },
    { name: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"] },
    { name: "Karnataka", cities: ["Bengaluru", "Mysuru", "Mangalore", "Hubli", "Belagavi"] },
    { name: "Rajasthan", cities: ["Jaipur", "Udaipur", "Jodhpur", "Kota", "Ajmer"] },
    { name: "Goa", cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"] }
  ];

  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${selectedLocation}`;

  return (
    <div className="font-sans">
      <Navbar />

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

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Explore</h2>
        {indiaStates.map((state) => (
          <div key={state.name} className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{state.name}</h3>
            <div className="flex flex-wrap gap-2">
              {state.cities.map((city) => (
                <Link
                  to={`/explore/${city.toLowerCase().replace(/\s+/g, "-")}`}
                  key={city}
                  onClick={() => setSelectedLocation(city)}
                  className="border px-3 py-1 rounded-full text-gray-700 hover:bg-yellow-500 hover:text-white"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Explore;