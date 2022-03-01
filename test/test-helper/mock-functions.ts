import mockStdin from 'mock-stdin';

export const mockInput = (io: mockStdin.MockSTDIN, value: string) => {
  setTimeout(() => io.send(value), 5);
};
