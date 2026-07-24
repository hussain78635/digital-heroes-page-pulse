const express = require("express");
const router = express.Router();

const { auditWebsite } = require("../services/auditService");

router.post("/audit", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            success: false,
            message: "URL is required"
        });
    }

    try {
        const report = await auditWebsite(url);

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;