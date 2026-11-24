const express = require("express");
const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const problems = await Problem.find().select("title difficulty createdAt");
  res.json(problems);
});

router.get("/:id", protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid problem id" });
  }
  const problem = await Problem.findById(req.params.id);
  if (!problem) return res.status(404).json({ message: "Problem not found" });
  res.json(problem);
});

router.post("/", protect, requireRole("instructor", "admin"), async (req, res) => {
  try {
    const problem = await Problem.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(problem);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;