import express from 'express';
var router = express.Router();

import images from '../src/images'

/* GET welcome data */
router.get('/', function(req, res, next) {

  let imglen = images.length;
  let imgind = Math.floor(Math.random() * 100) % imglen;
  let imgurl = images[imgind].urls.regular;

  let dayind = new Date().getDay();
  let day = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ][dayind]

  res.json({
    msg: `Happy ${day}!`,
    img: imgurl
  });
});

export default router;
