import mockStdin, { MockSTDIN } from 'mock-stdin';
import cliSelect from '../src/index';
import keys from './test-helper/keys';

const mockInput = (io: MockSTDIN, value: string) => {
  setTimeout(() => io.send(value), 500);
};

describe('cliSelect module test', () => {
  const io = mockStdin.stdin();

  test('choose an first item', async () => {
    mockInput(io, keys.enter);

    const selectedItem = await cliSelect({ values: ['Test', 'Test1'] });

    expect(selectedItem).toEqual({ value: 'Test', id: 0 });
  });

  test('choose an next item', async () => {
    mockInput(io, keys.down);
    mockInput(io, keys.enter);

    const selectedItem = await cliSelect({ values: ['Test', 'Test1'] });

    expect(selectedItem).toEqual({ value: 'Test1', id: 1 });
  });
});
