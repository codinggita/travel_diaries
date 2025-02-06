import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageSection from "./assets/LandingPage/LandingPageSection";
import AuthPage from "./assets/Authentication/components/AuthPage";
import WelcomePage from './assets/Authentication/components/WelcomePage';
import Explore from "./assets/Export/Export";
// import Create from "./assets/Create/Create";
import Inspire from "./assets/Inspire/Inspire";
import Become_A_Member from "./assets/Become_A_Member/Become_A_Member";
import Journal_Tips from './assets/Create/Journal_tips/Journal_Tips';  
// import Section1 from './assets/Create/Journal_tips/Parts/Section1';
import RecipeBook from './assets/Create/Journal_tips/Parts/RecipeBook';
import BabyBook from './assets/Create/Journal_tips/Parts/BabyBook';
import TravelPrompts from './assets/Create/Journal_tips/Parts/TravelPrompts';
import JournalingBenefits from './assets/Create/Journal_tips/Parts/JournalingBenefits';
import TarveBlogGuide from './assets/Create/Journal_tips/Parts/TravelBlogGuide'
import BesttravelApps from './assets/Create/Journal_tips/Parts/BestTravelApps'
import HawaiiTravelPage from './assets/Export/Details/Hawai'



const App = () => {
  return (
    // <RecipeBook />
    <Routes>
      <Route path="/" element={<LandingPageSection />} />
      <Route path="/auth/register" element={<AuthPage />} />
      <Route path="/auth/login" element={<AuthPage />} />
      <Route path="/welcomepage" element={<WelcomePage />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/create" element={<Journal_Tips />} />
      <Route path="/inspire" element={<Inspire />} />
      <Route path="/membership" element={<Become_A_Member />} />
      <Route path="/create/recipe-book" element={<RecipeBook />} />
      <Route path="/create/pregnancy-diary" element={<BabyBook />} />
      <Route path="/create/travel-prompts" element={<TravelPrompts />} />
      <Route path="/create/journaling-benefits" element={<JournalingBenefits />} />
      <Route path="/create/travel-blog-guide" element={<TarveBlogGuide />} />
      <Route path="/create/best-travel-apps" element={<BesttravelApps />} />
      <Route path="/country/hawaii" element={<HawaiiTravelPage />} />

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