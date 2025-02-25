import { useState, useEffect } from "react";
import { Typography, Button, TextField, Accordion, AccordionSummary, AccordionDetails, CircularProgress, Alert } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import Navbar from "../LandingPage/Parts/Navbar"; // Adjust the import path as needed
import Footer from "../LandingPage/Parts/Footer"; // Adjust the import path as needed

const FAQs = () => {
  const [faqData, setFaqData] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch FAQ Data from Backend
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/faqs"); // Replace with your API endpoint
        if (!response.ok) throw new Error("Failed to fetch FAQs");
        
        const data = await response.json();
        setFaqData(data);
        setCategories(Object.keys(data));
        setActiveCategory(Object.keys(data)[0] || null); // Set first category as default
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // Handle accordion toggle
  const handleToggle = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  // Filter questions based on search term
  const filteredQuestions =
    activeCategory && faqData[activeCategory]
      ? faqData[activeCategory].filter((faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center bg-[#F4A42E] text-black ">
        <div className="md:w-1/2 p-10">
          <Typography variant="h3" className="font-bold mb-4">
            Travel Diaries <br /> FAQs
          </Typography>
          <Typography variant="body1">
            Do you have questions about our software? Find guides and common questions here.
          </Typography>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://res-console.cloudinary.com/dsddldquo/thumbnails/v1/image/upload/v1740201691/emFteXR6dzkxdGEwdWlhem5hODk=/drilldown"
            alt="Girl reading with a cat"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row p-10 space-y-6 md:space-y-0 md:space-x-6">
        {/* Sidebar */}
        <div className="md:w-1/4 border-r border-gray-300 pr-6">
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            categories.map((category) => (
              <Button
                key={category}
                fullWidth
                onClick={() => setActiveCategory(category)}
                sx={{
                  backgroundColor: activeCategory === category ? "#F4A42E" : "transparent",
                  color: activeCategory === category ? "black" : "gray",
                  textAlign: "left",
                  mb: 1,
                  "&:hover": { backgroundColor: "#F4A42E", color: "black" }
                }}
              >
                {category}
              </Button>
            ))
          )}
        </div>

        {/* FAQ Content */}
        <div className="md:w-3/4">
          {/* Loading/Error Handling */}
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              {/* Search Bar */}
              {/* <TextField
                fullWidth
                variant="outlined"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              /> */}

              {/* Questions */}
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((faq, index) => (
                  <Accordion
                    key={index}
                    expanded={expanded === index}
                    onChange={() => handleToggle(index)}
                    sx={{ mb: 1 }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{faq.answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography>No results found.</Typography>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FAQs;
