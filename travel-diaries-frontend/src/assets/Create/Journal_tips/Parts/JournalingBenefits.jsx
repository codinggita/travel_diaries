import React, { useState } from "react";
import Navbar from '../../../LandingPage/Parts/Navbar'

const ProxyIframe = () => {
  const [url, setUrl] = useState("https://www.traveldiariesapp.com/en/travel-inspiration/journaling/benefits-of-journaling"); // Default URL to embed
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false); // Hide loading state and allow Navbar to render once iframe content is loaded
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Navbar loads only after iframe content is loaded */}
      {!loading && <Navbar />}

      {/* Loading spinner while iframe is loading */}
      {loading && (
        <div className="absolute bg-white bg-opacity-75 inset-0 flex justify-center items-center z-10">
          <div className="loader">Loading...</div>
        </div>
      )}

      {/* Iframe Section */}
      <div className="flex-1 mt-16 relative overflow-hidden">
        <div className="absolute top-[-100px] left-0 w-full h-full"> {/* Adjust -100px to hide more or less */}
          <iframe
            src={`https://travel-diaries-t6c5.onrender.com/proxy?url=${encodeURIComponent(url)}`}
            width="100%"
            height="1000px"  // Set height larger to push content up
            className="border-0 shadow-none rounded-none"
            title="Proxied Page"
            onLoad={handleLoad} // Fires when the iframe content is fully loaded
            style={{ border: "none", position: "relative", top: "-20px" }} // Moves iframe content up
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ProxyIframe;