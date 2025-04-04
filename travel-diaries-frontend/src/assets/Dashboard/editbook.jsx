import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Button,
  IconButton,
  Grid,
  Typography,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaEye, FaUndo, FaRedo, FaAlignLeft, FaAlignCenter, FaAlignRight } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "../compo/newNav";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
          borderRadius: 50%;
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

function EditJournal() {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chapters, setChapters] = useState([]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(-1);
  const [currentChapter, setCurrentChapter] = useState({
    chapterName: "",
    story: "",
    images: [],
    chapterNameColor: "#000000",
    storyColor: "#000000",
    chapterNameAlign: "left",
    storyAlign: "left",
    chapterNameSize: "1.5rem",
    storySize: "1rem",
    collageLayout: "grid",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const quillRef = useRef(null);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to edit journals.");
          navigate("/login");
          return;
        }
        const response = await axios.get(
          `https://travel-diaries-m1e7.onrender.com/api/journals/${journalId}`,
          { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
        );
        const journalData = response.data;
        setJournal(journalData);
        setCoverImage(journalData.coverImage || null);
        const content = JSON.parse(journalData.content || "{}");
        const allImages = Array.isArray(journalData.images)
          ? journalData.images.map((img) => ({ url: img }))
          : [];
        let initialChapters = [];
        if (content.chapters && Array.isArray(content.chapters)) {
          initialChapters = content.chapters.map((chapter, index) => ({
            chapterName: chapter.chapterName || "",
            story: chapter.story || "",
            images: index === 0 ? allImages : [],
            chapterNameColor: chapter.chapterNameColor || "#000000",
            storyColor: chapter.storyColor || "#000000",
            chapterNameAlign: chapter.chapterNameAlign || "left",
            storyAlign: chapter.storyAlign || "left",
            chapterNameSize: chapter.chapterNameSize || "1.5rem",
            storySize: chapter.storySize || "1rem",
            collageLayout: chapter.collageLayout || "grid",
          }));
        } else {
          initialChapters = [
            {
              chapterName: content.chapterName || "",
              story: content.story || "",
              images: allImages,
              chapterNameColor: "#000000",
              storyColor: "#000000",
              chapterNameAlign: "left",
              storyAlign: "left",
              chapterNameSize: "1.5rem",
              storySize: "1rem",
              collageLayout: "grid",
            },
          ];
        }
        setChapters(initialChapters);
        if (initialChapters.length > 0) {
          setSelectedChapterIndex(0);
          setCurrentChapter({ ...initialChapters[0] });
          setHistory([initialChapters[0].story]);
          setHistoryIndex(0);
        }
      } catch (error) {
        setError(
          error.response
            ? `Error fetching journal: ${error.response.status} - ${error.response.data?.error || error.message}`
            : `Error fetching journal: ${error.message}`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchJournal();

    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "";
        toast.warn("You have unsaved changes! Reloading will discard them.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [journalId, navigate, hasUnsavedChanges]);

  const handleChapterChange = (field, value) => {
    const updatedChapter = { ...currentChapter, [field]: value };
    setCurrentChapter(updatedChapter);
    setHasUnsavedChanges(true);
    if (selectedChapterIndex !== -1) {
      updateChapter(selectedChapterIndex, { [field]: value });
    }
    if (field === "story" && !previewMode) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(value);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
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
    setHasUnsavedChanges(true);
    if (selectedChapterIndex !== -1) {
      updateChapter(selectedChapterIndex, { images: updatedImages });
    }
    setError("");
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImage(URL.createObjectURL(file));
      setHasUnsavedChanges(true);
    } else {
      setError("Please upload a valid image file for the cover.");
    }
  };

  const removeImage = (imageIndex) => {
    const updatedImages = currentChapter.images.filter((_, index) => index !== imageIndex);
    setCurrentChapter({ ...currentChapter, images: updatedImages });
    setHasUnsavedChanges(true);
    if (selectedChapterIndex !== -1) {
      updateChapter(selectedChapterIndex, { images: updatedImages });
    }
  };

  const updateChapter = (index, updates) => {
    const updatedChapters = [...chapters];
    updatedChapters[index] = { ...updatedChapters[index], ...updates };
    setChapters(updatedChapters);
  };

  const addChapter = () => {
    if (selectedChapterIndex === -1) {
      const newChapter = { ...currentChapter };
      setChapters([...chapters, newChapter]);
      setCurrentChapter({
        chapterName: "",
        story: "",
        images: [],
        chapterNameColor: "#000000",
        storyColor: "#000000",
        chapterNameAlign: "left",
        storyAlign: "left",
        chapterNameSize: "1.5rem",
        storySize: "1rem",
        collageLayout: "grid",
      });
      setHasUnsavedChanges(true);
      setSelectedChapterIndex(-1);
    } else {
      setSelectedChapterIndex(-1);
      setCurrentChapter({
        chapterName: "",
        story: "",
        images: [],
        chapterNameColor: "#000000",
        storyColor: "#000000",
        chapterNameAlign: "left",
        storyAlign: "left",
        chapterNameSize: "1.5rem",
        storySize: "1rem",
        collageLayout: "grid",
      });
    }
  };

  const deleteChapter = (index) => {
    if (chapters.length <= 1) {
      setError("Cannot delete the only chapter.");
      return;
    }
    const updatedChapters = chapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
    setHasUnsavedChanges(true);
    const newIndex = updatedChapters.length > 0 ? Math.min(selectedChapterIndex, updatedChapters.length - 1) : -1;
    setSelectedChapterIndex(newIndex);
    setCurrentChapter(
      newIndex === -1
        ? {
            chapterName: "",
            story: "",
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
      setHasUnsavedChanges(true);
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
      setHasUnsavedChanges(true);
      if (selectedChapterIndex !== -1) {
        updateChapter(selectedChapterIndex, { story: history[newIndex] });
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("title", journal?.title || "Untitled");
    if (coverImage && coverImage.startsWith("blob:")) {
      const response = await fetch(coverImage);
      const blob = await response.blob();
      formData.append("coverImage", blob, "cover.jpg");
    }
    const content = {
      chapters: chapters.map((chapter) => ({
        chapterName: chapter.chapterName || "",
        story: chapter.story || "",
        chapterNameColor: chapter.chapterNameColor,
        storyColor: chapter.storyColor,
        chapterNameAlign: chapter.chapterNameAlign,
        storyAlign: chapter.storyAlign,
        chapterNameSize: chapter.chapterNameSize,
        storySize: chapter.storySize,
        collageLayout: chapter.collageLayout,
        images: chapter.images.map((img) => ({ url: img.url || "" })),
      })),
    };
    formData.append("content", JSON.stringify(content));

    chapters.forEach((chapter) => {
      const newImages = chapter.images.filter((img) => img.file);
      newImages.forEach((img) => formData.append("images", img.file));
    });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to save changes.");
        navigate("/login");
        return;
      }
      const response = await axios.put(
        `https://travel-diaries-m1e7.onrender.com/api/journals/${journalId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }, timeout: 10000 }
      );
      toast.success("Changes saved successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setHasUnsavedChanges(false);
      navigate("/dashboard"); // Already navigating to /dashboard
    } catch (error) {
      setError(
        error.response
          ? `Error updating journal: ${error.response.status} - ${error.response.data?.error || error.message}`
          : `Error updating journal: ${error.message}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderImages = () => {
    switch (currentChapter.collageLayout) {
      case "grid":
        return (
          <Grid container spacing={1} sx={{ overflowY: "auto", maxHeight: { xs: "calc(100vh - 14rem)", md: "calc(100vh - 16rem)" } }}>
            {currentChapter.images.map((image, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <div className="relative">
                  <img src={image.preview || image.url} alt={`Upload ${index}`} className="w-full h-20 object-cover rounded-md" />
                  <IconButton
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white"
                    size="small"
                  >
                    <FaTrash size={8} />
                  </IconButton>
                </div>
              </Grid>
            ))}
          </Grid>
        );
      case "masonry":
        return (
          <div className="columns-2 sm:columns-3 gap-2" style={{ overflowY: "auto", maxHeight: { xs: "calc(100vh - 14rem)", md: "calc(100vh - 16rem)" } }}>
            {currentChapter.images.map((image, index) => (
              <div key={index} className="mb-2 break-inside-avoid">
                <div className="relative">
                  <img src={image.preview || image.url} alt={`Upload ${index}`} className="w-full object-cover rounded-md" />
                  <IconButton
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white"
                    size="small"
                  >
                    <FaTrash size={8} />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        );
      case "stacked":
        return (
          <div className="flex flex-col space-y-2" style={{ overflowY: "auto", maxHeight: { xs: "calc(100vh - 14rem)", md: "calc(100vh - 16rem)" } }}>
            {currentChapter.images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.preview || image.url} alt={`Upload ${index}`} className="w-full h-24 object-cover rounded-md" />
                <IconButton
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white"
                  size="small"
                >
                  <FaTrash size={8} />
                </IconButton>
              </div>
            ))}
          </div>
        );
      case "two-column":
        return (
          <Grid container spacing={1} sx={{ overflowY: "auto", maxHeight: { xs: "calc(100vh - 14rem)", md: "calc(100vh - 16rem)" } }}>
            {currentChapter.images.map((image, index) => (
              <Grid item xs={6} key={index}>
                <div className="relative">
                  <img src={image.preview || image.url} alt={`Upload ${index}`} className="w-full h-24 object-cover rounded-md" />
                  <IconButton
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white"
                    size="small"
                  >
                    <FaTrash size={8} />
                  </IconButton>
                </div>
              </Grid>
            ))}
          </Grid>
        );
      case "carousel":
        return (
          <div className="flex overflow-x-auto space-x-2" style={{ overflowY: "auto", maxHeight: { xs: "calc(100vh - 14rem)", md: "calc(100vh - 16rem)" } }}>
            {currentChapter.images.map((image, index) => (
              <div key={index} className="relative flex-shrink-0 w-40">
                <img src={image.preview || image.url} alt={`Upload ${index}`} className="w-full h-24 object-cover rounded-md" />
                <IconButton
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white"
                  size="small"
                >
                  <FaTrash size={8} />
                </IconButton>
              </div>
            ))}
          </div>
        );
      case "diagonal":
        return (
          <div className="flex flex-col space-y-2" style={{ overflowY: "auto", maxHeight: { xs: "calc(100vh - 14rem)", md: "calc(100vh - 16rem)" } }}>
            {currentChapter.images.map((image, index) => (
              <div key={index} className="relative" style={{ marginLeft: `${index * 10}px` }}>
                <img src={image.preview || image.url} alt={`Upload ${index}`} className="w-3/4 h-24 object-cover rounded-md" />
                <IconButton
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white"
                  size="small"
                >
                  <FaTrash size={8} />
                </IconButton>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <BookWritingLoader />;
  }

  // Show loader during save operation
  if (isSaving) {
    return <BookWritingLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4">
      <Navbar />
      {/* Top Header Section */}
      <div className="w-full bg-white p-4 shadow-md flex flex-col md:flex-row items-center justify-between mb-4 mt-20 space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-24 h-32 bg-gray-200 rounded-md overflow-hidden">
            {coverImage ? (
              <img src={coverImage} alt="Book Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">No Cover</div>
            )}
            <Button variant="contained" component="label" size="small" sx={{ mt: 1, backgroundColor: "#FAA41F" }}>
              Upload Cover
              <input type="file" hidden accept="image/*" onChange={handleCoverImageUpload} />
            </Button>
          </div>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {journal?.title || "Untitled"}
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
          <div className="w-full md:w-1/2 p-4 flex flex-col bg-gray-50 border-r border-gray-200">
            <TextField
              fullWidth
              label="Chapter Name"
              value={currentChapter.chapterName}
              onChange={(e) => handleChapterChange("chapterName", e.target.value)}
              variant="standard"
              sx={{
                mb: 2,
                input: { fontSize: currentChapter.chapterNameSize, color: currentChapter.chapterNameColor, textAlign: currentChapter.chapterNameAlign },
              }}
            />
            {previewMode ? (
              <div
                className="p-4 rounded-md overflow-auto"
                style={{
                  color: currentChapter.storyColor,
                  fontSize: currentChapter.storySize,
                  textAlign: currentChapter.storyAlign,
                  minHeight: "200px",
                }}
                dangerouslySetInnerHTML={{ __html: currentChapter.story }}
              />
            ) : (
              <ReactQuill
                ref={quillRef}
                value={currentChapter.story}
                onChange={(value) => handleChapterChange("story", value)}
                theme="snow"
                style={{ flexGrow: 1, color: currentChapter.storyColor, fontSize: currentChapter.storySize }}
              />
            )}
          </div>
          <div className="w-full md:w-1/2 p-4 flex flex-col bg-white">
            <div className="flex justify-between mb-4">
              <Button
                variant="contained"
                component="label"
                sx={{ backgroundColor: "#FAA41F", "&:hover": { backgroundColor: "#e59400" } }}
              >
                Upload Images
                <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
              </Button>
              <IconButton onClick={() => setPreviewMode(!previewMode)} sx={{ color: "#FAA41F" }}>
                <FaEye size={20} />
              </IconButton>
            </div>
            <div className="flex-grow overflow-y-auto" style={{ maxHeight: { xs: "calc(100vh - 14rem)", md: "calc(100vh - 16rem)" } }}>
              {renderImages()}
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard")}
                sx={{ borderColor: "#FAA41F", color: "#FAA41F" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
                sx={{ backgroundColor: "#FAA41F" }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default EditJournal;