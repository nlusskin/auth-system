import { Request, Response, NextFunction } from 'express';

import JWT from './jwt';

export default function(req:Request, res:Response, next:NextFunction) {

  // let authentication requests through
  if (req.path == '/authenticate') next()

  let token = req.cookies._jwt;
  let refToken = req.cookies._ref;
  let jwt = new JWT({jwt: token})
  
  if (jwt.validate()) next();
  else {
    //res.send(403)
  }
  res.render('index', { title: 'EngagedMD Case Study' });

}