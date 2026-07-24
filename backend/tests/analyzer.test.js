const request = require("supertest");
const app = require("../server");


describe("Page Pulse API Tests",()=>{


test("Happy path - valid URL", async()=>{

    const response = await request(app)
    .post("/analyze")
    .send({
        url:"https://example.com"
    });


    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("title");

});


test("Invalid URL should return 400", async()=>{

    const response = await request(app)
    .post("/analyze")
    .send({
        url:"abc123"
    });


    expect(response.statusCode).toBe(400);

});


test("Missing URL should return 400", async()=>{

    const response = await request(app)
    .post("/analyze")
    .send({});


    expect(response.statusCode).toBe(400);

});


});