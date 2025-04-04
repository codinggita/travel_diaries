import React, { useState } from 'react';
import { auth } from '../Firebase/Firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../LandingPage/Images/travel-diaries-logo-footer.png';
import rightImage from '../../LandingPage/Images/auth-side.png';
import { FaGoogle } from 'react-icons/fa';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const registerUserInDB = async (userData) => {
    try {
      await axios.post("https://travel-diaries-m1e7.onrender.com/api/register", userData);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      localStorage.setItem('idToken', idToken);
      console.log('ID Token:', idToken);

      await registerUserInDB({
        username,
        email,
        password,
        authMethod: "email"
      });

      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/welcomepage");
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      localStorage.setItem('idToken', idToken);
      console.log('ID Token:', idToken);

      await registerUserInDB({
        username: user.displayName || "Google User",
        email: user.email,
        password: "GoogleAuth",
        authMethod: "google"
      });

      toast.success("Google login successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/welcomepage");
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-12">
        <img src={logo} alt="Logo" className="mb-6 w-24 md:w-32" />
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Register</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="p-2 border rounded w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="p-2 border rounded w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
            <button
              type="submit"
              className="bg-[#FAA41F] text-white p-2 rounded-3xl w-full hover:bg-[#f9a825] transition-colors mb-4"
            >
              Sign Up
            </button>
          </form>
          <div
            onClick={handleGoogleSignIn}
            className="mt-4 flex items-center justify-center bg-[#FAA41F] text-white p-2 rounded-3xl w-full hover:bg-[#f9a825] transition-colors cursor-pointer"
          >
            <FaGoogle className="w-6 h-6 mr-3" />
            <span>Sign Up with Google</span>
          </div>
          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-[#FAA41F] hover:underline font-medium"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>

      {/* Hide image on screens smaller than md (768px, ~51% of 1500px desktop width) */}
      <div className="hidden md:flex md:w-1/2 h-[750px] items-center justify-center p-12">
        <img
          src={rightImage}
          alt="Auth Section Image"
          className="object-cover w-full h-full"
        />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;