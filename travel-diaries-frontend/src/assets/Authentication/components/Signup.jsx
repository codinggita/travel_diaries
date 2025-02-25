import React, { useState } from 'react';
import { auth } from '../Firebase/Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; // Added Link from react-router-dom
import axios from 'axios';
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
      await axios.post("http://localhost:5000/api/register", userData);
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
      localStorage.setItem('idToken', idToken); // Store the token
      console.log('ID Token:', idToken);

      await registerUserInDB({
        username,
        email,
        password,
        authMethod: "email"
      });

      alert("Registration successful!");
      navigate("/welcomepage");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider(); // Note: GoogleAuthProvider needs to be imported
    try {
      const result = await signInWithPopup(auth, provider); // Note: signInWithPopup needs to be imported
      const user = result.user;
      const idToken = await user.getIdToken();
      localStorage.setItem('idToken', idToken); // Store the token
      console.log('ID Token:', idToken);

      await registerUserInDB({
        username: user.displayName || "Google User",
        email: user.email,
        password: "GoogleAuth",
        authMethod: "google"
      });

      alert("Google login successful!");
      navigate("/welcomepage");
    } catch (error) {
      alert(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen justify-self-center">
      <div className="w-1/2 flex flex-col items-start justify-center justify-self-center p-12">
        <img src={logo} alt="Logo" className="mb-6 w-24" />
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="text"
              placeholder="Username"
              className="p-2 border rounded mb-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded mb-2"
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
            <button type="submit" className="bg-[#FAA41F] cursor-pointer text-white p-2 rounded-3xl mb-4">
              Sign Up
            </button>
          </form>
          <div
            onClick={handleGoogleSignIn}
            className="mt-4 flex items-center justify-center bg-[#FAA41F] cursor-pointer text-white p-2 rounded-3xl w-full"
          >
            <FaGoogle className="w-6 h-6 mr-3" />
            <span>Sign Up with Google</span>
          </div>
          {/* Added Link to Login */}
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
      <div className="h-[750px] flex items-center justify-center p-12">
        <img src={rightImage} alt="Auth Section Image" className="object-cover w-full h-full" />
      </div>
    </div>
  );
}

export default Signup;