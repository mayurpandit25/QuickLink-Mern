require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Url = require("./models/Url");
const urlRoutes = require("./routes/urlRoutes");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((item) => item.trim())
    : "http://localhost:5173"
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "QuickLink backend is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use("/api/urls", urlRoutes);

// GET /:shortCode - redirect to the original URL.
// Keep this route after /health and /api routes.
app.get("/:shortCode", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) {
      return res.status(404).send("Short URL not found.");
    }

    url.clicks += 1;
    await url.save();

    return res.redirect(302, url.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).send("Unable to redirect.");
  }
});

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing. Add it to backend/.env.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully.");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`QuickLink backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
