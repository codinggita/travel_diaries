import { Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/contact", formData);
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      alert("Failed to send message.");
    }
  };

  return (
    <div>
      {/* Contact Section */}
      <div className="flex flex-col md:flex-row items-center bg-[#F4A42E] text-black">
        <div className="md:w-1/2 text-left p-10">
          <Typography variant="h3" className="font-bold mb-4">
            Contact us
          </Typography>
          <Typography variant="body1" className="mb-6">
            We’re a dedicated team ready to assist you. If you have any questions
            or need support with our software, please don’t hesitate to reach
            out. We’re here to help!
          </Typography>
        </div>
        <div className="md:w-1/2 h-full">
          <img
            src="https://res-console.cloudinary.com/dsddldquo/thumbnails/v1/image/upload/v1740198594/dDU4cHF0NHJnM212MnFiMzNnbW4=/drilldown"
            alt="Elderly couple reading"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center bg-white text-black mt-10 p-10 rounded-lg ">
        <div className="md:w-1/2 h-full">
          <img
            src="https://res-console.cloudinary.com/dsddldquo/thumbnails/v1/image/upload/v1740199415/bHZicmdwN3R4ZmpjcXRvd3NmNXc=/drilldown"
            alt="Elderly woman using a laptop"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="md:w-1/2 text-left p-10">
          <Typography variant="h3" className="font-bold mb-4 text-7xl">
            Frequently <br /> asked questions
          </Typography>
          <Typography variant="body1" className="mb-6">
            You might find the answers you're looking for right on our FAQs page.
            We've compiled a list of common questions and helpful information
            about Travel Diaries to assist you.
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#F4A42E", color: "black", '&:hover': { backgroundColor: "#e69528" } }}
          >
            Read FAQs
          </Button>
        </div>
      </div>

      {/* Customer Service Section */}
      <div className="flex flex-col md:flex-row items-center mt-10 p-10">
        <div className="md:w-1/2 text-left">
          <Typography variant="h3" className="font-bold mb-4">
            Customer service
          </Typography>
          <Typography variant="body1" className="mb-6">
            Do you have questions, remarks or feedback about Travel Diaries?
            Please get in touch with us through our contact form or by sending
            an email to support@traveldiariesapp.com.
          </Typography>
        </div>
        <form onSubmit={handleSubmit} className="md:w-1/2 flex flex-col space-y-4">
          <div className="flex space-x-4">
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
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
          >
            Send message
          </Button>
        </form>
      </div>

      {/* FAQ Section */}
      
    </div>
  );
};

export default ContactSection;
