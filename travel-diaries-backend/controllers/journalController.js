const Journal = require("../models/Journal");

// Create a journal
const createJournal = async (req, res) => {
  const { title, content } = req.body;

  try {
    const journal = new Journal({ user: req.user.id, title, content });
    await journal.save();
    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all journals for a user
const getUserJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id });
    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a journal by ID
const getJournalById = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal || journal.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Journal not found" });
    }
    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a journal
const updateJournal = async (req, res) => {
  const { title, content } = req.body;

  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal || journal.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Journal not found" });
    }

    journal.title = title || journal.title;
    journal.content = content || journal.content;

    await journal.save();
    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a journal
const deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal || journal.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Journal not found" });
    }

    await journal.remove();
    res.status(200).json({ message: "Journal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJournal,
  getUserJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
};
