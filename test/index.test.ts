import mockStdin from 'mock-stdin';
import cliSelect from '../src/index';
import keys from './test-helper/keys';
import { mockInput } from './test-helper/mock-functions';

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

  test('cancel with ctrl-c', async () => {
    mockInput(io, keys.ctrlC);

    const selectedItem = await cliSelect({ values: ['Test', 'Test1'] });

    expect(selectedItem).toBe(null);
  });

  test('cancel with escape', async () => {
    mockInput(io, keys.escape);

    const selectedItem = await cliSelect({ values: ['Test', 'Test1'] });

    expect(selectedItem).toBe(null);
  });
});
