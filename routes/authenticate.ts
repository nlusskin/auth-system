import express, { Request, Response } from 'express';
var router = express.Router();

import JWT from '../lib/jwt'
import Knex from '../db/driver'

/* POST credentials and return status */
router.post('/', async function(req:Request, res: Response, next) {

  // pull out fields from body
  let email = req.body.email;
  let password = req.body.password;
  let create = req.body.create;

  // do a lazy email sanitization
  if (!/.+@.+\..+/.test(email)) return res.send(400);

  // check if the user exists
  let [existingUser] = await Knex.select('*')
    .from('users')
    .where('userId', email)

  if (existingUser && existingUser.password !== password) {
    return res.sendStatus(403);
  }

  // set up a jwt
  let jwt = new JWT({sub: email});
  let jwtTok = jwt.sign();
  let refTok = jwt.refreshToken();
  

  if (!existingUser) {
    // avoid creating identities for mistyped emails
    if (!create) return res.sendStatus(403);
    
    // create the user in the database
    await Knex('users').insert({
      userId: email,
      password: password,
      createdAt: new Date()
    });
  }
  // add the new refresh token to the database
  await Knex('refreshTokens').insert({
    userId: email,
    token: refTok,
    revoked: false,
    iat: new Date()
  });

  // set appropriate cookie headers and return the token payload in response body
  res.setHeader('Set-Cookie', [`_jwt=${jwtTok}`, `_ref=${refTok}`]);
  res.status(201).json({
    userId: email,
    token: jwtTok,
    refreshToken: refTok
  });
  
});


/* GET auth status and return user */
router.get('/', async function(req:Request, res:Response, next) {
  // pull out jwt from cookie header
  let jwt = new JWT({jwt: req.cookies._jwt});

  // validate the jwt
  let pl = jwt.validate();

  // if pl is false, token could not be validated
  // we'll use a token grant to attempt refreshing it
  if (!pl) {
    return res.status(403).send({error: true});
  }
  else {
    return res.json(pl);
  }

})

export default router;
