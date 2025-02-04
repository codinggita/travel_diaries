import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7s27Dk5vOXcsqWZ8rU6aVj2332tS77zQ",
  authDomain: "travel-diaries-2139.firebaseapp.com",
  projectId: "travel-diaries-2139",
  storageBucket: "travel-diaries-2139.firebasestorage.app",
  messagingSenderId: "872846843676",
  appId: "1:872846843676:web:64062c0a06dda3015924d9",
  measurementId: "G-5DW6BE0LR2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
