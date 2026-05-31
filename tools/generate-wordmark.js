const fs = require('fs');
const https = require('https');
const opentype = require('opentype.js');

const FONT_URL = 'https://github.com/fontsource/manrope/raw/latest/files/manrope-700-normal.ttf';
const OUT_PATH = 'tmp/manrope-700.ttf';
const TEXT = process.argv[2] || 'H&S Nahebau';
const SIZE = parseInt(process.argv[3], 10) || 26;
const X = parseInt(process.argv[4], 10) || 0;
const Y = parseInt(process.argv[5], 10) || SIZE;

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('Failed to download font: ' + res.statusCode));
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  try {
    fs.mkdirSync('tmp', { recursive: true });
    await download(FONT_URL, OUT_PATH);
    const font = opentype.loadSync(OUT_PATH);
    const path = font.getPath(TEXT, X, Y, SIZE);
    const d = path.toPathData(2);
    console.log(d);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
