var express = require('express');
var router = express.Router();

import JWT from '../src/jwt'

/* POST credentials and return status */
router.get('/', function(req, res, next) {
  let jwt = new JWT({sub: 'nick'})
  
  res.send('token: ' + jwt.sign());
});

export default router;
