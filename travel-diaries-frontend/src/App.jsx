import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { auth } from "./assets/Authentication/Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import BookIcon from '@mui/icons-material/Book';
import EditIcon from '@mui/icons-material/Edit';
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

// Custom Loader Component: Enhanced "Book is Being Written"
const BookWritingLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="book-writer">
        <BookIcon sx={{ fontSize: 100, color: '#FAA41F' }} className="book" />
        <div className="book-shadow"></div>
        <EditIcon sx={{ fontSize: 40, color: '#000000' }} className="pen" />
        <div className="writing-line"></div>
      </div>
      <p className="mt-6 text-[#FAA41F] font-semibold text-xl tracking-wide loading-text">TRAVEL DIARIES</p>
      <style jsx>{`
        .book-writer {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 500px; /* Adds 3D depth */
        }
        .book {
          position: absolute;
          animation: pulseBook 4s infinite ease-in-out;
        }
        .book-shadow {
          position: absolute;
          top: 90px;
          left: 10px;
          width: 100px;
          height: 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 50%;
          filter: blur(4px);
          animation: shadowPulse 4s infinite ease-in-out;
        }
        .pen {
          position: absolute;
          top: 40px;
          left: 20px;
          animation: scribble 1.2s infinite ease-in-out;
          z-index: 1;
        }
        .writing-line {
          position: absolute;
          top: 70px;
          left: 40px;
          height: 2px;
          background: linear-gradient(to right, #000000, transparent); /* Fading ink effect */
          width: 0;
          animation: growLine 1.2s infinite ease-in-out;
        }
        .loading-text {
          animation: fadeText 4s infinite ease-in-out;
        }
        @keyframes pulseBook {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes shadowPulse {
          0%, 100% {
            transform: scaleX(1);
            opacity: 0.2;
          }
          50% {
            transform: scaleX(1.1);
            opacity: 0.3;
          }
        }
        @keyframes scribble {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          25% {
            transform: translateX(20px) translateY(-5px) rotate(-15deg);
          }
          50% {
            transform: translateX(40px) translateY(0) rotate(0deg);
          }
          75% {
            transform: translateX(20px) translateY(5px) rotate(10deg);
          }
          100% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
        }
        @keyframes growLine {
          0% {
            width: 0;
          }
          50% {
            width: 40px;
          }
          100% {
            width: 0;
          }
        }
        @keyframes fadeText {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const ProtectedRoute = ({ element, isAuthenticated }) => {
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/auth/login" replace />;
};

// Wrapper Component for Route Transitions
const RouteTransition = ({ children, isAuthenticated }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authResolved, setAuthResolved] = useState(false);

  // Initial auth check with 4-second minimum delay
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed - User:", user);
      setAuthResolved(true);
    });

    const timer = setTimeout(() => {
      if (authResolved) {
        setLoading(false);
      }
    }, 4000); // 4000ms = 4 seconds

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [authResolved]);

  // Trigger loading on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // 4 seconds delay on every route change

    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-run on route change

  if (loading || !authResolved) {
    return <BookWritingLoader />;
  }

  return children;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <RouteTransition isAuthenticated={isAuthenticated}>
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
    </RouteTransition>
  );
};

export default App;