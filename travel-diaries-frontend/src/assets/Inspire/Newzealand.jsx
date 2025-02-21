import React, { useState } from "react";
import Navbar from '../LandingPage/Parts/Navbar'

const ProxyIframe = () => {
  const [url, setUrl] = useState("https://www.traveldiariesapp.com/en/diary/6154188d-ff65-4cba-bd38-811feed65e90/chapter/43ddbaed-f12e-4262-b929-eeaa3ce15fa0"); // Default URL to embed
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <Navbar />

      {loading && (
        <div className="absolute bg-white bg-opacity-75 inset-0 flex justify-center items-center z-10">
          <div className="loader">Loading...</div>
        </div>
      )}

      <div className="flex-1 mt-16 relative overflow-hidden">
        <div className="absolute top-[-100px] left-0 w-full h-full">
          <iframe
            src={`https://travel-diaries-t6c5.onrender.com/proxy?url=${encodeURIComponent(url)}`} 
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
            width="100%"
            height="1000px"
            className="border-0 shadow-none rounded-none"
            title="Proxied Page"
            onLoad={handleLoad}
            style={{ border: "none", position: "relative", top: "-20px" }}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ProxyIframe;
