import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  IconButton,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash, FaPlus } from "react-icons/fa";
import Navbar from "../compo/newNav";

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
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        setLoading(true);
        console.log("Fetching journal with ID:", journalId);
        const response = await axios.get(
          `https://travel-diaries-t6c5.onrender.com/api/journals/${journalId}`,
          { timeout: 10000 }
        );
        console.log("Response data:", response.data);
        const journalData = response.data;
        setJournal(journalData);

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
          }));
        } else {
          initialChapters = [
            {
              chapterName: content.chapterName || "",
              story: content.story || "",
              images: allImages,
            },
          ];
        }
        setChapters(initialChapters);
        if (initialChapters.length > 0) {
          setSelectedChapterIndex(0);
          setCurrentChapter({ ...initialChapters[0] });
        }
      } catch (error) {
        console.error("Error details:", error.response?.data || error.message);
        setError(`Error fetching journal: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, [journalId]);

  const handleChapterChange = (field, value) => {
    const updatedChapter = { ...currentChapter, [field]: value };
    setCurrentChapter(updatedChapter);
    if (selectedChapterIndex !== -1) {
      updateChapter(selectedChapterIndex, { [field]: value });
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
    ].slice(0, 16); // Limit to 16 images (4x4 grid)
    setCurrentChapter({ ...currentChapter, images: updatedImages });
    if (selectedChapterIndex !== -1) {
      updateChapter(selectedChapterIndex, { images: updatedImages });
    }
    setError("");
  };

  const removeImage = (imageIndex) => {
    const updatedImages = currentChapter.images.filter((_, index) => index !== imageIndex);
    setCurrentChapter({ ...currentChapter, images: updatedImages });
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
      if (!currentChapter.chapterName.trim() || !currentChapter.story.trim()) {
        setError("Chapter name and story are required.");
        return;
      }
      const newChapter = {
        ...currentChapter,
        images: currentChapter.images.map((image) => ({
          file: image.file || image,
          preview: image.preview || image.url,
        })),
      };
      setChapters([...chapters, newChapter]);
      setCurrentChapter({ chapterName: "", story: "", images: [] });
      setSelectedChapterIndex(-1);
    } else {
      setSelectedChapterIndex(-1);
      setCurrentChapter({ chapterName: "", story: "", images: [] });
    }
    setError("");
  };

  const deleteChapter = (index) => {
    if (chapters.length <= 1) {
      setError("Cannot delete the only chapter.");
      return;
    }
    const updatedChapters = chapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
    const newIndex = updatedChapters.length > 0 ? Math.min(selectedChapterIndex, updatedChapters.length - 1) : -1;
    setSelectedChapterIndex(newIndex);
    setCurrentChapter(
      newIndex === -1
        ? { chapterName: "", story: "", images: [] }
        : { ...updatedChapters[newIndex] }
    );
  };

  const selectChapter = (index) => {
    setSelectedChapterIndex(index);
    setCurrentChapter({ ...chapters[index] });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("title", journal?.title || "Untitled");

    if (selectedChapterIndex === -1) {
      if (!currentChapter.chapterName.trim() || !currentChapter.story.trim()) {
        setError("Chapter name and story are required.");
        setIsSaving(false);
        return;
      }
      const newChapter = {
        ...currentChapter,
        images: currentChapter.images.map((image) => ({
          file: image.file || image,
          preview: image.preview || image.url,
        })),
      };
      setChapters([...chapters, newChapter]);
    }

    const content = {
      chapters: chapters.map((chapter) => ({
        chapterName: chapter.chapterName || "",
        story: chapter.story || "",
      })),
    };
    formData.append("content", JSON.stringify(content));

    chapters.forEach((chapter) => {
      const newImages = chapter.images.filter((img) => img.file);
      newImages.forEach((img) => formData.append("images", img.file));
    });

    try {
      const response = await axios.put(
        `https://travel-diaries-t6c5.onrender.com/api/journals/${journalId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, timeout: 10000 }
      );
      console.log("Journal updated:", response.data);
      navigate("/dashboard");
      setError("");
    } catch (error) {
      console.error("Error updating journal:", error);
      if (error.response) {
        setError(`Error updating journal: ${error.response.status} - ${error.response.data?.error || error.message}`);
      } else {
        setError(`Error updating journal: ${error.message}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <CircularProgress sx={{ color: "#FAA41F" }} />
      </div>
    );
  }

  if (error && !chapters.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-red-500 text-white p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gray-100 flex p-6">
      <Navbar />
      <div className="w-80 bg-gray-200 p-6 rounded-l-lg shadow-md h-[calc(100vh-3rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h6" className="font-bold" sx={{ color: "#FAA41F" }}>
            Chapters ({chapters.length})
          </Typography>
          <IconButton
            onClick={addChapter}
            sx={{ color: "#FAA41F", "&:hover": { color: "#e59400" } }}
          >
            <FaPlus size={16} />
          </IconButton>
        </div>
        {error && (
          <Typography variant="body2" className="text-red-500 mb-4">
            {error}
          </Typography>
        )}
        {chapters.length === 0 ? (
          <Typography variant="body2" className="text-gray-500 italic">
            No chapters yet. Click the + button to add one.
          </Typography>
        ) : (
          chapters.map((chapter, index) => (
            <div
              key={index}
              onClick={() => selectChapter(index)}
              className={`bg-white px-4 py-3 mb-2 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChapterIndex === index ? "ring-2 ring-[#FAA41F]" : "ring-1 ring-gray-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <Typography
                    variant="subtitle2"
                    className="font-semibold text-gray-800 truncate"
                    title={chapter.chapterName || "Untitled Chapter"}
                  >
                    {chapter.chapterName || "Untitled Chapter"}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 mt-1 truncate"
                    title={chapter.story || "No story yet"}
                  >
                    {chapter.story
                      ? chapter.story.substring(0, 50) + (chapter.story.length > 50 ? "..." : "")
                      : "No story yet"}
                  </Typography>
                  <div className="mt-1 flex items-center space-x-2 text-gray-500 text-sm">
                    <span>
                      {chapter.images.length} {chapter.images.length === 1 ? "Image" : "Images"}
                    </span>
                    <span>•</span>
                    <span>{chapter.story.length} Chars</span>
                  </div>
                </div>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChapter(index);
                  }}
                  sx={{ color: "red", "&:hover": { color: "#b91c1c" } }}
                >
                  <FaTrash size={12} />
                </IconButton>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex-1 flex bg-white rounded-r-lg shadow-md h-[calc(100vh-3rem)] overflow-hidden">
        {/* Left Page: Text Only */}
        <div className="w-1/2 p-6 flex flex-col bg-gray-50 border-r border-gray-200">
          <Typography variant="h4" className="mb-6 font-bold" sx={{ color: "#FAA41F" }}>
            {journal?.title || "Edit Journal"}
          </Typography>
          <TextField
            fullWidth
            label="Chapter Name"
            value={currentChapter.chapterName}
            onChange={(e) => handleChapterChange("chapterName", e.target.value)}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            sx={{ mb: 4, input: { fontSize: "1.5rem", border: "none", color: "#FAA41F" } }}
          />
          <TextField
            fullWidth
            label="Story"
            value={currentChapter.story}
            onChange={(e) => handleChapterChange("story", e.target.value)}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            multiline
            rows={10}
            sx={{ flexGrow: 1, textarea: { border: "none" } }}
          />
        </div>
        {/* Right Page: 4x4 Photo Grid */}
        <div className="w-1/2 p-6 flex flex-col bg-white">
          <div className="mb-4">
            <Button
              variant="contained"
              component="label"
              sx={{ backgroundColor: "#FAA41F", "&:hover": { backgroundColor: "#e59400" } }}
            >
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            <Typography variant="caption" className="ml-2 text-gray-500">
              (Max 16 images)
            </Typography>
          </div>
          <Grid container spacing={2} className="flex-grow">
            {currentChapter.images.map((image, index) => (
              <Grid item xs={3} key={index}>
                <div className="relative">
                  <img
                    src={image.preview || image.url}
                    alt={`Upload ${index}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <IconButton
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white hover:bg-red-700"
                    size="small"
                  >
                    <FaTrash size={10} />
                  </IconButton>
                </div>
              </Grid>
            ))}
            {currentChapter.images.length < 16 &&
              Array.from({ length: 16 - currentChapter.images.length }).map((_, index) => (
                <Grid item xs={3} key={`empty-${index}`}>
                  <div className="w-full h-24 bg-gray-100 rounded-md" />
                </Grid>
              ))}
          </Grid>
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard")}
              sx={{ borderColor: "#FAA41F", color: "#FAA41F", "&:hover": { borderColor: "#e59400", backgroundColor: "#fff3e0" } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isSaving}
              sx={{ backgroundColor: "#FAA41F", "&:hover": { backgroundColor: "#e59400" } }}
            >
              {isSaving ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditJournal;