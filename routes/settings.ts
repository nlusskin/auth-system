import express, { Request, Response } from 'express';
var router = express.Router();


import Knex from '../db/driver'
import JWT from '../src/jwt';

/* POST settings return status */
router.post('/', async function(req:Request, res: Response, next) {

  // pull out fields from body
  let pwdUpdate = req.body.password;

  let {sub: userId} = new JWT({jwt:req.cookies._jwt}).validate() as any

  // get the current user
  let [existingUser] = await Knex('users')
    .select()
    .where('userId', userId);


  if (pwdUpdate) {
    if (existingUser.password !== pwdUpdate.currentPassword) {
      return res.json({error: 'Current password is incorrect.'});
    }
    else {
      await Knex('users')
        .update({
          password: pwdUpdate.newPassword
        })
        .where('userId', userId);
      
      return res.json({ success: true });
    }
  } 

});

export default router;
