import { useState } from "react";
import { auth } from "../Firebase/Firebase"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../LandingPage/Images/travel-diaries-logo-footer.png";
import rightImage from "../../LandingPage/Images/auth-side.png";
import { FaGoogle } from "react-icons/fa"; 

function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); 
  const [isRegistering, setIsRegistering] = useState(true);
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
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await registerUserInDB({ 
          username, 
          email, 
          password, 
          authMethod: "email"
        });

        alert("Registration successful!");
        navigate("/welcomepage"); 
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        navigate("/welcomepage"); 
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await registerUserInDB({ 
        username: user.displayName || "Google User", 
        email: user.email, 
        password: "GoogleAuth", 
        authMethod: "google"
      });

      alert("Google login successful!");
      navigate("/LandingPageSection"); 
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleRegisterLogin = () => {
    setIsRegistering(!isRegistering);
    navigate(isRegistering ? "/auth/login" : "/auth/register");
  };

  return (
    <div className="flex min-h-screen justify-self-center">
      <div className="w-1/2 flex flex-col items-start justify-center justify-self-center p-12">
        <img src={logo} alt="Logo" className="mb-6 w-24" />
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isRegistering ? "Register" : "Login"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            {isRegistering && (
              <input
                type="text"
                placeholder="Username"
                className="p-2 border rounded mb-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-2 border rounded mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="bg-[#FAA41F] cursor-pointer text-white p-2 rounded-3xl mb-4">
              {isRegistering ? "Sign Up" : "Log In"}
            </button>
          </form>
          <button className="mt-4 text-[#FAA41F] cursor-pointer" onClick={toggleRegisterLogin}>
            {isRegistering ? "Already have an account? Log in" : "Don't have an account? Register"}
          </button>
          <div
            onClick={handleGoogleSignIn}
            className="mt-4 flex items-center justify-center bg-[#FAA41F] cursor-pointer text-white p-2 rounded-3xl w-full"
          >
            <FaGoogle className="w-6 h-6 mr-3" /> 
            <span>{isRegistering ? "Sign Up with Google" : "Sign In with Google"}</span>
          </div>
        </div>
      </div>
      <div className="h-[750px] flex items-center justify-center p-12">
        <img src={rightImage} alt="Auth Section Image" className="object-cover w-full h-full" />
      </div>
    </div>
  );
}

export default AuthPage;
