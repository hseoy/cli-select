import { ObjectWritableMock } from 'stream-mock';
import Renderer from '../src/renderer';

const cursorHide = '\x1B[?25l';
const eraseLine = '\x1B[2K';
const cursorUp = (cnt = 1) => `\x1B[${cnt}A`;
const cursorLeft = '\x1B[G';
const cursorShow = '\x1B[?25h';

describe('renderer test', () => {
  const valueRenderer = (value: string, selected: boolean) => ({
    value,
    symbol: selected ? '(x)' : '( )',
  });

  test('render', () => {
    const writeStream = new ObjectWritableMock();
    const renderer = new Renderer(writeStream);

    renderer.init();

    expect(writeStream.data[0]).toBe('\x1B[?25l');

    renderer.render({ values: ['TEST', 'TEST2'], valueRenderer });

    renderer.cleanup();

    const resultOutput = [
      cursorHide,
      '(x) TEST\n',
      '( ) TEST2',
      `${eraseLine}${cursorUp()}${eraseLine}${cursorLeft}`,
      cursorShow,
    ];

    writeStream.data.forEach((data, i) => {
      expect(data).toBe(resultOutput[i]);
    });
  });

  test('change the selected item', () => {
    const writeStream = new ObjectWritableMock();
    const renderer = new Renderer(writeStream);

    renderer.init();

    expect(writeStream.data[0]).toBe('\x1B[?25l');

    renderer.render({
      values: ['TEST', 'TEST2'],
      valueRenderer,
      selectedValue: 1,
    });

    renderer.cleanup();

    const resultOutput = [
      cursorHide,
      '( ) TEST\n',
      '(x) TEST2',
      `${eraseLine}${cursorUp()}${eraseLine}${cursorLeft}`,
      cursorShow,
    ];

    writeStream.data.forEach((data, i) => {
      expect(data).toBe(resultOutput[i]);
    });
  });
});
