import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Define Journal Schema with Unique journalId
const journalSchema = new mongoose.Schema({
  journalId: { type: String, unique: true, default: uuidv4 },
  title: String,
  content: String,
  username: String, 
  createdAt: { type: Date, default: Date.now }
});

const Journal = mongoose.model("Journal", journalSchema);

// Create Journal (No Auth required)
app.post("/api/journals", async (req, res) => {
  try {
    const { title, content, username } = req.body;

    if (!title || !content || !username) {
      return res.status(400).json({ error: "Title, content, and username are required" });
    }

    const journal = new Journal({ title, content, username });
    await journal.save();

    res.status(201).json({ message: "Journal created successfully", journal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Journals (No Auth)
app.get("/api/journals", async (req, res) => {
  try {
    const journals = await Journal.find();
    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Journal by journalId
app.get("/api/journals/:journalId", async (req, res) => {
  try {
    const { journalId } = req.params;
    const journal = await Journal.findOne({ journalId });

    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Journals by Username
app.get("/api/journals/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const journals = await Journal.find({ username });

    if (!journals.length) {
      return res.status(404).json({ error: "No journals found for this username" });
    }

    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Journal by journalId
app.put("/api/journals/:journalId", async (req, res) => {
  try {
    const { journalId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const updatedJournal = await Journal.findOneAndUpdate(
      { journalId },
      { title, content },
      { new: true }
    );

    if (!updatedJournal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    res.status(200).json({ message: "Journal updated successfully", updatedJournal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Journal by journalId
app.delete("/api/journals/:journalId", async (req, res) => {
  try {
    const { journalId } = req.params;

    const deletedJournal = await Journal.findOneAndDelete({ journalId });

    if (!deletedJournal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    res.status(200).json({ message: "Journal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(5002, () => console.log("Server running on port 5002"));
