import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  IconButton,
  Grid,
  CircularProgress,
  Typography,
  Divider,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash, FaPlus } from "react-icons/fa";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
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
    date: null,
    images: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [collageFormat, setCollageFormat] = useState("grid"); // Default format

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
            date: chapter.date ? dayjs(chapter.date) : null,
            images: index === 0 ? allImages : [], // Temporary workaround
          }));
        } else {
          initialChapters = [
            {
              chapterName: content.chapterName || "",
              story: content.story || "",
              date: content.date ? dayjs(content.date) : null,
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
    ];
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
      setCurrentChapter({ chapterName: "", story: "", date: null, images: [] });
      setSelectedChapterIndex(-1);
    } else {
      setSelectedChapterIndex(-1);
      setCurrentChapter({ chapterName: "", story: "", date: null, images: [] });
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
        ? { chapterName: "", story: "", date: null, images: [] }
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

    // Check if a new chapter is being added
    if (selectedChapterIndex === -1) {
      // Ensure the new chapter has a valid name and story
      if (!currentChapter.chapterName.trim() || !currentChapter.story.trim()) {
        setError("Chapter name and story are required.");
        setIsSaving(false);
        return;
      }
      // Add the new chapter to the chapters array
      const newChapter = {
        ...currentChapter,
        images: currentChapter.images.map((image) => ({
          file: image.file || image,
          preview: image.preview || image.url,
        })),
      };
      setChapters([...chapters, newChapter]);
    }

    // Prepare the content object with all chapters
    const content = {
      chapters: chapters.map((chapter) => ({
        chapterName: chapter.chapterName || "",
        story: chapter.story || "",
        date: chapter.date ? chapter.date.toISOString() : null,
      })),
    };
    formData.append("content", JSON.stringify(content));

    // Append images to the form data
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
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
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
        <CircularProgress />
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
    <div className="min-h-screen bg-gray-100 flex p-6">
      <Navbar/>
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-200 p-6 rounded-l-lg shadow-md h-[calc(100vh-3rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h6" className="font-bold text-gray-800">
            Chapters ({chapters.length})
          </Typography>
          <IconButton
            onClick={addChapter}
            className="text-gray-700 hover:text-orange-500 transition-colors"
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
                selectedChapterIndex === index ? "ring-2 ring-orange-500" : "ring-1 ring-gray-300"
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
                    {chapter.story ? chapter.story.substring(0, 50) + (chapter.story.length > 50 ? "..." : "") : "No story yet"}
                  </Typography>
                  <div className="mt-1 flex items-center space-x-2 text-gray-500 text-sm">
                    <span>{chapter.images.length} {chapter.images.length === 1 ? "Image" : "Images"}</span>
                    <span>•</span>
                    <span>{chapter.story.length} Chars</span>
                    {chapter.date && (
                      <>
                        <span>•</span>
                        <span>{dayjs(chapter.date).format("MMM D, YYYY")}</span>
                      </>
                    )}
                  </div>
                </div>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChapter(index);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <FaTrash size={12} />
                </IconButton>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right Editing Area */}
      <div className="flex-1 bg-gray-100 p-6 rounded-r-lg shadow-inner h-[calc(100vh-3rem)] overflow-y-auto">
        <Typography variant="h5" className="font-bold mb-6 text-gray-800">
          {selectedChapterIndex === -1 ? "New Chapter" : "Edit Chapter"}
        </Typography>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <TextField
            fullWidth
            variant="outlined"
            label="Chapter Name"
            value={currentChapter.chapterName || ""}
            onChange={(e) => handleChapterChange("chapterName", e.target.value)}
            className="mb-4"
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Story"
            value={currentChapter.story || ""}
            onChange={(e) => handleChapterChange("story", e.target.value)}
            multiline
            rows={6}
            className="mb-4"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={currentChapter.date || null}
              onChange={(newValue) => handleChapterChange("date", newValue)}
              slotProps={{ textField: { fullWidth: true, className: "mb-4" } }}
            />
          </LocalizationProvider>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="mb-2 text-gray-700"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Select
              value={collageFormat}
              onChange={(e) => setCollageFormat(e.target.value)}
              className="mb-4"
            >
              <MenuItem value="grid">Grid</MenuItem>
              <MenuItem value="row">Row</MenuItem>
              <MenuItem value="column">Column</MenuItem>
            </Select>
            <Grid container spacing={2}>
              {currentChapter.images.map((image, imgIndex) => (
                <Grid item xs={collageFormat === "row" ? 12 : collageFormat === "column" ? 4 : 6} key={imgIndex} className="relative">
                  <img
                    src={image.preview || image.url}
                    alt={`Image ${imgIndex + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <IconButton
                    onClick={() => removeImage(imgIndex)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FaTrash fontSize="small" />
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-200 text-gray-700 rounded-full px-6 py-2 hover:bg-gray-300"
          >
            Back to Journals
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-orange-500 text-white rounded-full px-6 py-2 hover:bg-orange-600"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditJournal;