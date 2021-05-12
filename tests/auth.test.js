const request = require('supertest');
var app = require('../app');
const { default: JWT } = require('../lib/jwt');
const { default: Knex } = require('../db/driver')

app = app['default'];
const userId = 'test_not_real_user';


beforeAll(() => {
  Knex('users').insert({
    userId: userId,
    password: 'test',
    createdAt: Date.now()
  });
})

afterAll(() => {
  Knex('users').delete().where('userId', userId)
})


describe("Test the authentication middleware on valid JWT", () => {
  test("Should respond with status: 200", async () => {

    const token = new JWT({sub: userId}).sign();

    const response = await request(app)
    .get("/welcome")
    .set('Cookie', `_jwt=${token};_ref=na;`);

    expect(response.statusCode).toBe(200);
  });
});


describe("Test the authentication middleware on expired JWT without valid refresh token", () => {
  test("Should respond with status: 200", async () => {

    const token = new JWT({sub: userId, exp: 0}).sign();

    const response = await request(app)
      .get("/welcome")
      .set('Cookie', `_jwt=${token};_ref=na;`);

    expect(response.statusCode).toBe(403);
  });
});


describe("Test the authentication middleware on expired JWT with valid refresh token", () => {
  test("Should respond with status: 200", async () => {
    
    const rtdb = Knex('refreshTokens');
    const jwt = new JWT({sub: userId, exp: 0})
    let token = jwt.sign();
    let refToken = jwt.refreshToken();

    await rtdb.insert({
      userId: userId,
      token: refToken,
      revoked: false,
      iat: Date.now()
    });

    const response = await request(app)
    .get("/welcome")
    .set('Cookie', `_jwt=${token};_ref=${refToken};`);

    expect(response.statusCode).toBe(200);
    expect(response.headers['set-cookie'][0]).toMatch(/(_jwt|_ref)/)
    expect(response.headers['set-cookie'][1]).toMatch(/(_jwt|_ref)/)

    await rtdb.delete().where('token', refToken);
  });
});
