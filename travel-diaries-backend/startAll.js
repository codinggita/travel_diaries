import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

/* ---------------- JOURNAL MODEL ---------------- */
const journalSchema = new mongoose.Schema({
  journalId: { type: String, unique: true, default: uuidv4 },
  journalTitle: String,
  countries: [String],
  notTravelRelated: Boolean,
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now },
  images: [String],
  content: String,
});
const Journal = mongoose.model("Journal", journalSchema);

app.route("/api/journals")
  .get(async (req, res) => res.json(await Journal.find()))
  .post(async (req, res) => {
    try {
      const { journalTitle } = req.body;
      if (!journalTitle) {
        return res.status(400).json({ success: false, message: "Title is required" });
      }
      const newJournal = new Journal({ journalTitle });
      await newJournal.save();
      res.status(201).json({ success: true, id: newJournal.journalId, data: newJournal });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error });
    }
  });

app.route("/api/journals/:journalId")
  .get(async (req, res) => {
    const journal = await Journal.findOne({ journalId: req.params.journalId });
    journal ? res.json(journal) : res.status(404).json({ message: "Journal not found" });
  })
  .put(async (req, res) => {
    const updated = await Journal.findOneAndUpdate({ journalId: req.params.journalId }, req.body, { new: true });
    updated ? res.json({ message: "Journal updated", data: updated }) : res.status(404).json({ message: "Journal not found" });
  })
  .delete(async (req, res) => {
    const deleted = await Journal.findOneAndDelete({ journalId: req.params.journalId });
    deleted ? res.json({ message: "Journal deleted" }) : res.status(404).json({ message: "Journal not found" });
  });

/* ---------------- SERVER START ---------------- */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
