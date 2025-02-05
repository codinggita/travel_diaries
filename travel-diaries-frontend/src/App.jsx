import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageSection from "./assets/LandingPage/LandingPageSection";
import AuthPage from "./assets/Authentication/components/AuthPage";
import WelcomePage from './assets/Authentication/components/WelcomePage';
import Explore from "./assets/Export/Export";
import Create from "./assets/Create/Create";
import Inspire from "./assets/Inspire/Inspire";
import Become_A_Member from "./assets/Become_A_Member/Become_A_Member";
import Journal_Tips from './assets/Create/Journal_tips/Journal_Tips';  0  
import Section1 from './assets/Create/Journal_tips/Parts/Section1';


const App = () => {
  return (
    // <Section1 />
    <Routes>
      <Route path="/" element={<LandingPageSection />} />
      <Route path="/auth/register" element={<AuthPage />} />
      <Route path="/auth/login" element={<AuthPage />} />
      <Route path="/welcomepage" element={<WelcomePage />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/create" element={<Journal_Tips />} />
      <Route path="/inspire" element={<Inspire />} />
      <Route path="/membership" element={<Become_A_Member />} />
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