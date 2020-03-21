let fs = require('fs');
let conf = require('./config');
let RiTa = require('rita');
let Twit = require('twit');
let T = new Twit(conf);

tweetWithImage('exhaustion is human', './masquerading.jpg');

function tweet(text) {
  T.post('statuses/update', { status: text }, (e, data, resp) => {
    if (e) throw e;
    console.log(data);
  });
}

function tweetWithImage(text, imgPath, altText) {
  altText = altText || 'image';
  let b64img = fs.readFileSync(imgPath, { encoding: 'base64' })
  if (b64img) console.log('loaded image');
  T.post('media/upload', { media_data: b64img }, (e, data, resp) => {
    if (e) throw e;
    console.log('Image uploaded!');
    console.log('Now tweeting it...');
    T.post('statuses/update', {
      status: text, media_ids: new Array(data.media_id_string)
    }, (e, data, resp) => {
        if (e) throw e;
        console.log('Posted image!');
      }
    );
  });
}
