const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    code: { type: String, required: true },
    passedCount: { type: Number, required: true, min: 0 },
    totalCount: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, problem: 1, createdAt: -1 });

module.exports = mongoose.model("Submission", submissionSchema);