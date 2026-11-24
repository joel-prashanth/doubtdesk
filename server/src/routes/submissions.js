const express = require("express");
const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { problemId, code, passedCount, totalCount } = req.body;
    if (!mongoose.isValidObjectId(problemId) || !(await Problem.exists({ _id: problemId }))) {
      return res.status(404).json({ message: "Problem not found" });
    }
    const submission = await Submission.create({
      user: req.user.id,
      problem: problemId,
      code,
      passedCount,
      totalCount,
    });
    res.status(201).json(submission);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.get("/mine", protect, async (req, res) => {
  const filter = { user: req.user.id };
  if (req.query.problemId) filter.problem = req.query.problemId;
  const submissions = await Submission.find(filter).sort({ createdAt: -1 }).limit(50);
  res.json(submissions);
});

module.exports = router;
