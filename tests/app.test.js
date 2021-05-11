const request = require('supertest');
var app = require('../app');
app = app['default'];


describe("Test the app's root", () => {
  test("Should respond with index template", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
