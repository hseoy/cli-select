import { Key } from 'readline';
import mockStdin, { MockSTDIN } from 'mock-stdin';
import KeyInput from '../src/key-input';
import keys from './test-helper/keys';
import { mockInput } from './test-helper/mock-functions';

const keyInputTest = (io: MockSTDIN, value: string) => {
  mockInput(io, value);

  const keyInput = new KeyInput();

  return new Promise<Key>(resolve => {
    keyInput.open();
    keyInput.setInputListener(key => {
      keyInput.close();
      return resolve(key);
    });
  });
};

describe('key input test', () => {
  let io: mockStdin.MockSTDIN;

  beforeAll(() => {
    io = mockStdin.stdin();
  });
  afterAll(() => io.restore());

  test('up', async () => {
    const key = await keyInputTest(io, keys.up);
    expect(key.name).toBe('up');
  });

  test('down', async () => {
    const key = await keyInputTest(io, keys.down);
    expect(key.name).toBe('down');
  });

  test('enter(return)', async () => {
    const key = await keyInputTest(io, keys.enter);
    expect(key.name).toBe('return');
  });

  test('space', async () => {
    const key = await keyInputTest(io, keys.space);
    expect(key.name).toBe('space');
  });

  test('escape', async () => {
    const key = await keyInputTest(io, keys.escape);
    expect(key.name).toBe('escape');
  });

  test('ctrl-c', async () => {
    const key = await keyInputTest(io, keys.ctrlC);
    expect(key.ctrl).toBeTruthy();
    expect(key.name).toBe('c');
  });
});
