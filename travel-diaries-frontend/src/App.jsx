import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageSection from "./assets/LandingPage/LandingPageSection";
import AuthPage from "./assets/Authentication/components/AuthPage";
import WelcomePage from './assets/Authentication/components/WelcomePage';
import Explore from "./assets/Export/Export";
import Inspire from "./assets/Inspire/Inspire";
import Become_A_Member from "./assets/Become_A_Member/Become_A_Member";
import Journal_Tips from './assets/Create/Journal_tips/Journal_Tips';  
import RecipeBook from './assets/Create/Journal_tips/Parts/RecipeBook';
import BabyBook from './assets/Create/Journal_tips/Parts/BabyBook';
import TravelPrompts from './assets/Create/Journal_tips/Parts/TravelPrompts';
import JournalingBenefits from './assets/Create/Journal_tips/Parts/JournalingBenefits';
import TravelBlogGuide from './assets/Create/Journal_tips/Parts/TravelBlogGuide';
import BestTravelApps from './assets/Create/Journal_tips/Parts/BestTravelApps';
import TravelInspiration from './assets/Export/Details/TravelInspiration';
import Dashboard from './assets/Dashboard/Dashboard';
import Name from './assets/Dashboard/Name';


const App = () => {
  return (
    
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
        <Route path="/create/travel-blog-guide" element={<TravelBlogGuide />} />
        <Route path="/create/best-travel-apps" element={<BestTravelApps />} />
        <Route path="/explore/:location" element={<TravelInspiration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/start-diary" element={<Name />} />
      </Routes>
      // <Addcover />
      // <Fontselect/>
    
  );
};

export default App;
