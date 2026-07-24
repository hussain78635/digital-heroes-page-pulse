const axios = require("axios");
const cheerio = require("cheerio");

async function auditWebsite(url) {
    try {
        // Validate URL
        new URL(url);

        const start = Date.now();

        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const responseTime = Date.now() - start;

        const contentType = response.headers["content-type"] || "";
        if (!contentType.includes("text/html")) {
            throw new Error("The provided URL is not an HTML page.");
        }

        const html = response.data;
        const $ = cheerio.load(html);

        const title = $("title").text().trim() || "Not Found";

        const metaDescription =
            $('meta[name="description"]').attr("content") || "Not Found";

        const h1Count = $("h1").length;

        const imagesWithoutAlt = $("img")
            .filter((_, img) => !$(img).attr("alt"))
            .length;

        const wordCount = $("body")
            .text()
            .replace(/\s+/g, " ")
            .trim()
            .split(" ")
            .filter(Boolean).length;

        return {
            status: response.status,
            responseTime: `${responseTime} ms`,
            title,
            metaDescription,
            h1Count,
            imagesWithoutAlt,
            wordCount
        };
    } catch (error) {
        if (error.code === "ECONNABORTED") {
            throw new Error("Request timed out.");
        }

        if (error.response) {
            throw new Error(`Website returned status ${error.response.status}.`);
        }

        throw new Error(error.message || "Failed to analyze website.");
    }
}

module.exports = { auditWebsite };