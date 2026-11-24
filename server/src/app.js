const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/problems", require("./routes/problems"));
app.use("/api/submissions", require("./routes/submissions"));
app.use("/api/hints", require("./routes/hints"));
app.use("/api/doubts", require("./routes/doubts"));

module.exports = app;