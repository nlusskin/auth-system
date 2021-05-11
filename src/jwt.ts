/**
 * A custom-built barebones JWT signing/validating class
 * 5/10/21 - Nick Lusskin
*/

import crypto from 'crypto';

const validTime = parseInt(process.env.JWT_EXP!) || 36000;

class JWT {
  private secret: Secret;
  private header: JWTHeader;
  private payload?: JWTPayload;
  private jwt?: JWTToken

  /**
   * Build the JWT class for signing and verifying tokens
   * @param pl Either a JWT Payload, requiring 'sub' parameter or { jwt: string } object
   */
  constructor(pl: JWTPartial | JWTToken) {

    // header is always the same
    this.header = {
      alg: "HS256",
      typ: "JWT"
    };

    // validate the secret
    this.secret = this.properSecret(process.env.JWT_SECRET!);

    // parse the payload or verify token if the 'jwt' parameter is set
    if(!(pl as JWTToken)?.jwt) {
      this.payload = this.fillPayload(pl as JWTPartial);
    }
    else {
      this.jwt = pl as JWTToken
    }
    
  };

  /**
   * Utility function to encode objects as b64 strings
   * @param os object
   * @returns string
   */
  private b64UrlEncode = (os: object|string): string => {
    let objstr = typeof os == 'object' ? JSON.stringify(os) : os;
    let b64str = Buffer.from(objstr, 'utf8').toString('base64');

    return b64str
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  /**
   * Utility function to b64 strings
   * @param os object
   * @returns string | object
   */
  private b64Decode = (os: string): string | object => {
    let b64str = Buffer.from(os, 'base64').toString('utf8');

    b64str = b64str
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    try {
      return JSON.parse(b64str);
    }
    catch (e) {
      return b64str;
    }
  };

   /**
   * Utility function to url encode strings
   * @param os object
   * @returns string
   */
  private urlEncode = (b: string) => {
    return b
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  /**
   * Creates the full JWT payload with any overrides passed as params
   * @param pl JWTPayload?, JWTPayload['sub'] required
   * @returns JWTPayload
   */
  private fillPayload = (pl:JWTPartial): JWTPayload => {
    let fpl:JWTPayload = {
      iss: 'emdcs',
      iat: new Date(),
      exp: new Date(Date.now() + validTime),
      aud: 'default',
      ...pl
    };
    
    return fpl;
  };

  /**
   * Verifies the secret
   * @param secret string
   */
  private properSecret = (secret: string) => {
    if (!secret)
      throw new Error('Secret is not provided. Check your environment file for \'JWT_SECRET\' and make sure it is a valid string');
    if (secret.length < 32)
      console.warn('[WARN] Secret is too short. Create a stronger JWT secret.');
    
    return secret;
  };

  /**
   * Signs and returns the full JWT
   * @returns string
   */
  sign = (p?:JWTPayload) => {
    if (!this.payload) throw new SigningError();

    const hmac = crypto.createHmac('sha256', this.secret);

    let header = this.b64UrlEncode(this.header);
    let payload = this.b64UrlEncode(p || this.payload!);
    let toSign = `${header}.${payload}`;
    
    hmac.update(toSign);

    let sig = this.urlEncode(hmac.digest('base64'));

    let token = `${header}.${payload}.${sig}`;

    return token;
  };

  /**
   * Validates the JWT and returns the payload, otherwise throws ValidationError
   * @param jwt string
   * @returns JWTPayload
   */
  validate = (): JWTPayload | boolean => {
    if (!this.jwt) return false;
    
    let [h, p, s] = this.jwt!.jwt.split('.');
    if (!(h && p && s)) throw new Error('Invalid token format')

    const hmac = crypto.createHmac('sha256', this.secret);

    let toSign = `${h}.${p}`;
    hmac.update(toSign);
    let sig = this.urlEncode(hmac.digest('base64'));

    let pl = this.b64Decode(p) as JWTPayload;

    if(crypto.timingSafeEqual(Buffer.from(sig, 'base64'), Buffer.from(s, 'base64')) && pl.exp > new Date()) {
      return pl;
    }
    else {
      return false;
    }
  }

  refreshToken = () => {
    if (!this.payload) throw new Error('Valid payload needed to generate refresh token');

    let pl = `${this.payload!.sub}.${Date.now() / 1000}`;
    const hmac = crypto.createHmac('sha256', this.secret);
    pl = this.b64UrlEncode(pl);
    hmac.update(pl);

    return this.urlEncode(hmac.digest('base64'));
  }

};


/**
 * Validation Error class
 */
class ValidationError {
  msg: string;
  constructor() {
    this.msg = 'Could not validate token';
  }
}
/**
 * Signing Error class
 */
class SigningError {
  msg: string;
  constructor() {
    this.msg = 'Could not sign payload';
  }
}

export default JWT;

// type declarations

type JWTPartial = Partial<JWTPayload> & Pick<JWTPayload,'sub'>;
type JWTToken = { jwt: string};

type JWTHeader = {
  alg: "HS256",
  typ: "JWT"
};

type JWTPayload = {
  iss: string,
  iat: Date,
  exp: Date,
  sub: string,
  aud: string
};

type JWTSignature = string;

type Secret = string;