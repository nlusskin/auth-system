import { Request, Response, NextFunction } from 'express';

import JWT from './jwt';
import Knex from '../db/driver'

export default async function(req:Request, res:Response, next:NextFunction) {

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Method', '*')
  res.setHeader('Access-Control-Allow-Header', '*')
  // let authentication or index requests through
  if (req.path == '/authenticate' || req.path == '/') return next()

  let token = req.cookies._jwt;
  let refTok = req.cookies._ref;

  if (!token || !refTok) return res.sendStatus(403);

  let jwt = new JWT({jwt: token});
  // check if the token is valid
  if (jwt.validate()) next();

  else {
    // try to refresh the token by looking it up in the database
    let [validUserRefresh] = await Knex('refreshTokens')
      .where({token: refTok, revoked: 0})
      .select();

    if (validUserRefresh) {
      jwt = new JWT({sub: validUserRefresh.userId});
      let newRefTok = jwt.refreshToken();

      await Knex('refreshTokens')
        .update({ revoked: 1 })
        .where('token', refTok);

      res.setHeader('Set-Cookie', [`_jwt=${jwt.sign()}`, `_ref=${newRefTok}`]);

      next();
    }
    else {
      res.sendStatus(403);
    }
  }

}