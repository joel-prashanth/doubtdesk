const mongoose = require("mongoose");

const hintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    level: { type: Number, enum: [1, 2, 3], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

hintSchema.index({ user: 1, problem: 1, level: 1 }, { unique: true });

module.exports = mongoose.model("Hint", hintSchema);