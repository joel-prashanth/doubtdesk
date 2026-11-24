const express = require("express");
const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const Hint = require("../models/Hint");
const { protect } = require("../middleware/auth");
const { askLLM } = require("../services/ai");
const { buildHintMessages } = require("../services/hints");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { problemId, code } = req.body;
    if (!mongoose.isValidObjectId(problemId)) {
      return res.status(400).json({ message: "Invalid problem id" });
    }
    if (!code || !code.trim()) {
      return res.status(400).json({ message: "code is required" });
    }
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const given = await Hint.countDocuments({ user: req.user.id, problem: problemId });
    if (given >= 3) {
      return res.status(409).json({ message: "No more hints. You can ask your instructor." });
    }

    const level = given + 1;
    const text = await askLLM(buildHintMessages({ problem, code, level }));
    await Hint.create({ user: req.user.id, problem: problemId, level, text });
    res.status(201).json({ level, text, hintsLeft: 3 - level });
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: "Could not get a hint right now" });
  }
});

module.exports = router;