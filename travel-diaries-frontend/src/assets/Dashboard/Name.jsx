import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  TextField,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Grid,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../compo/newNav";
import { auth } from "../Authentication/Firebase/Firebase"; // Adjust path as needed
import { onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaTrash, FaPlus, FaEye, FaUndo, FaRedo, FaAlignLeft, FaAlignCenter, FaAlignRight } from "react-icons/fa";
import BookIcon from '@mui/icons-material/Book';
import EditIcon from '@mui/icons-material/Edit';

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

function App() {
  const [step, setStep] = useState(1);
  const [journalTitle, setJournalTitle] = useState("");
  const [countries, setCountries] = useState([]);
  const [countryInput, setCountryInput] = useState("");
  const [skipDates, setSkipDates] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(-1);
  const [currentChapter, setCurrentChapter] = useState({
    chapterName: "",
    story: "",
    date: null,
    images: [],
    chapterNameColor: "#000000",
    storyColor: "#000000",
    chapterNameAlign: "left",
    storyAlign: "left",
    chapterNameSize: "1.5rem",
    storySize: "1rem",
    collageLayout: "grid",
  });
  const [openPreview, setOpenPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [initialLoading, setInitialLoading] = useState(true); // New state for initial loading
  const quillRef = useRef(null);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "https://travel-diaries-m1e7.onrender.com",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate("/auth/login");
      }
      // Set initial loading to false after 4 seconds
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 4000); // 4-second delay
      return () => clearTimeout(timer);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    return () => {
      currentChapter.images.forEach((image) => {
        if (image.preview) URL.revokeObjectURL(image.preview);
      });
      if (coverPhoto && typeof coverPhoto !== "string" && coverPhoto instanceof Blob) {
        URL.revokeObjectURL(URL.createObjectURL(coverPhoto));
      }
    };
  }, [currentChapter.images, coverPhoto]);

  const validateStep = () => {
    if (step === 1 && !journalTitle.trim()) {
      setError("Journal title is required.");
      return false;
    }
    if (step === 2 && !skipDates && countries.length === 0) {
      setError("Please add at least one country unless this diary is not about travelling.");
      return false;
    }
    if (step === 3 && startDate && endDate && dayjs(startDate).isAfter(endDate)) {
      setError("End date must be after start date.");
      return false;
    }
    if (step === 4 && !coverPhoto) {
      setError("Cover photo is required.");
      return false;
    }
    if (step === 6 && !chapters.length) {
      setError("Please add at least one chapter.");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step === 2 && skipDates) {
      setStep(4);
    } else if (step < 6) {
      setStep(step + 1);
    } else {
      setOpenPreview(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      if (step === 4 && skipDates) {
        setStep(2);
      } else {
        setStep(step - 1);
      }
    }
    setError("");
  };

  const handleCompleteDiary = async () => {
    if (!validateStep()) return;
    if (!user) {
      setError("Please log in to save your diary.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", journalTitle);
    formData.append("username", user.email);

    const structuredContent = JSON.stringify({
      chapters: chapters.map((chapter) => ({
        chapterName: chapter.chapterName,
        story: chapter.story,
        date: chapter.date ? chapter.date.toISOString() : null,
        images: chapter.images.map(() => true),
        chapterNameColor: chapter.chapterNameColor,
        storyColor: chapter.storyColor,
        chapterNameAlign: chapter.chapterNameAlign,
        storyAlign: chapter.storyAlign,
        chapterNameSize: chapter.chapterNameSize,
        storySize: chapter.storySize,
        collageLayout: chapter.collageLayout,
      })),
    });
    formData.append("content", structuredContent);
    formData.append("countries", JSON.stringify(countries));
    if (!skipDates) {
      formData.append("startDate", startDate ? startDate.toISOString() : "");
      formData.append("endDate", endDate ? endDate.toISOString() : "");
    }

    if (coverPhoto && coverPhoto instanceof Blob) {
      formData.append("coverImage", coverPhoto);
    }

    chapters.forEach((chapter) => {
      chapter.images.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });
    });

    try {
      const token = await user.getIdToken();
      const response = await api.post("/api/journals", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Your diary is saved!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setStep(1);
      resetForm();
      navigate("/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      setError(`Failed to create journal: ${errorMsg}`);
      console.error("Error creating journal:", errorMsg);
      toast.error(`Failed to save diary: ${errorMsg}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryInput = (e) => {
    if (e.key === "Enter" && countryInput.trim()) {
      setCountries((prev) => [...prev, countryInput.trim()]);
      setCountryInput("");
      setError("");
    }
  };

  const removeCountry = (index) => {
    setCountries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      setCoverPhoto(null);
    } else {
      setCoverPhoto(file);
      setError("");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      setError("Please upload only image files.");
      return;
    }
    const updatedImages = [
      ...currentChapter.images,
      ...validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ].slice(0, 16);
    setCurrentChapter({ ...currentChapter, images: updatedImages });
    if (selectedChapterIndex !== -1) {
      updateChapter(selectedChapterIndex, { images: updatedImages });
    }
    setError("");
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = currentChapter.images.filter((_, index) => index !== indexToRemove);
    updatedImages.forEach((image) => {
      if (image.preview && !chapters.some((chapter) => chapter.images.includes(image))) {
        URL.revokeObjectURL(image.preview);
      }
    });
    setCurrentChapter({ ...currentChapter, images: updatedImages });
    if (selectedChapterIndex !== -1) {
      updateChapter(selectedChapterIndex, { images: updatedImages });
    }
  };

  const handleChapterChange = (field, value) => {
    const updatedChapter = { ...currentChapter, [field]: value };
    setCurrentChapter(updatedChapter);
    if (selectedChapterIndex !== -1) {
      updateChapter(selectedChapterIndex, { [field]: value });
    }
    if (field === "story" && step === 6 && !openPreview) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(value);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const updateChapter = (index, updates) => {
    const updatedChapters = [...chapters];
    updatedChapters[index] = { ...updatedChapters[index], ...updates };
    setChapters(updatedChapters);
  };

  const addChapter = () => {
    if (!currentChapter.chapterName.trim() || !currentChapter.story.trim()) {
      setError("Chapter name and story are required.");
      return;
    }
    const newChapter = {
      chapterName: currentChapter.chapterName,
      story: currentChapter.story,
      date: currentChapter.date,
      images: currentChapter.images.map((image) => ({
        file: image.file || image,
        preview: image.preview || URL.createObjectURL(image),
      })),
      chapterNameColor: currentChapter.chapterNameColor,
      storyColor: currentChapter.storyColor,
      chapterNameAlign: currentChapter.chapterNameAlign,
      storyAlign: currentChapter.storyAlign,
      chapterNameSize: currentChapter.chapterNameSize,
      storySize: currentChapter.storySize,
      collageLayout: currentChapter.collageLayout,
    };
    setChapters([...chapters, newChapter]);
    setCurrentChapter({
      chapterName: "",
      story: "",
      date: null,
      images: [],
      chapterNameColor: "#000000",
      storyColor: "#000000",
      chapterNameAlign: "left",
      storyAlign: "left",
      chapterNameSize: "1.5rem",
      storySize: "1rem",
      collageLayout: "grid",
    });
    setSelectedChapterIndex(-1);
    setHistory([]);
    setHistoryIndex(-1);
    setError("");
  };

  const deleteChapter = (index) => {
    const updatedChapters = chapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
    const newIndex = updatedChapters.length > 0 ? Math.min(selectedChapterIndex, updatedChapters.length - 1) : -1;
    setSelectedChapterIndex(newIndex);
    setCurrentChapter(
      newIndex === -1
        ? {
            chapterName: "",
            story: "",
            date: null,
            images: [],
            chapterNameColor: "#000000",
            storyColor: "#000000",
            chapterNameAlign: "left",
            storyAlign: "left",
            chapterNameSize: "1.5rem",
            storySize: "1rem",
            collageLayout: "grid",
          }
        : { ...updatedChapters[newIndex] }
    );
    setHistory(newIndex === -1 ? [] : [updatedChapters[newIndex].story]);
    setHistoryIndex(newIndex === -1 ? -1 : 0);
  };

  const selectChapter = (index) => {
    setSelectedChapterIndex(index);
    setCurrentChapter({ ...chapters[index] });
    setHistory([chapters[index].story]);
    setHistoryIndex(0);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentChapter({ ...currentChapter, story: history[newIndex] });
      if (selectedChapterIndex !== -1) {
        updateChapter(selectedChapterIndex, { story: history[newIndex] });
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentChapter({ ...currentChapter, story: history[newIndex] });
      if (selectedChapterIndex !== -1) {
        updateChapter(selectedChapterIndex, { story: history[newIndex] });
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("Please log in to save your diary.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", journalTitle);
    formData.append("username", user.email);

    const structuredContent = JSON.stringify({
      chapters: chapters.map((chapter) => ({
        chapterName: chapter.chapterName,
        story: chapter.story,
        date: chapter.date ? chapter.date.toISOString() : null,
        images: chapter.images.map(() => true),
        chapterNameColor: chapter.chapterNameColor,
        storyColor: chapter.storyColor,
        chapterNameAlign: chapter.chapterNameAlign,
        storyAlign: chapter.storyAlign,
        chapterNameSize: chapter.chapterNameSize,
        storySize: chapter.storySize,
        collageLayout: chapter.collageLayout,
      })),
    });
    formData.append("content", structuredContent);
    formData.append("countries", JSON.stringify(countries));
    if (!skipDates) {
      formData.append("startDate", startDate ? startDate.toISOString() : "");
      formData.append("endDate", endDate ? endDate.toISOString() : "");
    }

    if (coverPhoto && coverPhoto instanceof Blob) {
      formData.append("coverImage", coverPhoto);
    }

    chapters.forEach((chapter) => {
      chapter.images.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });
    });

    try {
      const token = await user.getIdToken();
      const response = await api.post("/api/journals", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Diary saved successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setOpenPreview(false);
      setStep(1);
      resetForm();
      navigate("/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      setError(`Failed to create journal: ${errorMsg}`);
      console.error("Error creating journal:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setJournalTitle("");
    setCountries([]);
    setCountryInput("");
    setSkipDates(false);
    setStartDate(null);
    setEndDate(null);
    setCoverPhoto(null);
    setChapters([]);
    setCurrentChapter({
      chapterName: "",
      story: "",
      date: null,
      images: [],
      chapterNameColor: "#000000",
      storyColor: "#000000",
      chapterNameAlign: "left",
      storyAlign: "left",
      chapterNameSize: "1.5rem",
      storySize: "1rem",
      collageLayout: "grid",
    });
    setSelectedChapterIndex(-1);
    setHistory([]);
    setHistoryIndex(-1);
  };

  const renderImages = () => {
    switch (currentChapter.collageLayout) {
      case "grid":
        return (
          <Grid container spacing={2} sx={{ overflowY: "auto", maxHeight: "calc(100vh - 16rem)" }}>
            {currentChapter.images.map((image, index) => (
              <Grid item xs={3} key={index}>
                <div className="relative">
                  <img src={image.preview || image.url} alt={`Upload ${index}`} className="w-full h-24 object-cover rounded-md" />
                  <IconButton
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white"
                    size="small"
                  >
                    <FaTrash size={10} />
                  </IconButton>
                </div>
              </Grid>
            ))}
          </Grid>
        );
      case "masonry":
        return (
          <div className="columns-3 gap-2" style={{ overflowY: "auto", maxHeight: "calc(100vh - 16rem)" }}>
            {currentChapter.images.map((image, index) => (
              <div key={index} className="mb-2 break-inside-avoid">
                <div className="relative">
                  <img src={image.preview || image.url} alt={`Upload ${index}`} className="w-full object-cover rounded-md" />
                  <IconButton
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white"
                    size="small"
                  >
                    <FaTrash size={10} />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        );
      case "stacked":
        return (
          <div className="flex flex-col space-y-2" style={{ overflowY: "auto", maxHeight: "calc(100vh - 16rem)" }}>
            {currentChapter.images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.preview || image.url} alt={`Upload ${index}`} className="w-full h-32 object-cover rounded-md" />
                <IconButton
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white"
                  size="small"
                >
                  <FaTrash size={10} />
                </IconButton>
              </div>
            ))}
          </div>
        );
      case "two-column":
        return (
          <Grid container spacing={2} sx={{ overflowY: "auto", maxHeight: "calc(100vh - 16rem)" }}>
            {currentChapter.images.map((image, index) => (
              <Grid item xs={6} key={index}>
                <div className="relative">
                  <img src={image.preview || image.url} alt={`Upload ${index}`} className="w-full h-32 object-cover rounded-md" />
                  <IconButton
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white"
                    size="small"
                  >
                    <FaTrash size={10} />
                  </IconButton>
                </div>
              </Grid>
            ))}
          </Grid>
        );
      case "carousel":
        return (
          <div className="flex overflow-x-auto space-x-2" style={{ overflowY: "auto", maxHeight: "calc(100vh - 16rem)" }}>
            {currentChapter.images.map((image, index) => (
              <div key={index} className="relative flex-shrink-0 w-48">
                <img src={image.preview || image.url} alt={`Upload ${index}`} className="w-full h-32 object-cover rounded-md" />
                <IconButton
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white"
                  size="small"
                >
                  <FaTrash size={10} />
                </IconButton>
              </div>
            ))}
          </div>
        );
      case "diagonal":
        return (
          <div className="flex flex-col space-y-2" style={{ overflowY: "auto", maxHeight: "calc(100vh - 16rem)" }}>
            {currentChapter.images.map((image, index) => (
              <div key={index} className="relative" style={{ marginLeft: `${index * 20}px` }}>
                <img src={image.preview || image.url} alt={`Upload ${index}`} className="w-3/4 h-32 object-cover rounded-md" />
                <IconButton
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white"
                  size="small"
                >
                  <FaTrash size={10} />
                </IconButton>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Show loader during initial load
  if (initialLoading) {
    return <BookWritingLoader />;
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-bold mb-6 text-[#FAA41F]">Give a title to your journal</h2>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter journal title"
              value={journalTitle}
              onChange={(e) => setJournalTitle(e.target.value)}
              error={!!error && step === 1}
              helperText={step === 1 && error}
              className="max-w-md w-full"
              sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#FAA41F" } } }}
            />
            <p className="text-sm text-gray-500 mt-4">
              Note: emoticons are not available for printed books. We are working on it.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-6 text-[#FAA41F]">Which countries is it about?</h2>
            <FormControl fullWidth className="max-w-md w-full">
              <TextField
                variant="outlined"
                placeholder="Type country name and press Enter"
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
                onKeyDown={handleCountryInput}
                error={!!error && step === 2}
                helperText={step === 2 && error}
                disabled={skipDates}
                sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#FAA41F" } } }}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {countries.map((country, index) => (
                  <div
                    key={index}
                    className="bg-[#FAA41F] text-white px-3 py-1 rounded-full flex items-center"
                  >
                    {country}
                    <IconButton
                      size="small"
                      onClick={() => removeCountry(index)}
                      className="ml-2 text-white"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                ))}
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={skipDates}
                    onChange={(e) => {
                      setSkipDates(e.target.checked);
                      if (e.target.checked) setCountries([]);
                    }}
                    color="primary"
                  />
                }
                label="This diary is not about travelling"
                className="mt-4"
              />
            </FormControl>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-6 text-[#FAA41F]">Add your travel dates</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    className: "mb-4 max-w-md w-full",
                    sx: { "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#FAA41F" } } },
                  },
                }}
              />
              <DatePicker
                label="End date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    className: "mb-4 max-w-md w-full",
                    sx: { "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#FAA41F" } } },
                  },
                }}
              />
              {step === 3 && error && <p className="text-red-500 text-sm">{error}</p>}
            </LocalizationProvider>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-6 text-[#FAA41F]">Add cover photo</h2>
            <p className="text-sm text-gray-500 mb-4 max-w-md w-full text-center">
              Upload a landscape cover photo for your journal.
            </p>
            <div className="border-2 border-dashed border-[#FAA41F] p-6 text-center rounded-lg max-w-md w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4"
              />
              {error && step === 4 && <p className="text-red-500 text-sm">{error}</p>}
              {coverPhoto && (
                <img
                  src={typeof coverPhoto === "string" ? coverPhoto : URL.createObjectURL(coverPhoto)}
                  alt="Preview"
                  className="mt-4 max-h-32 mx-auto rounded"
                />
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-6 text-[#FAA41F]">Book Preview</h2>
            <div className="bg-[#FAA41F] w-64 h-80 rounded-lg relative overflow-hidden flex items-center justify-center text-white">
              {coverPhoto ? (
                <img
                  src={typeof coverPhoto === "string" ? coverPhoto : URL.createObjectURL(coverPhoto)}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                "No Cover Photo"
              )}
              {journalTitle && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded text-black text-xl font-bold">
                  {journalTitle}
                </div>
              )}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="min-h-screen bg-gray-100 flex flex-col p-4">
            <Navbar />
            {/* Top Header Section */}
            <div className="w-full bg-white p-4 shadow-md flex flex-col md:flex-row items-center justify-between mb-4 mt-16 space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="w-24 h-32 bg-gray-200 rounded-md overflow-hidden">
                  {coverPhoto ? (
                    <img
                      src={typeof coverPhoto === "string" ? coverPhoto : URL.createObjectURL(coverPhoto)}
                      alt="Book Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Cover</div>
                  )}
                  <Button variant="contained" component="label" size="small" sx={{ mt: 1, backgroundColor: "#FAA41F" }}>
                    Upload Cover
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                  </Button>
                </div>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {journalTitle || "Untitled"}
                </Typography>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <IconButton onClick={handleUndo} disabled={historyIndex <= 0} sx={{ color: "#FAA41F" }}>
                  <FaUndo />
                </IconButton>
                <IconButton onClick={handleRedo} disabled={historyIndex >= history.length - 1} sx={{ color: "#FAA41F" }}>
                  <FaRedo />
                </IconButton>
                <IconButton onClick={() => handleChapterChange("chapterNameAlign", "left")} sx={{ color: "#FAA41F" }}>
                  <FaAlignLeft />
                </IconButton>
                <IconButton onClick={() => handleChapterChange("chapterNameAlign", "center")} sx={{ color: "#FAA41F" }}>
                  <FaAlignCenter />
                </IconButton>
                <IconButton onClick={() => handleChapterChange("chapterNameAlign", "right")} sx={{ color: "#FAA41F" }}>
                  <FaAlignRight />
                </IconButton>
                <Select
                  value={currentChapter.chapterNameSize}
                  onChange={(e) => handleChapterChange("chapterNameSize", e.target.value)}
                  size="small"
                >
                  {["1rem", "1.25rem", "1.5rem", "2rem"].map((size) => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </Select>
                <input
                  type="color"
                  value={currentChapter.chapterNameColor}
                  onChange={(e) => handleChapterChange("chapterNameColor", e.target.value)}
                  title="Change Chapter Name Color"
                  className="w-8 h-8"
                />
                <input
                  type="color"
                  value={currentChapter.storyColor}
                  onChange={(e) => handleChapterChange("storyColor", e.target.value)}
                  title="Change Story Text Color"
                  className="w-8 h-8"
                />
                <Select
                  value={currentChapter.storySize}
                  onChange={(e) => handleChapterChange("storySize", e.target.value)}
                  size="small"
                >
                  {["0.8rem", "1rem", "1.2rem", "1.5rem"].map((size) => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </Select>
                <Select
                  value={currentChapter.collageLayout}
                  onChange={(e) => handleChapterChange("collageLayout", e.target.value)}
                  size="small"
                  renderValue={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                >
                  <MenuItem value="grid">
                    <div className="flex items-center">
                      <div className="grid grid-cols-2 gap-1 mr-2">
                        <div className="w-3 h-3 bg-gray-400"></div>
                        <div className="w-3 h-3 bg-gray-400"></div>
                        <div className="w-3 h-3 bg-gray-400"></div>
                        <div className="w-3 h-3 bg-gray-400"></div>
                      </div>
                      Grid
                    </div>
                  </MenuItem>
                  <MenuItem value="masonry">
                    <div className="flex items-center">
                      <div className="flex flex-col gap-1 mr-2">
                        <div className="w-4 h-6 bg-gray-400"></div>
                        <div className="w-4 h-4 bg-gray-400"></div>
                        <div className="w-4 h-5 bg-gray-400"></div>
                      </div>
                      Masonry
                    </div>
                  </MenuItem>
                  <MenuItem value="stacked">
                    <div className="flex items-center">
                      <div className="flex flex-col gap-1 mr-2">
                        <div className="w-6 h-2 bg-gray-400"></div>
                        <div className="w-6 h-2 bg-gray-400"></div>
                        <div className="w-6 h-2 bg-gray-400"></div>
                      </div>
                      Stacked
                    </div>
                  </MenuItem>
                  <MenuItem value="two-column">
                    <div className="flex items-center">
                      <div className="flex gap-1 mr-2">
                        <div className="w-3 h-6 bg-gray-400"></div>
                        <div className="w-3 h-6 bg-gray-400"></div>
                      </div>
                      Two-Column
                    </div>
                  </MenuItem>
                  <MenuItem value="carousel">
                    <div className="flex items-center">
                      <div className="flex gap-1 mr-2">
                        <div className="w-4 h-4 bg-gray-400"></div>
                        <div className="w-4 h-4 bg-gray-400 border-2 border-gray-600"></div>
                        <div className="w-4 h-4 bg-gray-400"></div>
                      </div>
                      Carousel
                    </div>
                  </MenuItem>
                  <MenuItem value="diagonal">
                    <div className="flex items-center">
                      <div className="flex flex-col mr-2" style={{ transform: "rotate(-15deg)" }}>
                        <div className="w-4 h-2 bg-gray-400 mb-1"></div>
                        <div className="w-4 h-2 bg-gray-400 ml-2 mb-1"></div>
                        <div className="w-4 h-2 bg-gray-400 ml-4"></div>
                      </div>
                      Diagonal
                    </div>
                  </MenuItem>
                </Select>
              </div>
            </div>

            <div className="flex flex-1 w-full">
              {/* Chapter List - Hidden on small screens */}
              <div className="hidden md:block w-80 bg-gray-200 p-4 rounded-l-lg shadow-md h-[calc(100vh-12rem)] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6" sx={{ color: "#FAA41F" }}>
                    Chapters ({chapters.length})
                  </Typography>
                  <IconButton onClick={addChapter} sx={{ color: "#FAA41F" }}>
                    <FaPlus size={16} />
                  </IconButton>
                </div>
                {error && step === 6 && <p className="text-red-500 text-sm mb-2">{error}</p>}
                {chapters.map((chapter, index) => (
                  <div
                    key={index}
                    onClick={() => selectChapter(index)}
                    className={`bg-white px-4 py-3 mb-2 rounded-md shadow-sm cursor-pointer ${
                      selectedChapterIndex === index ? "ring-2 ring-[#FAA41F]" : "ring-1 ring-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <Typography variant="subtitle2" className="font-semibold">
                        {chapter.chapterName || "Untitled Chapter"}
                      </Typography>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); deleteChapter(index); }}
                        sx={{ color: "red" }}
                      >
                        <FaTrash size={12} />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Editing Area */}
              <div className="flex-1 w-full bg-white rounded-r-lg md:rounded-l-lg shadow-md h-[calc(100vh-12rem)] overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-6 flex flex-col bg-gray-50 border-r border-gray-200">
                  <TextField
                    fullWidth
                    label="Chapter Name"
                    value={currentChapter.chapterName}
                    onChange={(e) => handleChapterChange("chapterName", e.target.value)}
                    variant="standard"
                    sx={{
                      mb: 2,
                      input: {
                        fontSize: currentChapter.chapterNameSize,
                        color: currentChapter.chapterNameColor,
                        textAlign: currentChapter.chapterNameAlign,
                      },
                    }}
                  />
                  <ReactQuill
                    ref={quillRef}
                    value={currentChapter.story}
                    onChange={(value) => handleChapterChange("story", value)}
                    theme="snow"
                    style={{ flexGrow: 1, color: currentChapter.storyColor, fontSize: currentChapter.storySize }}
                  />
                </div>
                {/* Image Upload and Display - Hidden on small screens */}
                <div className="hidden md:block w-1/2 p-6 flex flex-col bg-white">
                  <div className="flex justify-between mb-4">
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ backgroundColor: "#FAA41F", "&:hover": { backgroundColor: "#e59400" } }}
                    >
                      Upload Images
                      <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
                    </Button>
                    <IconButton onClick={() => setOpenPreview(true)} sx={{ color: "#FAA41F" }}>
                      <FaEye size={20} />
                    </IconButton>
                  </div>
                  <div className="flex-grow overflow-y-auto" style={{ maxHeight: "calc(100vh - 16rem)" }}>
                    {renderImages()}
                  </div>
                  <div className="flex justify-end space-x-4 mt-4">
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      sx={{ borderColor: "#FAA41F", color: "#FAA41F" }}
                    >
                      Back
                    </Button>
                    {/* <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={isLoading}
                      sx={{ backgroundColor: "#FAA41F" }}
                    >
                      Preview
                    </Button> */}
                    <Button
                      variant="contained"
                      onClick={handleCompleteDiary}
                      disabled={isLoading}
                      sx={{ backgroundColor: "#FAA41F", "&:hover": { backgroundColor: "#e59400" } }}
                    >
                      {isLoading ? <CircularProgress size={24} /> : "Complete Diary"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <ToastContainer />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {step !== 6 && <Navbar />}
      {step !== 6 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {renderStepContent()}
          <div className="w-full max-w-md mt-8 bg-gray-100 p-4 rounded-b-lg flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>{step} of 6</span>
              <span>Create journal</span>
            </div>
            <div className="w-full flex items-center space-x-2">
              <div className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-[#FAA41F]" : "bg-gray-300"}`} />
              <div className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-[#FAA41F]" : "bg-gray-300"}`} />
              <div className={`h-2 flex-1 rounded-full ${step >= 3 ? "bg-[#FAA41F]" : "bg-gray-300"}`} />
              <div className={`h-2 flex-1 rounded-full ${step >= 4 ? "bg-[#FAA41F]" : "bg-gray-300"}`} />
              <div className={`h-2 flex-1 rounded-full ${step >= 5 ? "bg-[#FAA41F]" : "bg-gray-300"}`} />
              <div className={`h-2 flex-1 rounded-full ${step >= 6 ? "bg-[#FAA41F]" : "bg-gray-300"}`} />
            </div>
            <div className="mt-4 flex justify-between w-full max-w-xs">
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={step === 1}
                sx={{ borderColor: "#FAA41F", color: "#FAA41F", "&:hover": { borderColor: "#e59400", backgroundColor: "#fff3e0" } }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isLoading}
                sx={{ backgroundColor: "#FAA41F", "&:hover": { backgroundColor: "#e59400" } }}
              >
                {step === 6 ? "Preview" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        renderStepContent()
      )}
      {step !== 6 && (
        <footer className="bg-gray-100 p-4 text-sm text-gray-600 text-center">
          <p>
            © 2025 Travel Diaries, All rights reserved -{" "}
            <a href="#" className="text-[#FAA41F] hover:underline">
              Privacy policy
            </a>{" "}
            -{" "}
            <a href="#" className="text-[#FAA41F] hover:underline">
              Terms and conditions
            </a>{" "}
            -{" "}
            <a href="#" className="text-[#FAA41F] hover:underline">
              User terms
            </a>{" "}
            -{" "}
            <a href="#" className="text-[#FAA41F] hover:underline">
              Frequently Asked Questions
            </a>{" "}
            -{" "}
            <a href="#" className="text-[#FAA41F] hover:underline">
              Contact us
            </a>
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="text-[#FAA41F] hover:text-[#e59400]">
              <span className="sr-only">Facebook</span>
              <span className="text-xl">f</span>
            </a>
            <a href="#" className="text-[#FAA41F] hover:text-[#e59400]">
              <span className="sr-only">Pinterest</span>
              <span className="text-xl">p</span>
            </a>
            <a href="#" className="text-[#FAA41F] hover:text-[#e59400]">
              <span className="sr-only">Twitter</span>
              <span className="text-xl">t</span>
            </a>
            <a href="#" className="text-[#FAA41F] hover:text-[#e59400]">
              <span className="sr-only">Instagram</span>
              <span className="text-xl">i</span>
            </a>
          </div>
        </footer>
      )}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)}>
        <DialogTitle sx={{ color: "#FAA41F" }}>Journal Preview</DialogTitle>
        <DialogContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-[#FAA41F] w-64 h-80 rounded-lg relative overflow-hidden">
              {coverPhoto ? (
                <img
                  src={typeof coverPhoto === "string" ? coverPhoto : URL.createObjectURL(coverPhoto)}
                  alt="Final Cover Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                "No Cover Photo"
              )}
              {journalTitle && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded text-black text-xl font-bold">
                  {journalTitle}
                </div>
              )}
            </div>
            <p>
              <strong>Title:</strong> {journalTitle || "Untitled"}
            </p>
            <p>
              <strong>Countries:</strong> {countries.join(", ") || "None"}
            </p>
            {!skipDates && (
              <p>
                <strong>Dates:</strong>{" "}
                {startDate ? dayjs(startDate).format("DD MMMM YYYY") : "Not set"} -{" "}
                {endDate ? dayjs(endDate).format("DD MMMM YYYY") : "Not set"}
              </p>
            )}
            <p>
              <strong>Chapters:</strong>
            </p>
            {chapters.map((chapter, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded-md w-full">
                <p>
                  <strong>Chapter {index + 1}:</strong> {chapter.chapterName}
                </p>
                <div
                  style={{
                    color: chapter.storyColor,
                    fontSize: chapter.storySize,
                    textAlign: chapter.storyAlign,
                  }}
                  dangerouslySetInnerHTML={{ __html: chapter.story }}
                />
                <p>
                  <strong>Images:</strong>
                </p>
                {renderImagesPreview(chapter.images, chapter.collageLayout)}
              </div>
            ))}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenPreview(false)}
            disabled={isLoading}
            sx={{ color: "#FAA41F" }}
          >
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{
              backgroundColor: "#FAA41F",
              color: "white",
              "&:hover": { backgroundColor: "#e59400" },
            }}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Submitting..." : "Submit Diary"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

  function renderImagesPreview(images, collageLayout) {
    switch (collageLayout) {
      case "grid":
        return (
          <Grid container spacing={1}>
            {images.map((image, imgIndex) => (
              <Grid item xs={4} key={imgIndex}>
                <img
                  src={image.preview}
                  alt={`Chapter Image ${imgIndex + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
              </Grid>
            ))}
          </Grid>
        );
      case "masonry":
        return (
          <div className="columns-2 sm:columns-3 gap-2">
            {images.map((image, imgIndex) => (
              <div key={imgIndex} className="mb-2 break-inside-avoid">
                <img
                  src={image.preview}
                  alt={`Chapter Image ${imgIndex + 1}`}
                  className="w-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        );
      case "stacked":
        return (
          <div className="flex flex-col space-y-2">
            {images.map((image, imgIndex) => (
              <div key={imgIndex}>
                <img
                  src={image.preview}
                  alt={`Chapter Image ${imgIndex + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        );
      case "two-column":
        return (
          <Grid container spacing={1}>
            {images.map((image, imgIndex) => (
              <Grid item xs={6} key={imgIndex}>
                <img
                  src={image.preview}
                  alt={`Chapter Image ${imgIndex + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
              </Grid>
            ))}
          </Grid>
        );
      case "carousel":
        return (
          <div className="flex overflow-x-auto space-x-2">
            {images.map((image, imgIndex) => (
              <div key={imgIndex} className="relative flex-shrink-0 w-40">
                <img
                  src={image.preview}
                  alt={`Chapter Image ${imgIndex + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        );
      case "diagonal":
        return (
          <div className="flex flex-col space-y-2">
            {images.map((image, imgIndex) => (
              <div key={imgIndex} className="relative" style={{ marginLeft: `${imgIndex * 20}px` }}>
                <img
                  src={image.preview}
                  alt={`Chapter Image ${imgIndex + 1}`}
                  className="w-3/4 h-24 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  }
}

export default App;