import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageSection from "./assets/LandingPage/LandingPageSection";
import AuthPage from "./assets/Authentication/components/AuthPage";
import Footer from "./assets/LandingPage/Parts/Footer"

const App = () => {
  return (
    // <Footer/>
    <Routes>
      <Route path="/" element={<LandingPageSection />} />
      <Route path="/auth/register" element={<AuthPage />} />
      <Route path="/auth/login" element={<AuthPage />} />
    </Routes>

  );
};

export default App;



// import React from 'react'
// import { Cloudinary } from '@cloudinary/url-gen';
// import { auto } from '@cloudinary/url-gen/actions/resize';
// import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
// import { AdvancedImage } from '@cloudinary/react';

// const App = () => {
//   const cld = new Cloudinary({ cloud: { cloudName: 'dsddldquo' } });
  
//   // Use this sample image or upload your own via the Media Explorer
//   const img = cld
//         .image('cld-sample-5')
//         .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
//         .quality('auto')
//         .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio

//   return (<AdvancedImage cldImg={img}/>);
// };
// ''
// export default App