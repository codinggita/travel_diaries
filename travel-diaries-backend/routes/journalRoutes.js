const express = require("express");
const {
  createJournal,
  getUserJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
} = require("../controllers/journalController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createJournal);
router.get("/", authMiddleware, getUserJournals);
router.get("/:id", authMiddleware, getJournalById);
router.put("/:id", authMiddleware, updateJournal);
router.delete("/:id", authMiddleware, deleteJournal);

module.exports = router;