const express = require("express");
const { createLimiter } = require("./limiter");
const { updateConfig, getConfig } = require("./configStore");
const helmet = require("helmet");

const app = express();
app.use(express.json());
app.use(helmet()); // Security middleware

// Rate limiter middleware
app.use(async (req, res, next) => {
  const limiter = createLimiter();
  try {
    await limiter.consume(req.ip);
    next();
  } catch (err) {
    console.log("Rate limit exceeded for IP:", err);
    res.status(429).send("Too many requests - try again later.", err);
  }
});

app.get("/", (req, res) => {
  res.send("Hello! You're within the rate limit.");
});

// 🔧 Admin API to update config at runtime
app.post("/admin/update-rate-limit", (req, res) => {
  const { points, duration, blockDuration } = req.body;
  updateConfig({ points, duration, blockDuration });
  res.json({ message: "Rate limit updated", currentConfig: getConfig() });
});

app.listen(3000, () => {
  console.log("Server running on port :3000");
});