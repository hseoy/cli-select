// https://github.com/sindresorhus/ansi-escapes/blob/main/index.js

export const ESC = '\u001B[';
export const cursorShow = `${ESC}?25h`;
export const cursorHide = `${ESC}?25l`;
export const cursorUp = (count = 1) => `${ESC + count.toString()}A`;
export const cursorLeft = `${ESC}G`;

export const eraseLine = `${ESC}2K`;
export const eraseScreen = `${ESC}2J`;

export const eraseLines = (count: number) => {
  let clear = '';

  for (let i = 0; i < count; i += 1) {
    clear += eraseLine + (i < count - 1 ? cursorUp() : '');
  }

  if (count) {
    clear += cursorLeft;
  }
  return clear;
};

export const cursorGetPosition = `${ESC}6n`;
