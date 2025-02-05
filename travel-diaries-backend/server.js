import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Define User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, 
  authMethod: String,  
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// Register User
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password, authMethod } = req.body;
    const user = new User({ username, email, password, authMethod });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
