import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../compo/newNav";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { FaPlus, FaEdit, FaShare, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const username = "user123"; // Replace with actual auth logic (e.g., from context or localStorage)

  // Fetch journals for the specific user when the component mounts or after mutations
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://travel-diaries-t6c5.onrender.com/api/journals/user/${username}`
        );
        setJournals(response.data);
      } catch (error) {
        setError("Error fetching journals. Please try again.");
        console.error("Error fetching journals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, [username]); // Add username as a dependency

  // Handle Delete Journal
  const handleDelete = async (journalId) => {
    if (window.confirm("Are you sure you want to delete this journal?")) {
      try {
        await axios.delete(
          `https://travel-diaries-t6c5.onrender.com/api/journals/${journalId}`
        );
        const response = await axios.get(
          `https://travel-diaries-t6c5.onrender.com/api/journals/user/${username}`
        );
        setJournals(response.data);
      } catch (error) {
        setError("Error deleting journal. Please try again.");
        console.error("Error deleting journal:", error);
      }
    }
  };

  // Handle Edit Journal (navigate to edit page)
  const handleEdit = (journal) => {
    navigate(`/edit/${journal.journalId}`);
  };

  // Handle Share Journal (for now, just an alert; you can expand this)
  const handleShare = (journal) => {
    alert(`Share this journal: ${journal.title} (ID: ${journal.journalId})`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex justify-center items-center flex-1 p-4">
        <div className="flex flex-col md:flex-row flex-wrap gap-8">
          {/* Left Card (Start a New Diary) - Static */}
          <Card
            className="w-full md:w-64 h-80 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate("/dashboard/create-diary")} // Use navigate instead of window.location
          >
            <FaPlus className="text-4xl text-orange-500 mb-4" />
            <Typography variant="h6" className="text-gray-700">
              Start a new diary
            </Typography>
          </Card>

          {/* Dynamically Render Journals for the User */}
          {journals.length > 0 ? (
            journals.map((journal) => (
              <Card
                key={journal.journalId}
                className="w-full md:w-64 h-80 bg-orange-700 text-white rounded-lg flex flex-col items-center justify-center p-2 relative overflow-hidden"
              >
                {/* Book Cover Image or Placeholder */}
                {journal.coverImage ? (
                  <img
                    src={journal.coverImage}
                    alt={`${journal.title} Cover`}
                    className="w-full h-full object-cover absolute inset-0"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/256x320?text=Default+Cover";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 absolute inset-0 flex items-center justify-center">
                    <Typography variant="h6">No Cover</Typography>
                  </div>
                )}

                {/* Journal Title Centered */}
                {journal.title && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded text-black text-xl font-bold text-center w-3/4">
                    {journal.title}
                  </div>
                )}

                {/* Action Buttons/Icons */}
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
                    className="text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full"
                    aria-label="Share"
                  >
                    <FaShare />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(journal.journalId)}
                    className="text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full"
                    aria-label="Delete"
                  >
                    <FaTrash />
                  </IconButton>
                </div>
              </Card>
            ))
          ) : (
            <Typography variant="h6" className="text-gray-700">
              No diaries found for {username}.
            </Typography>
          )}
        </div>

        {error && !loading && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;