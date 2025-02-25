import React, { useState } from "react";
import { auth } from "../Firebase/Firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "../../LandingPage/Images/travel-diaries-logo-footer.png";
import rightImage from "../../LandingPage/Images/auth-side.png";
import { FaGoogle } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Initialize Google Auth Provider
  const googleProvider = new GoogleAuthProvider();

  // Email/Password Sign-In Handler
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      localStorage.setItem("token", idToken);
      console.log("Email login successful, token stored:", idToken);
      navigate("/dashboard", { replace: true });
      console.log("Navigation called");
      setTimeout(() => {
        console.log("Current path after 500ms:", window.location.pathname);
      }, 500);
    } catch (error) {
      alert(error.message);
      console.error("Email login error:", error.message);
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      localStorage.setItem("token", idToken);
      console.log("Google login successful, token stored:", idToken);
      navigate("/dashboard", { replace: true });
      console.log("Navigation called");
      setTimeout(() => {
        console.log("Current path after 500ms:", window.location.pathname);
      }, 500);
    } catch (error) {
      alert(error.message);
      console.error("Google login error:", error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen justify-self-center">
      <div className="w-1/2 flex flex-col items-start justify-center p-12">
        <img src={logo} alt="Logo" className="mb-6 w-24" />
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Log In</h2>
          <form onSubmit={handleEmailSubmit} className="flex flex-col">
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
            <button
              type="submit"
              className="bg-[#FAA41F] cursor-pointer text-white p-2 rounded-3xl mb-4"
            >
              Log In
            </button>
          </form>
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-[#FAA41F] border border-gray-300 text-gray-700 p-2 rounded-3xl mb-4 hover:bg-[#faa41f]"
          >
            <FaGoogle className="mr-2 text-white " />
            Sign in with Google
          </button>
          <button
            className="mt-4 text-[#FAA41F] cursor-pointer"
            onClick={() => navigate("/auth/register")}
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
      <div className="h-[750px] flex items-center justify-center p-12">
        <img
          src={rightImage}
          alt="Auth Section Image"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}

export default Login;