import { ObjectWritableMock } from 'stream-mock';
import SelectOptions from '../src/select-options';
import Renderer from '../src/renderer';

const cursorHide = '\x1B[?25l';
const eraseLine = '\x1B[2K';
const cursorUp = (cnt = 1) => `\x1B[${cnt}A`;
const cursorLeft = '\x1B[G';
const cursorShow = '\x1B[?25h';

describe('renderer test', () => {
  test('render', () => {
    const writeStream = new ObjectWritableMock();
    const selectOptions = new SelectOptions(['TEST', 'TEST2']);
    const renderer = new Renderer({ selectOptions }, writeStream);

    renderer.init();

    expect(writeStream.data[0]).toBe('\x1B[?25l');

    renderer.render();

    renderer.cleanup();

    const resultOutput = [cursorHide, '(x) TEST\n', '( ) TEST2', cursorShow];

    writeStream.data.forEach((data, i) => {
      expect(data).toBe(resultOutput[i]);
    });
  });

  test('change the selected item', () => {
    const writeStream = new ObjectWritableMock();
    const selectOptions = new SelectOptions(['TEST', 'TEST2']);
    const renderer = new Renderer({ selectOptions }, writeStream);

    renderer.init();

    expect(writeStream.data[0]).toBe('\x1B[?25l');

    selectOptions.selectNextOption();
    renderer.render();

    renderer.cleanup();

    const resultOutput = [cursorHide, '( ) TEST\n', '(x) TEST2', cursorShow];

    writeStream.data.forEach((data, i) => {
      expect(data).toBe(resultOutput[i]);
    });
  });

  test('render with isEraseLines option', () => {
    const writeStream = new ObjectWritableMock();
    const selectOptions = new SelectOptions(['TEST', 'TEST2']);
    const renderer = new Renderer(
      { selectOptions, isEraseLines: true },
      writeStream,
    );

    renderer.init();

    expect(writeStream.data[0]).toBe('\x1B[?25l');

    renderer.render();

    selectOptions.selectNextOption();
    renderer.render();

    renderer.cleanup();

    const resultOutput = [
      cursorHide,
      '(x) TEST\n',
      '( ) TEST2',
      `${eraseLine}${cursorUp()}${eraseLine}${cursorLeft}`,
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
