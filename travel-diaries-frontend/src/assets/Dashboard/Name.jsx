import { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";

function App() {
  const [step, setStep] = useState(1);
  const [journalTitle, setJournalTitle] = useState(""); // Matches 'title' in backend
  const [content, setContent] = useState(""); // Matches 'content' in backend
  const [chapterName, setChapterName] = useState(""); // New field for backend
  const [date, setDate] = useState(null); // New field for backend (single date for simplicity)
  const [story, setStory] = useState(""); // New field for backend
  const [countries, setCountries] = useState([]);
  const [startDate, setStartDate] = useState(null); // For travel dates
  const [endDate, setEndDate] = useState(null); // For travel dates
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const username = "user123"; // Replace with actual auth logic

  const countryOptions = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Argentina",
    // Add full list or fetch from an API
  ];

  const validateStep = () => {
    if (step === 1 && !journalTitle.trim()) {
      setError("Journal title is required.");
      return false;
    }
    if (step === 2 && countries.length === 0) {
      setError("Please select at least one country.");
      return false;
    }
    if (step === 3 && startDate && endDate && dayjs(startDate).isAfter(endDate)) {
      setError("End date must be after start date.");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 5) setStep(step + 1);
    else setOpenPreview(true);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    setError("");
  };

  const handleCountryChange = (event) => {
    const { value } = event.target;
    setCountries(typeof value === "string" ? value.split(",") : value);
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

  const handleSubmit = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", journalTitle);
    formData.append("username", username);

    // Structure content as required by backend
    const structuredContent = {
      chapterName: chapterName || "",
      date: date ? date.toISOString() : "",
      story: story || content || "",
    };
    formData.append("content", JSON.stringify(structuredContent));
    formData.append("chapterName", chapterName);
    formData.append("date", date ? date.toISOString() : "");
    formData.append("story", story);

    // Add travel dates and countries (optional, adjust as needed)
    formData.append("countries", JSON.stringify(countries));
    formData.append("startDate", startDate ? startDate.toISOString() : "");
    formData.append("endDate", endDate ? endDate.toISOString() : "");

    if (coverPhoto) formData.append("coverImage", coverPhoto);

    try {
      const response = await axios.post("https://travel-diaries-t6c5.onrender.com/api/journals", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Journal created:", response.data);
      setOpenPreview(false);
      setStep(1);
      resetForm();
    } catch (error) {
      setError("Failed to create journal. Please try again.");
      console.error("Error creating journal:", error.response?.data?.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setJournalTitle("");
    setContent("");
    setChapterName("");
    setDate(null);
    setStory("");
    setCountries([]);
    setStartDate(null);
    setEndDate(null);
    setCoverPhoto(null);
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
            <FormControl fullWidth variant="outlined" className="max-w-md w-full">
              <InputLabel>Select countries</InputLabel>
              <Select
                multiple
                value={countries}
                onChange={handleCountryChange}
                label="Select countries"
                renderValue={(selected) => selected.join(", ")}
                error={!!error && step === 2}
              >
                {countryOptions.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
              {step === 2 && error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
                renderInput={(params) => <TextField {...params} fullWidth className="mb-4 max-w-md w-full" />}
              />
              <DatePicker
                label="End date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth className="mb-4 max-w-md w-full" />}
              />
              {step === 3 && error && <p className="text-red-500 text-sm">{error}</p>}
            </LocalizationProvider>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-6">Add journal details</h2>
            <TextField
              fullWidth
              variant="outlined"
              label="Chapter Name"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              className="mb-4 max-w-md w-full"
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Story"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              multiline
              rows={4}
              className="mb-4 max-w-md w-full"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth className="mb-4 max-w-md w-full" />}
              />
            </LocalizationProvider>
            <p className="text-sm text-gray-500 mb-4 max-w-md w-full text-center">
              Add additional details for your journal entry.
            </p>
          </div>
        );
      case 5:
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
              {error && step === 5 && <p className="text-red-500 text-sm">{error}</p>}
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {renderStepContent()}

        {/* Progress and Navigation */}
        <div className="w-full max-w-md mt-8 bg-gray-100 p-4 rounded-b-lg flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-sm text-gray-600 mb-4">
            <span>{step} of 5</span>
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
              {step === 5 ? "Preview" : "Next"}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
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

      {/* Preview Dialog */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)}>
        <DialogTitle>Journal Preview</DialogTitle>
        <DialogContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-orange-700 w-48 h-64 rounded-lg relative overflow-hidden">
              {coverPhoto ? (
                <img
                  src={URL.createObjectURL(coverPhoto)}
                  alt="Final Cover Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white flex items-center justify-center h-full">
                  No Cover Photo
                </span>
              )}
              {journalTitle && (
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 p-2 rounded text-black text-sm">
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
            <p>
              <strong>Dates:</strong>{" "}
              {startDate ? dayjs(startDate).format("DD MMMM YYYY") : "Not set"} -{" "}
              {endDate ? dayjs(endDate).format("DD MMMM YYYY") : "Not set"}
            </p>
            <p>
              <strong>Chapter:</strong> {chapterName || "None"}
            </p>
            <p>
              <strong>Story:</strong> {story || "None"}
            </p>
            <p>
              <strong>Date:</strong> {date ? dayjs(date).format("DD MMMM YYYY") : "Not set"}
            </p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)} disabled={isLoading}>
            Close
          </Button>
          <Button
            onClick={handleSubmit}
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