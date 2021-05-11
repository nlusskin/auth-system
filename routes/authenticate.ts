import express, { Request, Response } from 'express';
var router = express.Router();

import JWT from '../src/jwt'
import Knex from '../db/driver'

/* POST credentials and return status */
router.post('/', async function(req:Request, res: Response, next) {

  let email = req.body.email;
  let password = req.body.password;

  let [existingUser] = await Knex.select('*')
    .from('users')
    .where('userId', email)

  if (existingUser.password !== password) {
    return res.sendStatus(403);
  }

  let jwt = new JWT({sub: email});
  
  if (!existingUser) {
    await Knex('users').insert({
      userId: email,
      password: password,
      createdAt: new Date()
    });
  }
  await Knex('refreshTokens').insert({
    userId: email,
    token: jwt.refreshToken(),
    revoked: false,
    iat: new Date()
  });

  res.setHeader('Set-Cookie', [`_jwt=${jwt.sign()}`, `_ref=${jwt.refreshToken()}`]);
  res.sendStatus(200);
  
});



export default router;
