import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../compo/newNav";
import {
  Card,
  Typography,
  IconButton,
  Box,
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
      // Do not set loading false here; wait for journals to load
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchJournals = async () => {
      if (!user) {
        setError("Please log in to view your diaries.");
        setLoading(false); // Set loading false if no user
        return;
      }

      try {
        setLoading(true); // Ensure loading is true while fetching
        const token = await user.getIdToken();
        console.log("Fetching journals with Token:", token);
        const response = await api.get("/api/journals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Journals fetched for user", user.email, ":", response.data);
        const userJournals = response.data.filter(
          (journal) => journal.username === user.email
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
          (journal) => journal.username === user.email
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

  // Skeleton Card Component
  const SkeletonCard = () => (
    <Box
      sx={{
        width: { xs: "100%", md: "16rem" }, // w-full md:w-64
        height: "20rem", // h-80
        bgcolor: "grey.200",
        borderRadius: "0.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        animation: "pulse 1.5s infinite",
        "@keyframes pulse": {
          "0%": { opacity: 1 },
          "50%": { opacity: 0.6 },
          "100%": { opacity: 1 },
        },
      }}
    >
      {/* Cover Image Placeholder */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "grey.300",
        }}
      />
      {/* Title Placeholder */}
      <Box
        sx={{
          position: "absolute",
          top: "75%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "75%",
          height: "2.5rem",
          bgcolor: "grey.400",
          borderRadius: "0.25rem",
        }}
      />
      {/* Buttons Placeholder */}
      <Box
        sx={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <Box sx={{ width: "2rem", height: "2rem", bgcolor: "grey.400", borderRadius: "50%" }} />
        <Box sx={{ width: "2rem", height: "2rem", bgcolor: "grey.400", borderRadius: "50%" }} />
        <Box sx={{ width: "2rem", height: "2rem", bgcolor: "grey.400", borderRadius: "50%" }} />
      </Box>
    </Box>
  );

  console.log("Dashboard - Rendering with loading:", loading, "user:", user?.email || "unknown");
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "grey.100", mt: "5rem" }}>
      <Navbar />
      <Box sx={{ flex: 1, p: 4 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, flexWrap: "wrap", gap: 8 }}>
          {/* Start a New Diary Card - Always Visible */}
          <Card
            sx={{
              width: { xs: "100%", md: "16rem" }, // w-full md:w-64
              height: "20rem", // h-80
              bgcolor: "white",
              boxShadow: 3,
              borderRadius: "0.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": { boxShadow: 6 },
              transition: "box-shadow 0.3s",
            }}
            onClick={() => navigate("/dashboard/create-diary")}
          >
            <FaPlus className="text-4xl text-[#FAA41F] mb-4" />
            <Typography variant="h6" sx={{ color: "grey.700" }}>
              Start a new diary
            </Typography>
          </Card>

          {/* Journals or Skeleton Cards */}
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : journals.length > 0 ? (
            journals.map((journal) => (
              <Card
                key={journal.journalId}
                sx={{
                  width: { xs: "100%", md: "16rem" },
                  height: "20rem",
                  bgcolor: "orange.700",
                  color: "white",
                  borderRadius: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {journal.coverImage ? (
                  <Box
                    component="img"
                    src={journal.coverImage}
                    alt={`${journal.title} Cover`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      inset: 0,
                    }}
                    onError={(e) => (e.target.src = "https://via.placeholder.com/256x320?text=Default+Cover")}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      bgcolor: "grey.600",
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6">No Cover</Typography>
                  </Box>
                )}
                {journal.title && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "85%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      bgcolor: "rgba(255, 255, 255, 0.8)",
                      p: 2,
                      borderRadius: "0.25rem",
                      color: "black",
                      fontWeight: "bold",
                      textAlign: "center",
                      width: "75%",
                    }}
                  >
                    {journal.title}
                  </Box>
                )}
                <Box sx={{ position: "absolute", top: "0.5rem", right: "0.5rem", display: "flex", gap: "0.5rem" }}>
                  <IconButton
                    onClick={() => handleEdit(journal)}
                    sx={{ color: "white", bgcolor: "rgba(255, 215, 0, 0.5)", "&:hover": { color: "grey.300" }, borderRadius: "50%" }}
                    aria-label="Edit"
                  >
                    <FaEdit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleShare(journal)}
                    sx={{ color: "white", bgcolor: "rgba(255, 215, 0, 0.5)", "&:hover": { color: "yellow.500" }, borderRadius: "50%" }}
                    aria-label="Share"
                  >
                    <FaShare />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(journal.journalId)}
                    sx={{ color: "white", bgcolor: "rgba(255, 215, 0, 0.5)", "&:hover": { color: "yellow.500" }, borderRadius: "50%" }}
                    aria-label="Delete"
                  >
                    <FaTrash />
                  </IconButton>
                </Box>
              </Card>
            ))
          ) : (
            <Typography variant="h6" sx={{ color: "grey.700" }}>
              {/* No diaries found for {user?.email || "unknown user"}. Start a new diary! */}
            </Typography>
          )}
        </Box>

        {error && !loading && (
          <Box
            sx={{
              position: "fixed",
              bottom: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: "yellow.500",
              color: "white",
              p: 2,
              borderRadius: "0.5rem",
            }}
          >
            {error}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard;