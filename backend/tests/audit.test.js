const { auditWebsite } = require("../services/auditService");

describe("Website Audit", () => {

    test("Valid website", async () => {
        const result = await auditWebsite("https://example.com");

        expect(result.status).toBe(200);
        expect(result.title).toBeDefined();
        expect(result.wordCount).toBeGreaterThan(0);
    });

    test("Invalid URL", async () => {
        await expect(auditWebsite("abc"))
            .rejects
            .toThrow("Invalid URL");
    });

    test("Non-existing website", async () => {
        await expect(
            auditWebsite("https://thiswebsitedoesnotexist123456.com")
        ).rejects.toThrow();
    });

});