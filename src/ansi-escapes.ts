// https://github.com/sindresorhus/ansi-escapes/blob/main/index.js
const ESC = '\u001B[';
const cursorShow = `${ESC}?25h`;
const cursorHide = `${ESC}?25l`;
const cursorUp = (count = 1) => `${ESC + count.toString()}A`;
const cursorLeft = `${ESC}G`;

const eraseLine = `${ESC}2K`;

const eraseLines = (count: number) => {
  let clear = '';

  for (let i = 0; i < count; i += 1) {
    clear += eraseLine + (i < count - 1 ? cursorUp() : '');
  }

  if (count) {
    clear += cursorLeft;
  }

  return clear;
};

export default { cursorShow, cursorHide, eraseLines };
