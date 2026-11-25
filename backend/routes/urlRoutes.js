const express = require("express");
const { nanoid } = require("nanoid");
const Url = require("../models/Url");

const router = express.Router();

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getPublicBaseUrl(req) {
  return (process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`)
    .replace(/\/$/, "");
}

// POST /api/urls - create a short URL
router.post("/", async (req, res) => {
  try {
    const originalUrl =
      typeof req.body.originalUrl === "string"
        ? req.body.originalUrl.trim()
        : "";

    if (!isValidHttpUrl(originalUrl)) {
      return res.status(400).json({
        message: "Please provide a valid HTTP or HTTPS URL."
      });
    }

    let shortCode;
    let exists = true;

    // Retry if a generated code already exists.
    while (exists) {
      shortCode = nanoid(7);
      exists = await Url.exists({ shortCode });
    }

    const savedUrl = await Url.create({ originalUrl, shortCode });

    return res.status(201).json({
      message: "Short URL created successfully.",
      url: {
        id: savedUrl._id,
        originalUrl: savedUrl.originalUrl,
        shortCode: savedUrl.shortCode,
        shortUrl: `${getPublicBaseUrl(req)}/${savedUrl.shortCode}`,
        clicks: savedUrl.clicks,
        createdAt: savedUrl.createdAt
      }
    });
  } catch (error) {
    console.error("Create URL error:", error);
    return res.status(500).json({ message: "Unable to create short URL." });
  }
});

// GET /api/urls - list saved URLs
router.get("/", async (req, res) => {
  try {
    const records = await Url.find().sort({ createdAt: -1 }).lean();

    const urls = records.map((record) => ({
      id: record._id,
      originalUrl: record.originalUrl,
      shortCode: record.shortCode,
      shortUrl: `${getPublicBaseUrl(req)}/${record.shortCode}`,
      clicks: record.clicks,
      createdAt: record.createdAt
    }));

    return res.status(200).json(urls);
  } catch (error) {
    console.error("Fetch URLs error:", error);
    return res.status(500).json({ message: "Unable to fetch URLs." });
  }
});

module.exports = router;
