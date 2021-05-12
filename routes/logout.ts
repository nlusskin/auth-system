import express, { Request, Response } from 'express';
var router = express.Router();

import Knex from '../db/driver'

/* GET logout and clear credentials, redirect to index */
router.get('/', async function(req:Request, res: Response, next) {

  // pull refresh token out of cookie header
  let refTok = req.cookies._ref;

  // invalidate the current refresh token so it can't be used again
  await Knex('refreshTokens').update({
    revoked: 1
  }).where('token', refTok);

  // clear browser cookies to remove session
  res.clearCookie('_jwt');
  res.clearCookie('_ref');
  res.redirect('/');
  
});



export default router;
