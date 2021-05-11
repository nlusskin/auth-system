import express, { Request, Response } from 'express';
var router = express.Router();

import Knex from '../db/driver'

/* GET logout and clear credentials, redirect to index */
router.get('/', async function(req:Request, res: Response, next) {

  let refTok = req.cookies._ref;

  await Knex('refreshTokens').update({
    revoked: 1
  }).where('token', refTok);

  res.clearCookie('_jwt');
  res.clearCookie('_ref');
  res.redirect('/');
  
});



export default router;
