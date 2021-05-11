const request = require('supertest');
var app = require('../app');
const { default: Knex } = require('../db/driver');
const { default: JWT } = require('../src/jwt');

app = app['default'];
const userId = 'test_user_agX1j4fG9@b6dNoby7ve.net';

afterAll(() => {
  Knex('users').delete().where('userId', userId)
})


describe("Test user creation", () => {
  test("Should respond with token payload", async () => {

    const response = await request(app)
      .post("/authenticate")
      .send({
        email: userId,
        password: 'test',
        create: true,
        createdAt: Date.now()
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
        userId: userId,
        token: expect.any(String),
        refreshToken: expect.any(String),
    });
  });
});


describe("Test user fetch", () => {
  test("Should respond with token payload", async () => {

    let token = new JWT({sub: userId}).sign();

    const response = await request(app)
    .get("/authenticate")
    .set('Cookie', `_jwt=${token};`);

    expect(response.body).toMatchObject({
      sub: userId,
    });
  });
});
