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