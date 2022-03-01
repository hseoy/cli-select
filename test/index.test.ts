import mockStdin, { MockSTDIN } from 'mock-stdin';
import cliSelect from '../src/index';
import keys from './test-helper/keys';

const mockInput = (io: MockSTDIN, value: string) => {
  setTimeout(() => io.send(value), 500);
};

describe('cliSelect module test', () => {
  const io = mockStdin.stdin();

  test('choose an item', async () => {
    mockInput(io, keys.escape);

    const value = await cliSelect();

    console.log(value);
  });
});
