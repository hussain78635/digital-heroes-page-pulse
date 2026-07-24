const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
  res.send("Page Pulse API is running");
});

// Analyze Route
app.post("/analyze", async (req, res) => {
  try {
    const url = req.body.url;

    // Invalid URL check
    if (!url) {
      return res.status(400).json({
        error: "URL is required"
      });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        error: "Invalid URL format"
      });
    }

    // Start timer
    const startTime = Date.now();

    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const responseTime = Date.now() - startTime;

    // Check HTML
    const contentType = response.headers["content-type"] || "";

    if (!contentType.includes("text/html")) {
      return res.status(400).json({
        error: "URL is not an HTML page"
      });
    }

    const $ = cheerio.load(response.data);

    const text = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    const wordCount = text ? text.split(" ").length : 0;

    const result = {
      statusCode: response.status,
      responseTime: `${responseTime} ms`,
      title: $("title").text().trim() || "Not found",
      description: $('meta[name="description"]').attr("content") || "Not found",
      h1Count: $("h1").length,
      imagesWithoutAlt: $("img:not([alt])").length,
      wordCount: wordCount
    };

    res.json(result);

  } catch (error) {
    if (error.code === "ECONNABORTED") {
      return res.status(408).json({
        error: "Request timeout"
      });
    }

    res.status(500).json({
      error: "Unable to analyze website"
    });
  }
});

// Port configuration for Render deployment
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;