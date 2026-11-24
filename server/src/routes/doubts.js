const express = require("express");
const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const Doubt = require("../models/Doubt");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { problemId, code, message } = req.body;
    if (!mongoose.isValidObjectId(problemId) || !(await Problem.exists({ _id: problemId }))) {
      return res.status(404).json({ message: "Problem not found" });
    }
    const doubt = await Doubt.create({
      user: req.user.id,
      problem: problemId,
      code,
      message,
    });
    res.status(201).json(doubt);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already have an open doubt on this problem" });
    }
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.get("/mine", protect, async (req, res) => {
  const doubts = await Doubt.find({ user: req.user.id })
    .populate("problem", "title")
    .sort({ createdAt: -1 });
  res.json(doubts);
});

router.get("/", protect, requireRole("instructor", "admin"), async (req, res) => {
  const status = req.query.status === "answered" ? "answered" : "open";
  const doubts = await Doubt.find({ status })
    .populate("user", "name email")
    .populate("problem", "title")
    .sort({ createdAt: 1 });
  res.json(doubts);
});

router.patch("/:id/answer", protect, requireRole("instructor", "admin"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid doubt id" });
  }
  const { answer } = req.body;
  if (!answer || !answer.trim()) {
    return res.status(400).json({ message: "answer is required" });
  }
  const doubt = await Doubt.findOneAndUpdate(
    { _id: req.params.id, status: "open" },
    { answer, status: "answered", answeredBy: req.user.id, answeredAt: new Date() },
    { new: true }
  );
  if (!doubt) return res.status(404).json({ message: "Open doubt not found" });
  res.json(doubt);
});



module.exports = router;