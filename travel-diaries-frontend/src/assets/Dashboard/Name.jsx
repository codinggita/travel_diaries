import { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

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
  });
  const [openPreview, setOpenPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const username = "user123"; // Replace with actual auth logic
  const navigate = useNavigate();

  const validateStep = () => {
    if (step === 1 && !journalTitle.trim()) {
      setError("Journal title is required.");
      return false;
    }
    if (step === 2 && countries.length === 0) {
      setError("Please add at least one country.");
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
    ];
    setCurrentChapter({ ...currentChapter, images: updatedImages });
    if (selectedChapterIndex !== -1) {
      updateChapter(selectedChapterIndex, { images: updatedImages });
    }
    setError("");
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = currentChapter.images.filter((_, index) => index !== indexToRemove);
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
    };
    setChapters([...chapters, newChapter]);
    setCurrentChapter({ chapterName: "", story: "", date: null, images: [] });
    setSelectedChapterIndex(-1);
    setError("");
  };

  const selectChapter = (index) => {
    setSelectedChapterIndex(index);
    setCurrentChapter({ ...chapters[index] });
  };

  const handleSubmit = async (finish = false) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", journalTitle);
    formData.append("username", username);

    const structuredContent = JSON.stringify({
      chapters: chapters.map((chapter) => ({
        chapterName: chapter.chapterName,
        story: chapter.story,
        date: chapter.date ? chapter.date.toISOString() : null,
        images: chapter.images.map(() => true), // Placeholder for image count
      })),
    });
    formData.append("content", structuredContent);
    formData.append("countries", JSON.stringify(countries));
    if (!skipDates) {
      formData.append("startDate", startDate ? startDate.toISOString() : "");
      formData.append("endDate", endDate ? endDate.toISOString() : "");
    }

    // Append cover image separately
    if (coverPhoto) {
      formData.append("coverImage", coverPhoto);
    }

    // Append chapter images
    chapters.forEach((chapter) => {
      chapter.images.forEach((image) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });
    });

    try {
      const response = await axios.post(
        "https://travel-diaries-t6c5.onrender.com/api/journals",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Journal created:", response.data);
      setOpenPreview(false);
      setStep(1);
      resetForm();
      if (finish) {
        alert("Diary saved successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Failed to create journal. Please try again.");
      console.error("Error creating journal:", error.response?.data?.error || error.message);
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
    setCurrentChapter({ chapterName: "", story: "", date: null, images: [] });
    setSelectedChapterIndex(-1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-bold mb-6">Give a title to your journal</h2>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter journal title"
              value={journalTitle}
              onChange={(e) => setJournalTitle(e.target.value)}
              error={!!error && step === 1}
              helperText={step === 1 && error}
              className="max-w-md w-full"
            />
            <p className="text-sm text-gray-500 mt-4">
              Note: emoticons are not available for printed books. We are working on it.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-6">Which countries is it about?</h2>
            <FormControl fullWidth className="max-w-md w-full">
              <TextField
                variant="outlined"
                placeholder="Type country name and press Enter"
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
                onKeyDown={handleCountryInput}
                error={!!error && step === 2}
                helperText={step === 2 && error}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {countries.map((country, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 px-3 py-1 rounded-full flex items-center"
                  >
                    {country}
                    <IconButton
                      size="small"
                      onClick={() => removeCountry(index)}
                      className="ml-2"
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
                    onChange={(e) => setSkipDates(e.target.checked)}
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
            <h2 className="text-2xl font-bold mb-6">Add your travel dates</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true, className: "mb-4 max-w-md w-full" } }}
              />
              <DatePicker
                label="End date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { fullWidth: true, className: "mb-4 max-w-md w-full" } }}
              />
              {step === 3 && error && <p className="text-red-500 text-sm">{error}</p>}
            </LocalizationProvider>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-6">Add cover photo</h2>
            <p className="text-sm text-gray-500 mb-4 max-w-md w-full text-center">
              Upload a landscape cover photo for your journal.
            </p>
            <div className="border-2 border-dashed border-orange-300 p-6 text-center rounded-lg max-w-md w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4"
              />
              {error && step === 4 && <p className="text-red-500 text-sm">{error}</p>}
              {coverPhoto && (
                <img
                  src={URL.createObjectURL(coverPhoto)}
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
            <h2 className="text-2xl font-bold mb-6">Book Preview</h2>
            <div className="bg-orange-700 w-64 h-80 rounded-lg relative overflow-hidden flex items-center justify-center text-white">
              {coverPhoto ? (
                <img
                  src={URL.createObjectURL(coverPhoto)}
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
          <div className="min-h-screen bg-gray-100 flex p-6 w-full max-w-6xl mx-auto">
            <div className="w-80 bg-gray-200 p-6 rounded-l-lg shadow-md h-[calc(100vh-3rem)] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Chapters</h2>
                <IconButton
                  onClick={() => {
                    if (selectedChapterIndex === -1) addChapter();
                    else setSelectedChapterIndex(-1);
                  }}
                  className="text-gray-700"
                >
                  <AddIcon />
                </IconButton>
              </div>
              {error && step === 6 && <p className="text-red-500 text-sm mb-2">{error}</p>}
              {chapters.map((chapter, index) => (
                <div
                  key={index}
                  onClick={() => selectChapter(index)}
                  className={`bg-white p-3 rounded-md mb-2 shadow-sm cursor-pointer hover:bg-gray-100 ${
                    selectedChapterIndex === index ? "border-l-4 border-orange-500" : ""
                  }`}
                >
                  <p className="font-medium truncate" title={chapter.chapterName || "Untitled Chapter"}>
                    {chapter.chapterName || "Untitled Chapter"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {chapter.images.length} image(s), {chapter.story.length} chars
                  </p>
                  {chapter.date && (
                    <p className="text-xs text-gray-500">{dayjs(chapter.date).format("MMM D, YYYY")}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex-1 bg-gray-100 p-6 rounded-r-lg shadow-inner h-[calc(100vh-3rem)] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Write Your Story</h2>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Chapter Name"
                  value={currentChapter.chapterName}
                  onChange={(e) => handleChapterChange("chapterName", e.target.value)}
                  className="mb-4"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Story"
                  value={currentChapter.story}
                  onChange={(e) => handleChapterChange("story", e.target.value)}
                  multiline
                  rows={6}
                  className="mb-4"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={currentChapter.date}
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
                    className="mb-2"
                  />
                  {error && step === 6 && <p className="text-red-500 text-sm">{error}</p>}
                  <Grid container spacing={2}>
                    {currentChapter.images.map((image, index) => (
                      <Grid item xs={4} key={index} className="relative">
                        <img
                          src={image.preview || URL.createObjectURL(image.file || image)}
                          alt={`Image ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <IconButton
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    ))}
                  </Grid>
                </div>
                <Button
                  variant="contained"
                  onClick={() => handleSubmit(true)}
                  disabled={isLoading}
                  className="bg-orange-500 text-white rounded-full px-6 py-2 hover:bg-orange-600 mt-4"
                >
                  {isLoading ? "Saving..." : "Finish Diary"}
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {renderStepContent()}

        {step !== 6 && (
          <div className="w-full max-w-md mt-8 bg-gray-100 p-4 rounded-b-lg flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>{step} of 6</span>
              <span>Create journal</span>
            </div>
            <div className="w-full flex items-center space-x-2">
              <div
                className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-orange-500" : "bg-gray-300"}`}
              />
              <div
                className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-orange-500" : "bg-gray-300"}`}
              />
              <div
                className={`h-2 flex-1 rounded-full ${step >= 3 ? "bg-orange-500" : "bg-gray-300"}`}
              />
              <div
                className={`h-2 flex-1 rounded-full ${step >= 4 ? "bg-orange-500" : "bg-gray-300"}`}
              />
              <div
                className={`h-2 flex-1 rounded-full ${step >= 5 ? "bg-orange-500" : "bg-gray-300"}`}
              />
              <div
                className={`h-2 flex-1 rounded-full ${step >= 6 ? "bg-orange-500" : "bg-gray-300"}`}
              />
            </div>
            <div className="mt-4 flex justify-between w-full max-w-xs">
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={step === 1}
                className="bg-gray-200 text-gray-700 rounded-full px-6 py-2 hover:bg-gray-300"
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isLoading}
                className="bg-gray-200 text-gray-700 rounded-full px-6 py-2 hover:bg-gray-300"
              >
                {step === 6 ? "Preview" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-gray-100 p-4 text-sm text-gray-600 text-center">
        <p>
          © 2025 Travel Diaries, All rights reserved -{" "}
          <a href="#" className="text-orange-500 hover:underline">
            Privacy policy
          </a>{" "}
          -{" "}
          <a href="#" className="text-orange-500 hover:underline">
            Terms and conditions
          </a>{" "}
          -{" "}
          <a href="#" className="text-orange-500 hover:underline">
            User terms
          </a>{" "}
          -{" "}
          <a href="#" className="text-orange-500 hover:underline">
            Frequently Asked Questions
          </a>{" "}
          -{" "}
          <a href="#" className="text-orange-500 hover:underline">
            Contact us
          </a>
        </p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="#" className="text-orange-500 hover:text-orange-700">
            <span className="sr-only">Facebook</span>
            <span className="text-xl">f</span>
          </a>
          <a href="#" className="text-orange-500 hover:text-orange-700">
            <span className="sr-only">Pinterest</span>
            <span className="text-xl">p</span>
          </a>
          <a href="#" className="text-orange-500 hover:text-orange-700">
            <span className="sr-only">Twitter</span>
            <span className="text-xl">t</span>
          </a>
          <a href="#" className="text-orange-500 hover:text-orange-700">
            <span className="sr-only">Instagram</span>
            <span className="text-xl">i</span>
          </a>
        </div>
      </footer>

      <Dialog open={openPreview} onClose={() => setOpenPreview(false)}>
        <DialogTitle>Journal Preview</DialogTitle>
        <DialogContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-orange-700 w-64 h-80 rounded-lg relative overflow-hidden">
              {coverPhoto ? (
                <img
                  src={URL.createObjectURL(coverPhoto)}
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
                <p>{chapter.story}</p>
                <p>
                  <strong>Images:</strong>
                </p>
                <Grid container spacing={2}>
                  {chapter.images.map((image, imgIndex) => (
                    <Grid item xs={4} key={imgIndex}>
                      <img
                        src={image.preview}
                        alt={`Chapter ${index + 1} Image ${imgIndex + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            ))}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)} disabled={isLoading}>
            Close
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;