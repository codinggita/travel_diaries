import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../compo/newNav";
import {
  Card,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { FaPlus, FaEdit, FaShare, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../Authentication/Firebase/Firebase"; // Adjust path as needed
import { onAuthStateChanged } from "firebase/auth";

function Dashboard() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "https://travel-diaries-t6c5.onrender.com",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Dashboard - Auth State Changed - User:", currentUser);
      setUser(currentUser);
      setLoading(false); // Set loading false after user is resolved
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchJournals = async () => {
      if (!user) {
        setError("Please log in to view your diaries.");
        return;
      }

      try {
        const token = await user.getIdToken();
        console.log("Fetching journals with Token:", token);
        const response = await api.get("/api/journals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Journals fetched for user", user.email, ":", response.data);
        const userJournals = response.data.filter(
          journal => journal.username === user.email
        );
        setJournals(userJournals);
        if (response.data.length > 0 && userJournals.length === 0) {
          console.warn("Journals exist but none match user:", user.email);
          setError("No diaries found matching your account.");
        }
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        setError(`Error fetching journals: ${errorMsg}`);
        console.error("Fetch Error:", errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchJournals();
    }
  }, [user]);

  const handleDelete = async (journalId) => {
    if (!user) {
      setError("Please log in to delete a journal.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this journal?")) {
      try {
        const token = await user.getIdToken();
        await api.delete(`/api/journals/${journalId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const response = await api.get("/api/journals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Journals after delete for user", user.email, ":", response.data);
        const userJournals = response.data.filter(
          journal => journal.username === user.email
        );
        setJournals(userJournals);
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        setError(`Error deleting journal: ${errorMsg}`);
        console.error("Delete Error:", errorMsg);
      }
    }
  };

  const handleEdit = (journal) => {
    if (!user) {
      setError("Please log in to edit a journal.");
      return;
    }
    navigate(`/edit/${journal.journalId}`);
  };

  const handleShare = (journal) => {
    if (!user) {
      setError("Please log in to share a journal.");
      return;
    }
    alert(`Share this journal: ${journal.title} (ID: ${journal.journalId})`);
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="w-full md:w-64 h-80 bg-gray-200 rounded-lg animate-pulse flex flex-col items-center justify-center p-2 relative overflow-hidden">
      <div className="w-full h-full bg-gray-300 absolute inset-0" />
      <div className="relative w-3/4 h-10 bg-gray-400 rounded" />
      <div className="absolute top-2 right-2 flex space-x-2">
        <div className="w-8 h-8 bg-gray-400 rounded-full" />
        <div className="w-8 h-8 bg-gray-400 rounded-full" />
        <div className="w-8 h-8 bg-gray-400 rounded-full" />
      </div>
    </div>
  );

  if (loading) {
    console.log("Dashboard - Rendering loading state");
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center flex-1 p-4">
          <div className="flex flex-col md:flex-row flex-wrap gap-8">
            {/* Skeleton for "Start a new diary" card */}
            <Card
              className="w-full md:w-64 h-80 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => navigate("/dashboard/create-diary")}
            >
              <FaPlus className="text-4xl text-orange-500 mb-4" />
              <Typography variant="h6" className="text-gray-700">
                Start a new diary
              </Typography>
            </Card>
            {/* Skeleton cards for journals */}
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  console.log("Dashboard - Rendering main content for user:", user?.email || "unknown");
  return (
    <div className="flex flex-col min-h-screen mt-20 bg-gray-100">
      <Navbar />
      <div className="flex flex-1 p-4">
        <div className="flex flex-col md:flex-row flex-wrap gap-8">
          <Card
            className="w-full md:w-64 h-80 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate("/dashboard/create-diary")}
          >
            <FaPlus className="text-4xl text-[#FAA41F] mb-4" />
            <Typography variant="h6" className="text-gray-700">
              Start a new diary
            </Typography>
          </Card>

          {journals.length > 0 ? (
            journals.map((journal) => (
              <Card
                key={journal.journalId}
                className="w-full md:w-64 h-80 bg-orange-700 text-white rounded-lg flex flex-col items-center justify-center p-2 relative overflow-hidden"
              >
                {journal.coverImage ? (
                  <img
                    src={journal.coverImage}
                    alt={`${journal.title} Cover`}
                    className="w-full h-full object-cover absolute inset-0"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/256x320?text=Default+Cover")}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 absolute inset-0 flex items-center justify-center">
                    <Typography variant="h6">No Cover</Typography>
                  </div>
                )}
                {journal.title && (
                  <div className="absolute top-6/7 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded text-black text-xl font-bold text-center w-3/4">
                    {journal.title}
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <IconButton
                    onClick={() => handleEdit(journal)}
                    className="text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full"
                    aria-label="Edit"
                  >
                    <FaEdit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleShare(journal)}
                    className="text-white hover:text-yellow-500 bg-yellow-500 bg-opacity-50 rounded-full"
                    aria-label="Share"
                  >
                    <FaShare />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(journal.journalId)}
                    className="text-white hover:text-yellow-500 bg-yellow-500 bg-opacity-50 rounded-full"
                    aria-label="Delete"
                  >
                    <FaTrash />
                  </IconButton>
                </div>
              </Card>
            ))
          ) : (
            <Typography variant="h6" className="text-gray-700">
              {/* No diaries found for {user?.email || "unknown user"}. Start a new diary! */}
            </Typography>
          )}
        </div>

        {error && !loading && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white p-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;