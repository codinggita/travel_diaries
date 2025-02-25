import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from "./assets/Authentication/Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { CircularProgress } from "@mui/material";
import LandingPageSection from "./assets/LandingPage/LandingPageSection";
import Signup from "./assets/Authentication/components/Signup";
import Login from "./assets/Authentication/components/Login";
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
import Albania from './assets/Inspire/Albania/Albania';
import Newzealand from './assets/Inspire/Newzealand';
import Egypt from './assets/Inspire/Egypt';
import Italy from './assets/Inspire/Italy';
import Portugal from './assets/Inspire/Portugal';
import Uk from './assets/Inspire/Uk';
import Editbook from './assets/Dashboard/editbook';
import FAQs from './assets/Become_A_Member/Faqs';
import EditJournal from './assets/Dashboard/editbook';

const ProtectedRoute = ({ element, isAuthenticated }) => {
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/auth/login" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed - User:", user);
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  console.log("Rendering App - isAuthenticated:", isAuthenticated);

  return (
    <Routes>
      <Route path="/" element={<LandingPageSection />} />
      <Route path="/auth/register" element={<Signup />} />
      <Route path="/auth/login" element={<Login />} />
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
      <Route
        path="/dashboard"
        element={<ProtectedRoute element={<Dashboard />} isAuthenticated={isAuthenticated} />}
      />
      <Route
        path="/dashboard/create-diary"
        element={<ProtectedRoute element={<Name />} isAuthenticated={isAuthenticated} />}
      />
      <Route path="/inspire/albania" element={<Albania />} />
      <Route path="/inspire/newzealand" element={<Newzealand />} />
      <Route path="/inspire/egypt" element={<Egypt />} />
      <Route path="/inspire/italy" element={<Italy />} />
      <Route path="/inspire/portugal" element={<Portugal />} />
      <Route path="/inspire/uk" element={<Uk />} />
      <Route
        path="/book"
        element={<ProtectedRoute element={<Editbook />} isAuthenticated={isAuthenticated} />}
      />
      <Route path="/faqs" element={<FAQs />} />
      <Route
        path="/edit/:journalId"
        element={<ProtectedRoute element={<EditJournal />} isAuthenticated={isAuthenticated} />}
      />
    </Routes>
  );
};

export default App;