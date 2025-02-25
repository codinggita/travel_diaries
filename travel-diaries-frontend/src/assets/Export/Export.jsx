import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../LandingPage/Parts/Navbar";
import Footer from "../LandingPage/Parts/Footer";

const Explore = () => {
  const [selectedLocation, setSelectedLocation] = useState("India"); // Default to "India"

  const indiaStates = [
    {
      name: "Uttar Pradesh",
      cities: [
        "Agra", "Varanasi", "Lucknow", "Kanpur", "Prayagraj", "Ghaziabad", "Noida", "Meerut", "Aligarh", "Bareilly"
      ],
    },
    {
      name: "Tamil Nadu",
      cities: [
        "Chennai", "Madurai", "Coimbatore", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Dindigul"
      ],
    },
    {
      name: "Maharashtra",
      cities: [
        "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Solapur", "Kolhapur", "Amravati", "Jalgaon"
      ],
    },
    {
      name: "Karnataka",
      cities: [
        "Bengaluru", "Mysuru", "Mangalore", "Hubli", "Belagavi", "Davanagere", "Shimoga", "Tumkur", "Bijapur", "Udupi"
      ],
    },
    {
      name: "Rajasthan",
      cities: [
        "Jaipur", "Udaipur", "Jodhpur", "Kota", "Ajmer", "Bikaner", "Jaisalmer", "Pushkar", "Mount Abu", "Chittorgarh"
      ],
    },
    {
      name: "Goa",
      cities: [
        "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Calangute", "Anjuna", "Candolim", "Baga", "Colva"
      ],
    },
    {
      name: "Kerala",
      cities: [
        "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Kottayam", "Palakkad", "Malappuram", "Kasaragod"
      ],
    },
    {
      name: "West Bengal",
      cities: [
        "Kolkata", "Howrah", "Darjeeling", "Siliguri", "Asansol", "Durgapur", "Bardhaman", "Malda", "Haldia", "Jalpaiguri"
      ],
    },
    {
      name: "Gujarat",
      cities: [
        "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Jamnagar", "Bhavnagar", "Junagadh", "Anand", "Porbandar"
      ],
    },
    {
      name: "Delhi",
      cities: [
        "New Delhi", "South Delhi", "East Delhi", "West Delhi", "North Delhi", "Central Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad"
      ],
    },
  ];

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12 mt-15">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Explore India</h1>
        
        {/* Filter/Search Section (Optional Enhancement) */}
        <div className="mb-8 flex justify-center">
          
        </div>

        {/* States and Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {indiaStates.map((state) => (
            <div key={state.name} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{state.name}</h3>
              <div className="flex flex-wrap gap-2">
                {state.cities.map((city) => (
                  <Link
                    to={`/explore/${city.toLowerCase().replace(/\s+/g, "-")}`}
                    key={city}
                    onClick={() => setSelectedLocation(city)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-colors duration-200"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Explore;