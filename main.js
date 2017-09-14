const request = require('request');
const player = require('play-sound')({});

const fs = require('fs');
const pricesFile = './eth_price.txt';

// cex has a hard limit on 600 requests per 10 minutes (1 request per minute)
const timeout_ms = 1 * 1000;
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
  try {
    request(url, (error, response, body) => {
      if (!error) {
        const res = JSON.parse(body);
        const last = parseFloat(res.last);
        console.log(date(parseFloat(res.timestamp)) + ': ' + last);

        const to_write = res.timestamp + ',' + last + '\n';
        fs.appendFileSync(pricesFile, to_write);
        if (last <= minPrice) {
          if (!playing) {
            playing = true;
            player.play(alarmFile);
          }
        }
      } else {
        console.error('Could not complete request');
        console.error(error);
      }
    });
  } catch (e) {
    console.error(e);
    console.error('Could not execute request');
  }
}, timeout_ms);

function date(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}
