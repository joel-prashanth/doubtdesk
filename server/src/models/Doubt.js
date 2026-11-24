const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    code: { type: String, required: true },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    status: { type: String, enum: ["open", "answered"], default: "open" },
    answer: { type: String, trim: true },
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    answeredAt: { type: Date },
  },
  { timestamps: true }
);

doubtSchema.index(
  { user: 1, problem: 1 },
  { unique: true, partialFilterExpression: { status: "open" } }
);

module.exports = mongoose.model("Doubt", doubtSchema);