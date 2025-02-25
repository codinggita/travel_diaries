import { Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../LandingPage/Parts/Navbar";
import Footer from "../LandingPage/Parts/Footer";

const ContactSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://travel-diaries-t6c5.onrender.com/api/contact", formData);
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      alert("Failed to send message.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Contact Section */}
      <div className="flex flex-col md:flex-row items-center bg-[#F4A42E] mt-18 text-black w-full">
        <div className="w-full md:w-1/2 p-6 md:p-10 text-center md:text-left">
          <Typography variant="h3" className="font-bold mb-4 text-3xl md:text-4xl lg:text-5xl">
            Contact us
          </Typography>
          <Typography variant="body1" className="mb-6 text-sm md:text-base">
            We’re a dedicated team ready to assist you. If you have any questions
            or need support with our software, please don’t hesitate to reach
            out. We’re here to help!
          </Typography>
        </div>
        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <img
            src="https://res-console.cloudinary.com/dsddldquo/thumbnails/v1/image/upload/v1740198594/dDU4cHF0NHJnM212MnFiMzNnbW4=/drilldown"
            alt="Elderly couple reading"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="flex flex-col md:flex-row items-center bg-white text-black mt-6 md:mt-10 p-6 md:p-10 w-full">
        <div className="w-full md:w-1/2 h-64 md:h-auto order-2 md:order-1">
          <img
            src="https://res-console.cloudinary.com/dsddldquo/thumbnails/v1/image/upload/v1740199415/bHZicmdwN3R4ZmpjcXRvd3NmNXc=/drilldown"
            alt="Elderly woman using a laptop"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="w-full md:w-1/2 p-6 md:p-10 text-center md:text-left order-1 md:order-2">
          <Typography variant="h3" className="font-bold mb-4 text-3xl md:text-5xl lg:text-7xl">
            Frequently <br /> asked questions
          </Typography>
          <Typography variant="body1" className="mb-6 text-sm md:text-base">
            You might find the answers you're looking for right on our FAQs page.
            We've compiled a list of common questions and helpful information
            about Travel Diaries to assist you.
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#F4A42E", color: "black", '&:hover': { backgroundColor: "#e69528" } }}
            onClick={() => navigate("/faqs")}
            className="w-full md:w-auto"
          >
            Read FAQs
          </Button>
        </div>
      </div>

      {/* Customer Service Section */}
      <div className="flex flex-col md:flex-row items-center mt-6 md:mt-10 p-6 md:p-10 w-full">
        <div className="w-full md:w-1/2 text-center md:text-left mb-6 md:mb-0">
          <Typography variant="h3" className="font-bold mb-4 text-3xl md:text-4xl">
            Customer service
          </Typography>
          <Typography variant="body1" className="mb-6 text-sm md:text-base">
            Do you have questions, remarks, or feedback about Travel Diaries?
            Please get in touch with us through our contact form or by sending
            an email to dev.patel.codinggita@gmail.com
          </Typography>
        </div>
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              className="w-full"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              className="w-full"
            />
          </div>
          <TextField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            multiline
            rows={4}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#F4A42E", color: "black", '&:hover': { backgroundColor: "#e69528" } }}
            className="w-full md:w-auto"
          >
            Send message
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default ContactSection;