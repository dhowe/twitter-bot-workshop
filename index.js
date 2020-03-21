let fs = require('fs');
let conf = require('./config');
let RiTweet = require('./ritweet');

let rt = new RiTweet(conf, true);

//rt.tweet('the mushrooms are really coming');
//rt.tweetImage('img/mushroom.jpg', 'mushrooms');
rt.tweetTextOverImage('img/mushroom.jpg', 'Boom', {
  font: '80px Futura', opacity: 0.9, yOffset: 100
});
