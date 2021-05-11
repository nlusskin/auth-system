import express, { Request, Response } from 'express';
var router = express.Router();

import JWT from '../src/jwt'

/* POST credentials and return status */
router.post('/', function(req:Request, res: Response, next) {

  let jwt = new JWT({sub: req.body.email});
  res.setHeader('Set-Cookie', [`_jwt=${jwt.sign()}`, `_ref=${jwt.refreshToken()}`]);
  res.sendStatus(200)
  
});



export default router;
