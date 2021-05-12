import { Request, Response, NextFunction } from 'express';

import JWT from './jwt';
import Knex from '../db/driver'


export default async function(req:Request, res:Response, next:NextFunction) {
  const rtdb = Knex('refreshTokens');

  // let authentication or index requests through
  if (req.path == '/authenticate' || req.path == '/') return next();

  // pull jwt and refresh token out of the cookie header
  let token = req.cookies._jwt;
  let refTok = req.cookies._ref;

  // if both are missing fail auth. user will need a password grant
  if (!token && !refTok) return res.sendStatus(403);

  // instantiate and check if the token is valid
  let jwt = new JWT({jwt: token});
  if (jwt.validate()) next();
  else if (refTok) {
    // find the token in the db if it's not revoked
    let [validUserRefresh] = await rtdb
      .where({token: refTok, revoked: 0})
      .select();
    
    if (validUserRefresh) {
      // generate a new jwt & refresh token
      jwt = new JWT({sub: validUserRefresh.userId});
      let newRefTok = jwt.refreshToken();

      // revoke the old refresh token
      await rtdb
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