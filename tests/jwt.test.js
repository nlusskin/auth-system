const request = require('supertest');
const { default: JWT } = require('../lib/jwt');

const userId = 'test@example.net';

describe("Test JWT signing", () => {
  test("Should respond with signed JWT", async () => {
    let signedToken = generateToken();
    let payload = signedToken.split('.')[1];
    payload = decodeBase64(payload);
    
    expect(payload.sub).toBe(userId);
  });
});

describe("Test JWT validation", () => {
  test("Should respond with payload", async () => {
    let signedToken = generateToken();
    let payload = new JWT({jwt: signedToken}).validate()
    
    expect(payload.sub).toBe(userId);
  });
});

describe("Test JWT validation of invalid token", () => {
  test("Should throw error", async () => {
    let badtoken = new JWT({jwt: 'somerandomtext.'})
    
    expect(() => badtoken.validate()).toThrow('Invalid token format');
  });
});


// generate a token
function generateToken() {
  
  const jwt = new JWT({sub: userId});
  let signedToken = jwt.sign();
  return signedToken;
}

// decode base64 string
function decodeBase64(s) {
  let b64str = Buffer.from(s, 'base64').toString('utf8');
  
  b64str = b64str
  .replace(/-/g, '+')
    .replace(/_/g, '/');
    
    return JSON.parse(b64str);
  }
  
  