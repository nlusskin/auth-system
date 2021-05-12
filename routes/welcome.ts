import express from 'express';
var router = express.Router();

import images from '../lib/images'

/* GET welcome data */
router.get('/', function(req, res, next) {

  // grab the url of a random image from the array
  let imglen = images.length;
  let imgind = Math.floor(Math.random() * 100) % imglen;
  let imgurl = images[imgind].urls.regular;

  // get the name day of the week from it's index value
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

  // send the day of the week message and image url
  res.json({
    msg: `Happy ${day}!`,
    img: imgurl
  });
});

export default router;
