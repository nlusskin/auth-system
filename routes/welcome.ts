import express from 'express';
var router = express.Router();

/* GET welcome data */
router.get('/', function(req, res, next) {
  res.json({
    msg: 'Welcome world!'
  });
});

export default router;
