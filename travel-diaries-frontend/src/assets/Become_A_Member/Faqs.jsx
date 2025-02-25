import { useState } from "react";
import { Typography, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import Navbar from "../LandingPage/Parts/Navbar"; // Adjust the import path as needed
import Footer from "../LandingPage/Parts/Footer"; // Adjust the import path as needed

const FAQs = () => {
  const [faqData] = useState({
    "General": [
      { question: "What is Travel Diaries?", answer: "Travel Diaries is a platform to document and share your travel experiences with photos, notes, and maps." },
      { question: "How do I get started?", answer: "Sign up with your email, verify your account, and start creating your first travel entry!" },
      { question: "Is it free to use?", answer: "Yes, we offer a free basic plan with core features. Premium plans unlock additional functionalities." },
    ],
    "Features": [
      { question: "Can I add photos?", answer: "Yes, you can upload unlimited photos to enhance your travel stories on premium plans." },
      { question: "Is there a mobile app?", answer: "Currently, we offer a web version, with a mobile app in development for iOS and Android." },
      { question: "Can I share my diaries?", answer: "Absolutely! You can share your diaries publicly or with specific friends via a unique link." },
      { question: "Does it support offline mode?", answer: "Offline mode is available in the premium plan, allowing you to draft entries without internet." },
    ],
    "Account & Billing": [
      { question: "How do I upgrade my plan?", answer: "Go to your account settings and select 'Upgrade Plan' to choose a premium option." },
      { question: "Can I cancel my subscription?", answer: "Yes, you can cancel anytime from your account dashboard with no penalty." },
      { question: "What payment methods are accepted?", answer: "We accept major credit cards, PayPal, and Apple Pay." },
      { question: "Is there a refund policy?", answer: "We offer a 30-day money-back guarantee if you're not satisfied." },
    ],
    "Support": [
      { question: "How do I contact support?", answer: "Email us at support@traveldiaries.com or use the live chat feature on our site." },
      { question: "What if I forget my password?", answer: "Use the 'Forgot Password' link on the login page to reset it via email." },
      { question: "Are there user guides available?", answer: "Yes, check our Help Center for detailed guides and tutorials." },
    ],
    "Privacy & Security": [
      { question: "Is my data safe?", answer: "We use industry-standard encryption to protect your data and privacy." },
      { question: "Can I make my diaries private?", answer: "Yes, you can set your diaries to private, visible only to you or selected users." },
      { question: "Do you sell my information?", answer: "No, we never sell your personal information to third parties." },
      { question: "How do I delete my account?", answer: "Contact support to request account deletion, and we'll process it within 48 hours." },
    ],
    "Tips & Usage": [
      { question: "How can I organize my trips?", answer: "Use tags and folders to categorize your entries by destination or date." },
      { question: "Can I collaborate with others?", answer: "Yes, premium users can invite friends to co-edit travel diaries." },
      { question: "What’s the best way to add locations?", answer: "Use our integrated map feature to pin locations directly to your entries." },
      { question: "How do I export my diaries?", answer: "Export options include PDF and Word formats, available in the settings." },
    ]
  });
  const [categories] = useState(Object.keys(faqData));
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [expanded, setExpanded] = useState(null);

  // Handle accordion toggle
  const handleToggle = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Navbar */}
      <Navbar />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center bg-[#F4A42E] mt-18 text-black w-full">
        <div className="w-full md:w-1/2 p-6 md:p-10 text-center md:text-left">
          <Typography variant="h3" className="font-bold mb-4 text-3xl md:text-4xl lg:text-5xl">
            Travel Diaries <br /> FAQs
          </Typography>
          <Typography variant="body1" className="text-sm md:text-base">
            Do you have questions about our software? Find guides and common questions here.
          </Typography>
        </div>
        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <img
            src="https://res-console.cloudinary.com/dsddldquo/thumbnails/v1/image/upload/v1740201691/emFteXR6dzkxdGEwdWlhem5hODk=/drilldown"
            alt="Girl reading with a cat"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row p-6 md:p-10 space-y-6 md:space-y-0 md:space-x-6 w-full">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden md:block md:w-1/4 border-r border-gray-300 pr-6">
          {categories.map((category) => (
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
          ))}
        </div>

        {/* FAQ Content - Full width on mobile */}
        <div className="w-full md:w-3/4">
          {/* Category Buttons for Mobile */}
          <div className="md:hidden flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                sx={{
                  backgroundColor: activeCategory === category ? "#F4A42E" : "transparent",
                  color: activeCategory === category ? "black" : "gray",
                  "&:hover": { backgroundColor: "#F4A42E", color: "black" }
                }}
                className="flex-1 min-w-[120px]"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Accordion Content */}
          {faqData[activeCategory].map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === index}
              onChange={() => handleToggle(index)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography className="text-sm md:text-base">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className="text-sm md:text-base">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FAQs;