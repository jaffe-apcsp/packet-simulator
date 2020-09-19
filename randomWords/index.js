const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const WORD_SIZE = 6;
const WORD_COUNT = 7;
const PLAYERS = 2;

for (let p=0; p<PLAYERS; p++) {
  let strArray = [];
  for (let i = 0; i < WORD_COUNT; i++) {
    let str = '';
    for (let j = 0; j < WORD_SIZE; j++) {
      str += CHARSET.substr(Math.random() * CHARSET.length, 1);
    }
    strArray.push(str);
  }
  console.log(strArray.join(' '));
}
