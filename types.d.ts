interface JWT {
  aud: string
  exp: number
  iat: number
  iss: string
  sub: string
}

interface User {
  userId: string
  password?: string
  createdAt?: Date
}

interface RefreshToken {
  userId: string
  token: string
  revoked: boolean
  iat: Date
}

declare module '*.gif' {
  const content: string
  export default content;
}

// JWT
type JWTHeader = {
  alg: "HS256",
  typ: "JWT"
};

type JWTPayload = {
  iss: string,
  iat: number,
  exp: number,
  sub: string,
  aud: string
};

type JWTSignature = string;

type Secret = string;