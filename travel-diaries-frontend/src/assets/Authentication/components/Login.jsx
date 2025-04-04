import React, { useState } from "react";
import { auth } from "../Firebase/Firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../LandingPage/Images/travel-diaries-logo-footer.png";
import rightImage from "../../LandingPage/Images/auth-side.png";
import { FaGoogle } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      localStorage.setItem("token", idToken);
      console.log("Email login successful, token stored:", idToken);
      toast.success("Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.message);
      console.error("Email login error:", error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      localStorage.setItem("token", idToken);
      console.log("Google login successful, token stored:", idToken);
      toast.success("Google login successful!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.message);
      console.error("Google login error:", error.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Password reset email sent successfully!");
      setShowResetPopup(false);
      setResetEmail("");
    } catch (error) {
      toast.error(error.message);
      console.error("Password reset error:", error.message);
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
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Log In</h2>
          <form onSubmit={handleEmailSubmit} className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
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
              className="ml-35 mt-[-18px] text-[#FAA41F] text-sm w-full text-center"
              onClick={() => setShowResetPopup(true)}
            >
              Forgot Password?
            </button>
            <button
              type="submit"
              className="bg-[#FAA41F] text-white p-2 rounded-3xl w-full hover:bg-[#f9a825] transition-colors"
            >
              Log In
            </button>
          </form>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-[#FAA41F] border border-gray-300 text-gray-700 p-2 rounded-3xl hover:bg-[#f9a825] transition-colors mt-4"
          >
            <FaGoogle className="mr-2 text-white" />
            Sign in with Google
          </button>
          <button
            className="mt-4 text-[#FAA41F] text-center w-full"
            onClick={() => navigate("/auth/register")}
          >
            Don't have an account? Register
          </button>
        </div>
      </div>

      {/* Reset Password Popup */}
      {showResetPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Reset Password</h3>
            <form onSubmit={handlePasswordReset} className="flex flex-col space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 border rounded w-full"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowResetPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FAA41F] text-white rounded hover:bg-[#f9a825]"
                >
                  Send Reset Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="hidden md:flex md:w-1/2 h-[750px] items-center justify-center p-12">
        <img
          src={rightImage}
          alt="Auth Section Image"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Login;