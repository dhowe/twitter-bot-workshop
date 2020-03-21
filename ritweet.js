let fs = require('fs');
let sizeOf = require('image-size');
let text2png = require('text2png');
let mergeImages = require('merge-images');
let { Canvas, Image } = require('canvas');
let Twit = require('twit');
//let RiTa = require('rita');

class RiTweet {

  constructor(config) {
    if (!config) throw Error('No config');
    this.T = new Twit(config);
    this.tmp = config.tempdir || '/tmp';
    this.verbose = config.verbose || false;
  }

  tweet(text, cb) {
    this.T.post('statuses/update', { status: text }, cb || (e => {
      if (e) throw e;
    }));
  }

  tweetImage(imgPath, text, cb) {
    text = text || '';
    fs.readFile(imgPath, { encoding: 'base64' }, (e, imgData) => {
      if (e) throw e;
      this._tweetImageData(imgData, text, cb);
    });
  }

  tweetTextOverImage(imgPath, text, opts = {}, cb) {
    opts.textAlign = opts.textAlign || 'center';
    opts.writeFile = opts.writeFile || false;
    fs.writeFile(this.tmp + '/'+text+'.png', text2png(text, opts), e => {
      if (e) throw e;
      this.verbose && console.log('Wrote ' + this.tmp + '/text.png');
      let textDims = sizeOf(this.tmp + '/text.png');
      let imageDims = sizeOf(imgPath);
      let opacity = opts.opacity || 1;
      let xoff = opts.xOffset || 0, yoff = opts.yOffset || 0;
      let x = (opts.x || (imageDims.width - textDims.width) / 2) + xoff;
      let y = (opts.y || (imageDims.height - textDims.height) / 2) + yoff;
      mergeImages([imgPath, { src: this.tmp + '/text.png', x, y, opacity }], { Canvas, Image })
        .then(b64 => {
          this.verbose && console.log('Merged images');
          let b64Img = b64.split(';base64,').pop();
          if (opts.writeFile) {
            fs.writeFile(this.tmp + '/output.png', b64Img, { encoding: 'base64' }, e => {
              this.tweetImage(this.tmp + '/output.png', '', cb);
            });
          }
          else this._tweetImageData(b64Img, '', cb);
        });
    });
  }

  _tweetImageData(imgData, text, cb) {
    text = text || '';
    this.T.post('media/upload', { media_data: imgData }, (e, data) => {
      if (e) throw e;
      this.verbose && console.log('Uploaded image');
      this.T.post('statuses/update', {
        status: text, media_ids: [data.media_id_string]
      }, cb || (e => {
        if (e) throw e;
        this.verbose && console.log('Tweeted image');
      }));
    });
  }
}

module.exports = RiTweet;
