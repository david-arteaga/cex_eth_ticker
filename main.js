const request = require('request');
const player = require('play-sound')({});

const timeout_ms = 500;
const url = 'https://cex.io/api/ticker/ETH/USD';
const alarmFile = './alarm.mp3';

if (process.argv.length < 3) {
  console.error('needs 1 input param: price');
  process.exit(1);
}

let minPrice = parseFloat(process.argv[2]);
try {
  minPrice = parseFloat(minPrice);
} catch (e) {
  console.error('param should be a number not ' + minPrice);
  process.exit(1);
}

let playing = false;
setInterval(() => {
  request(url, (error, response, body) => {
    if (!error) {
      const res = JSON.parse(body);
      const last = parseFloat(res.last);
      console.log(last);
      if (last <= minPrice) {
        if (!playing) {
          playing = true;
          player.play(alarmFile);
        }
      }
    } else {
      console.error('Could not complete request');
      console.error(error);
      process.exit(1);
    }
  });
}, timeout_ms);
