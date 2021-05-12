import express, { Request, Response } from 'express';
var router = express.Router();


import Knex from '../db/driver'
import JWT from '../src/jwt';

/* POST settings return status */
router.post('/', async function(req:Request, res: Response, next) {

  // the body defines different settings to be updated
  // for now, we only have a password setting
  let pwdUpdate = req.body.password;

  let {sub: userId} = new JWT({jwt:req.cookies._jwt}).validate() as any

  // get the current user from the token
  let [existingUser] = await Knex('users')
    .select()
    .where('userId', userId);

  // if the request body defines a password section, update with the new info
  if (pwdUpdate) {
    // if the current password provided is wrong, return an error
    if (existingUser.password !== pwdUpdate.currentPassword) {
      return res.json({error: 'Current password is incorrect.'});
    }
    // otherwise, update the password
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
