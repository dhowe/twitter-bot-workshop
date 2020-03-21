let fs = require('fs');
//let sharp = require('sharp');
let text2png = require('text2png');
let mergeImages = require('merge-images');
let { Canvas, Image } = require('canvas');

/*
  text 	(required)
  option.font 	'30px sans-serif'
  option.textAlign 	'left'
  option.color (or option.textColor) 	'black'
  option.backgroundColor (or option.bgColor) 	'transparent'
  option.lineSpacing 	0
  option.strokeWidth 	0
  option.strokeColor 	'white'
  option.padding 	0
  option.padding(Left|Top|Right|Bottom) 	0
  option.borderWidth 	0
  option.border(Left|Top|Right|Bottom)Width 	0
  option.borderColor 	'black'
  option.localFontPath
  option.localFontName
  option.output 	'buffer'
*/
function textOverImage(text, imgPath, opts = {}, cb) {
  fs.writeFile('text.png', text2png(text, opts), e => {
    if (e) throw e;
    console.log('wrote text.png');
    if (0) {
      sharp(imgPath)
        .composite([{ input: 'text.png', gravity: 'southeast' }])
        .toFile('output.png');
    }
    mergeImages([imgPath, 'text.png'], { Canvas, Image })
      .then(b64 => {
        console.log('merged text.png with ' + imgPath);
        let b64Img = b64.split(';base64,').pop();
        fs.writeFile('output.png', b64Img, { encoding: 'base64' }, cb);
      });
  });
}

textOverImage('Humanity!', './mushroom.png', {
  input: 'text.png',
  font: '80px Futura',
  textAlign: 'center'
}, e => {
  if (e) throw e;
  console.log('wrote: output.png');
});
