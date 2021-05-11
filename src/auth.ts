import { Request, Response, NextFunction } from 'express';

import JWT from './jwt';
import Knex from '../db/driver'

export default async function(req:Request, res:Response, next:NextFunction) {

  // let authentication requests through
  if (req.path == '/authenticate') next()

  let token = req.cookies._jwt;
  let refToken = req.cookies._ref;
  let jwt = new JWT({jwt: token})
  // check if the token is valid
  if (jwt.validate()) next();

  else {
    // try to refresh the token by looking it up in the database
    let [validUserRefresh] = await Knex.select('userId')
      .from('refreshTokens')
      .where({token: refToken, revoked: false});

    if (validUserRefresh) {
      jwt = new JWT({sub: validUserRefresh.userId});

      res.setHeader('Set-Cookie', [`_jwt=${jwt.sign()}`, `_ref=${jwt.refreshToken()}`]);

      next();
    }
    else {
      res.sendStatus(403);
    }
  }
  res.render('index', { title: 'EngagedMD Case Study' });

}